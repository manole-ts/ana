import { expect } from "chai";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as sinonts from "ts-sinon";
import * as ts from "typescript";
import {createProgram} from "typescript";
import {GraphNodeService} from "../../src/compiler/GraphNodeService";
import {ArrayOfTypesTransformer} from "../../src/compiler/graphNodeTypes/ArrayOfTypesTransformer";
chai.use(sinonChai);

describe("ArrayOfTypesTransformer", function() {
    const path = "tests/cases/arrayOfTypes.ts";
    const program = createProgram([path], { });

    const file = program.getSourceFile(path)!;

    const variable = file.statements[1] as ts.VariableStatement;
    const type = program
        .getTypeChecker()
        .getTypeFromTypeNode(variable.declarationList.declarations[0].type!) as ts.TypeReference;

    it("should check if the type is applicable", function() {
        const service = sinonts.stubConstructor(GraphNodeService);

        const transformer = new ArrayOfTypesTransformer(program.getTypeChecker(), service);
        expect(transformer.isApplicable(type)).to.eq(true);
    });

    it("should throw an error if it tries to transform an non-applicable type", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        const transformer = new ArrayOfTypesTransformer(checker, sinonts.stubConstructor(GraphNodeService));
        const stubType = sinonts.stubInterface<ts.TypeReference>();
        stubType.isClass.returns(false);

        expect(() => transformer.transform(stubType)).throws();
    });

    it("should transform a type to a graph node", function() {
        const service = sinonts.stubConstructor(GraphNodeService);

        const innerType = { kind: 1337 };

        service.transform.returns(innerType);

        const transformer = new ArrayOfTypesTransformer(program.getTypeChecker(), service);

        expect(transformer.transform(type)).to.eql({ kind: 3, element: innerType });
    });
});
