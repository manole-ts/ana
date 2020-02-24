import {expect} from "chai";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as sinonts from "ts-sinon";
import * as ts from "typescript";
import {ClassNodeTransformer} from "../../src/compiler/graphNodeTypes/ClassNodeTransformer";

chai.use(sinonChai);

describe("ClassNodeTransformer", function() {
    it("should check if the type is applicable", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        const transformer = new ClassNodeTransformer(checker);
        const type = sinonts.stubInterface<ts.TypeReference>();
        type.isClass.returns(true);

        expect(transformer.isApplicable(type)).to.eq(true);
    });

    it("should throw an error if it tries to transform an non-applicable type", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        const transformer = new ClassNodeTransformer(checker);
        const type = sinonts.stubInterface<ts.TypeReference>();
        type.isClass.returns(false);

        expect(() => transformer.transform(type)).throws();
    });

    it("should transform a type to a graph node", function() {
        const checker = sinonts.stubInterface<ts.TypeChecker>();

        checker.getFullyQualifiedName.returns("/a/random/path");

        const transformer = new ClassNodeTransformer(checker);
        const type = sinonts.stubInterface<ts.TypeReference>();
        type.isClass.returns(true);

        expect(transformer.transform(type)).to.eql({kind: 2, fqcn: "/a/random/path"});
    });
});
