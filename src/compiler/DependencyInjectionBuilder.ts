import * as ts from "typescript";
import {TypeExportable} from "../../tests/utils/TypeExportable";
import {ConstructorService} from "./ConstructorService";
import {ServiceProviderAutoBind} from "./emitters/ServiceProviderAutoBind";
import {HeritageFacade} from "./facades/HeritageFacade";
import {GraphNodeServiceFactory} from "./GraphNodeServiceFactory";
import {AppProviderFileBuilder} from "./sourceFiles/AppProviderFileBuilder";
import AstService from "./sourceFiles/AstService";
import {GraphSourceFileBuilder} from "./sourceFiles/GraphSourceFileBuilder";
import SourceFileVisitor from "./SourceFIleVisitor";
import ProviderTransformerFactory from "./transformers/ProviderTransformerFactory";

export class DependencyInjectionBuilder {

    private sourceFileVisitor: SourceFileVisitor;

    private serviceProviderBind: ServiceProviderAutoBind;

    private serviceProviderBuilder: AppProviderFileBuilder;

    private dependencyGraphBuilder: GraphSourceFileBuilder;

    private checker: ts.TypeChecker;

    private heritageFacade = new HeritageFacade();

    public constructor(checker: ts.TypeChecker, sourceFileVisitor: SourceFileVisitor) {
        this.sourceFileVisitor = sourceFileVisitor;
        this.checker = checker;

        this.serviceProviderBind = new ServiceProviderAutoBind(this.heritageFacade, checker, new TypeExportable());

        const astService = new AstService(checker);

        this.serviceProviderBuilder = new AppProviderFileBuilder(
            "./.ana/containers/generated-container.ts",
            astService,
        );

        const graphNodeService = (new GraphNodeServiceFactory()).createService(checker);
        const constructorService = new ConstructorService(graphNodeService, checker);
        this.dependencyGraphBuilder = new GraphSourceFileBuilder(
            "./.ana/graphs/dependencyGraph.ts",
            astService,
            constructorService,
        );
    }

    public registerSourceFile(sourceFile: ts.SourceFile): void {
        const types = this.sourceFileVisitor.visit(sourceFile, this.checker) as ts.InterfaceType[];

        for (const type of types) {
            this.serviceProviderBind.bindType(type, this.serviceProviderBuilder);

            if (sourceFile.isDeclarationFile) {
                continue;
            }

            this.dependencyGraphBuilder.addNodeFromType(type);
        }
    }

    public build(program: ts.Program): void {
        const graphFile = this.dependencyGraphBuilder.getSourceFile();

        ts.sys.writeFile(graphFile.fileName, ts.createPrinter().printFile(graphFile));

        const file = this.serviceProviderBuilder.getSourceFile();

        ts.sys.writeFile(file.fileName, ts.createPrinter().printFile(file));

        const builder = ts.createProgram(
            [...program.getRootFileNames(), file.fileName],
            program.getCompilerOptions(),
            undefined,
            program,
        );

        const generatedContainer = builder.getSourceFile("./.ana/containers/generated-container.ts")!;

        this.emitTransformedContainer(generatedContainer, builder);
    }

    private emitTransformedContainer(containerSource: ts.SourceFile, program: ts.Program): void {
        const transformer = new ProviderTransformerFactory(program.getTypeChecker(), this.heritageFacade);
        program.emit(
            containerSource,
            undefined,
            undefined,
            false,
            {before: [transformer.createTransformerFactory]},
        );
    }
}
