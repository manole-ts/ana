import { expect } from "chai";

import { createProgram } from "typescript";
import * as ts from "typescript";
import ClassDeclaration from "../../src/visitors/ClassDeclaration";
import UnsupportedNodeKind from "../../src/visitors/errors/UnsupportedNodeKind";

describe("Class declaration handler", function() {
    const program = createProgram([], {});
    const handler = new ClassDeclaration();

    it("should accept a class declaration node", () => {
        const path = "tests/cases/ClassDeclarationWithInterface.ts";

        const classWithInterfaceProgram = createProgram([path], { });
        const sourceFile = classWithInterfaceProgram.getSourceFile(path) as ts.SourceFile;
        const classDeclaration = sourceFile.statements[1] as ts.ClassDeclaration;

        expect(
            () => handler.visit(classDeclaration, program.getTypeChecker()),
        ).to.not.throw(UnsupportedNodeKind);
    });

    it("should throw an error when the node is not class decoration", () => {
        const node = ts.createNode(ts.SyntaxKind.AnyKeyword);
        expect(() => handler.visit(node, program.getTypeChecker())).to.throw(UnsupportedNodeKind);
    });

    it("should return a class declaration type", () => {
        const path = "tests/cases/ClassDeclarationWithInterface.ts";

        const classWithInterfaceProgram = createProgram([path], { });
        const sourceFile = classWithInterfaceProgram.getSourceFile(path) as ts.SourceFile;
        const classDeclaration = sourceFile.statements[1] as ts.ClassDeclaration;


        const type = handler.visit(classDeclaration, classWithInterfaceProgram.getTypeChecker());

        expect(type.symbol.getName()).eql("ClassDeclarationWithInterface");
    });
});
