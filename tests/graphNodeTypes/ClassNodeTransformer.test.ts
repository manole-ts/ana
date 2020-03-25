import {expect} from "chai";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as sinonts from "ts-sinon";
import * as ts from "typescript";
import {createProgram} from "typescript";
import {HeritageFacade} from "../../src/compiler/facades/HeritageFacade";
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

    it("should generate a concretion node", function() {
        const path = "tests/cases/ClassDeclarationWithExtend.ts";
        const program = createProgram(
            [path],
            {
                baseUrl: ".",
                sourceMap: true,
                strict: true,
                // tslint:disable-next-line:object-literal-sort-keys
                paths: {
                    "@manole-ts/ana": ["src/index"],
                }},
        );

        const node = program.getSourceFile(path)!.statements![1];


        const heritage = new HeritageFacade();

        const parent = heritage.getImplementsByHeritage(
            node as ts.ClassDeclaration,
            program.getTypeChecker(),
            ts.SyntaxKind.ExtendsKeyword,
        )[0];

        const transformer = new ClassNodeTransformer(program.getTypeChecker());

        const output = transformer.transform(parent);

        expect(output).to.eql({fqcn: "\"tests/cases/ClassDeclarationWithExtend\".Parent", kind: 2});

    });
});
