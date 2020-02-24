import { expect } from "chai";
import * as sinonts from "ts-sinon";
import * as ts from "typescript";
import {createProgram} from "typescript";
import {ConstructorService} from "../../src/compiler/ConstructorService";
import {GraphNodeService, INodeTypeObject} from "../../src/compiler/GraphNodeService";
import {ClassNodeTransformer} from "../../src/compiler/graphNodeTypes/ClassNodeTransformer";
import {InterfaceNodeTransformer} from "../../src/compiler/graphNodeTypes/InterfaceNodeTransformer";
import AstService from "../../src/compiler/sourceFiles/AstService";
import { GraphSourceFileBuilder } from "../../src/compiler/sourceFiles/GraphSourceFileBuilder";
import {printCode} from "../utils/printer";

describe("GraphSourceFileBuilder", function() {
    const createBuilder = () => {
        const astService = sinonts.stubConstructor(AstService);
        const constructorService =  sinonts.stubConstructor(ConstructorService);
        constructorService.transformSignature.returns([{} as INodeTypeObject]);

        astService.createImportDeclaration.returns(
            {identifier: sinonts.stubInterface(), declaration: sinonts.stubInterface()},
        );

        return new GraphSourceFileBuilder("file.ts", astService, constructorService);
    };

    it("should generate an empty graph", function() {
        const graph = new GraphSourceFileBuilder(
            "file.ts",
            sinonts.stubConstructor(AstService),
            sinonts.stubConstructor(ConstructorService),
        );
        const file = ts.createPrinter().printFile(graph.getSourceFile());

        expect(graph.getSourceFile().fileName).to.eq("file.ts");
        expect(file).to.eq(ts.sys.readFile("tests/cases/conformance/emptyGraph.ts"));
    });

    it("should accept an interface type", function() {
        const type = {
            getConstructSignatures(): readonly ts.Signature[] {
                return [];
            },
        } as ts.InterfaceType;
        const graph = createBuilder();

        graph.addNodeFromType(type);
        expect(graph.getImports().length).to.eq(1);
        expect(graph.getStatements().length).to.eq(1);
    });

    it("should add a statement", function() {
        const type = {
            getConstructSignatures(): readonly ts.Signature[] {
                return [{
                    getParameters(): ts.Symbol[] {
                        return [{} as ts.Symbol];
                    },
                } as ts.Signature];
            },
        } as ts.InterfaceType;
        const graph = createBuilder();

        graph.addNodeFromType(type);
        expect(graph.getImports().length).to.eq(1);
        expect(graph.getStatements().length).to.eq(1);

    });

    it("should generate a valid file", function() {
        const path = "tests/cases/ClassWithConstructor.ts";
        const interfacePath = "tests/cases/ExternalInterface.ts";

        const program = createProgram([interfacePath, path], { });

        const builder = new GraphSourceFileBuilder(
            "",
            new AstService(program.getTypeChecker()),
            new ConstructorService(new GraphNodeService([
                new InterfaceNodeTransformer(program.getTypeChecker()),
                new ClassNodeTransformer(program.getTypeChecker()),
            ]), program.getTypeChecker()),
        );
        const sourceFile = program.getSourceFile(path)!;
        const class3 = program.getTypeChecker().getTypeAtLocation(
            sourceFile.statements[1],
        ) as ts.InterfaceType;

        builder.addNodeFromType(class3);

        const output = printCode(builder.getSourceFile());
        expect(output).to.eql(ts.sys.readFile("tests/cases/conformance/dependencyGraph.ts"));

    });
});
