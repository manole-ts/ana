import { expect } from "chai";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as sinonts from "ts-sinon";
import * as ts from "typescript";
import {createProgram} from "typescript";
import {TypeFlags} from "typescript";
import {GraphNodeService} from "../../src/compiler/GraphNodeService";
import {GenericsNodeTransformer} from "../../src/compiler/graphNodeTypes/GenericsNodeTransformer";
import {InterfaceNodeTransformer} from "../../src/compiler/graphNodeTypes/InterfaceNodeTransformer";
chai.use(sinonChai);

describe("GenericsNodeTransformer", function() {
    const createType = () => {
        const type = sinonts.stubInterface<ts.TypeReference>();
        type.objectFlags = 5;
        type.flags = TypeFlags.Object;

        return type;
    };

    it("should check if the type is applicable", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        const transformer = new GenericsNodeTransformer(
            checker,
            new GraphNodeService([new InterfaceNodeTransformer(checker)]),
        );
        expect(transformer.isApplicable(createType())).to.eq(true);
    });

    it("should throw an error if it tries to transform an non-applicable type", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        const transformer = new GenericsNodeTransformer(
            checker,
            new GraphNodeService([new InterfaceNodeTransformer(checker)]),
        );
        const type = sinonts.stubInterface<ts.TypeReference>();

        expect(() => transformer.transform(type)).throws();
    });

    it("should transform a type with type parameters", function() {
        const path = "tests/cases/genericType.ts";
        const program = createProgram([path], { });

        const file = program.getSourceFile(path)!;

        const variable = file.statements[2] as ts.VariableStatement;
        const type = program
            .getTypeChecker()
            .getTypeFromTypeNode(variable.declarationList.declarations[0].type!) as ts.TypeReference;

        const typeParameter = type.typeArguments![0];
        const transformer = new GenericsNodeTransformer(
            program.getTypeChecker(),
            new GraphNodeService([new InterfaceNodeTransformer(program.getTypeChecker())]),
        );
        const fqcn = program.getTypeChecker().getFullyQualifiedName(type.symbol);
        const parameters = [{ kind: 1, fqcn: program.getTypeChecker().getFullyQualifiedName(typeParameter.symbol) }];
        expect(transformer.transform(type)).to.eql({ kind: 4, fqcn, parameters });
    });
});
