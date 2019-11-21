import { expect } from "chai";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as sinonts from "ts-sinon";
import {AppProviderFileBuilder} from "../../src/sourceFiles/AppProviderFileBuilder";

import * as ts from "typescript";
import {createProgram} from "typescript";

import ProviderAstService, {ITypeImport} from "../../src/sourceFiles/ProviderAstService";
import { assertStructuralEquals } from "../utils/asserts";

chai.use(sinonChai);


describe("AppProviderFileBuilder", () => {
    const path = "tests/cases/ClassWithExternalInterface.ts";

    const classWithInterfaceProgram = createProgram([path], { });

    it("should an empty boilerplate for file builder", () => {


        const builder = new AppProviderFileBuilder(
            "generatedAppContainer.ts",
            new ProviderAstService(classWithInterfaceProgram.getTypeChecker()),
        );

        const ast = builder.getSourceFile();

        const conform = ts.createSourceFile(
            "",
            ts.sys.readFile("tests/cases/conformance/EmptyAppProvider.ts")!,
            ts.ScriptTarget.Latest, false, ts.ScriptKind.TS,
        );

        assertStructuralEquals(ast, conform);
    });

    it("should add a new bind to the provider", () => {
        const astService = sinonts.stubConstructor(ProviderAstService);

        const builder = new AppProviderFileBuilder("generatedAppContainer.ts", astService);

        const fromType = sinonts.stubInterface<ts.InterfaceType>();
        const toType = sinonts.stubInterface<ts.InterfaceType>();
        astService.getFullyQualifiedName.withArgs(fromType).returns("fromType");
        astService.getFullyQualifiedName.withArgs(toType).returns("toType");
        astService.createImportDeclaration.returns(sinonts.stubInterface<ITypeImport>());

        builder.addBind(fromType, toType);

        expect(astService.createBindingExpression).to.have.been.callCount(1);
        expect(astService.createImportDeclaration).to.have.been.calledWith(fromType);
        expect(astService.createImportDeclaration).to.have.been.calledWith(toType);
    });

    it("should import only once a type", () => {
        const astService = sinonts.stubConstructor(ProviderAstService);

        const builder = new AppProviderFileBuilder("generatedAppContainer.ts", astService);

        const fromType = sinonts.stubInterface<ts.InterfaceType>();
        const toType = sinonts.stubInterface<ts.InterfaceType>();
        astService.getFullyQualifiedName.withArgs(fromType).returns("fromType");
        astService.getFullyQualifiedName.withArgs(toType).returns("toType");
        astService.createImportDeclaration.returns(sinonts.stubInterface<ITypeImport>());

        builder.addBind(fromType, toType);
        builder.addBind(fromType, toType);

        expect(astService.createImportDeclaration.withArgs(fromType)).to.have.been.calledOnceWith(fromType);
        expect(astService.createImportDeclaration.withArgs(toType)).to.have.been.calledOnceWith(toType);

    });

    it("should generate a complete valid service provider", () => {
        const secondPath = "tests/cases/SecondClassWithExternalInterface.ts";

        const interfacePath = "tests/cases/ExternalInterface.ts";
        const secondInterfacePath = "tests/cases/SecondExternalInterface.ts";
        const program = createProgram([path, interfacePath, secondInterfacePath, secondPath], { });

        const builder = new AppProviderFileBuilder("", new ProviderAstService(program.getTypeChecker()));


        const node = program.getSourceFile(interfacePath)!.statements[0];
        const interface1 = program.getTypeChecker().getTypeAtLocation(node) as ts.InterfaceType;

        program.getSourceFile(secondInterfacePath)!.fileName = secondInterfacePath;

        const node2 = program.getSourceFile(secondInterfacePath)!.statements[0];
        const interface2 = program.getTypeChecker().getTypeAtLocation(node2) as ts.InterfaceType;

        const class1 = program.getTypeChecker().getTypeAtLocation(
            program.getSourceFile(path)!.statements[1],
        ) as ts.InterfaceType;

        const class2 = program.getTypeChecker().getTypeAtLocation(
            program.getSourceFile(secondPath)!.statements[1],
        ) as ts.InterfaceType;

        builder.addBind(interface2, class2);

        builder.addBind(interface1, class1);

        const output = ts.createPrinter().printFile(builder.getSourceFile());
        expect(output).to.eql(ts.sys.readFile("tests/cases/conformance/AppProviderConfigured.ts"));
    });
});
