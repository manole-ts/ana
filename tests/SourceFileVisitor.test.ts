import { expect } from "chai";
import { createProgram } from "typescript";
import * as ts from "typescript";

import SourceFileVisitor from "../src/compiler/SourceFIleVisitor";
import ClassDeclaration from "../src/compiler/visitors/ClassDeclaration";

describe("Source file visitor", () => {
    const handler = new SourceFileVisitor({
        [ts.SyntaxKind.ClassDeclaration]: new ClassDeclaration(),
    });

    it("should return an array of interface types", () => {
        const path = "tests/cases/ClassDeclarationWithInterface.ts";

        const classWithInterfaceProgram = createProgram([path], { });
        const sourceFile = classWithInterfaceProgram.getSourceFile(path) as ts.SourceFile;

        const types = handler.visit(sourceFile, classWithInterfaceProgram.getTypeChecker());

        expect(types.length).to.eql(1);
    });
});
