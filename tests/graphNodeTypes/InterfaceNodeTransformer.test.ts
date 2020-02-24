import { expect } from "chai";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as sinonts from "ts-sinon";
import * as ts from "typescript";
import {InterfaceNodeTransformer} from "../../src/compiler/graphNodeTypes/InterfaceNodeTransformer";
chai.use(sinonChai);

describe("InterfaceNodeTransformer", function() {
    it("should check if the type is applicable", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        const transformer = new InterfaceNodeTransformer(checker);
        const type = sinonts.stubInterface<ts.TypeReference>();
        type.isClassOrInterface.returns(true);
        type.isClass.returns(false);

        expect(transformer.isApplicable(type)).to.eq(true);
    });

    it("should throw an error if it tries to transform an non-applicable type", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        const transformer = new InterfaceNodeTransformer(checker);
        const type = sinonts.stubInterface<ts.TypeReference>();
        type.isClassOrInterface.returns(true);
        type.isClass.returns(true);

        expect(() => transformer.transform(type)).throws();
    });

    it("should transform a type to a graph node", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        checker.getFullyQualifiedName.returns("/a/random/path");

        const transformer = new InterfaceNodeTransformer(checker);
        const type = sinonts.stubInterface<ts.TypeReference>();
        type.isClassOrInterface.returns(true);
        type.isClass.returns(false);

        expect(transformer.transform(type)).to.eql({ kind: 1, fqcn: "/a/random/path" });
    });
});
