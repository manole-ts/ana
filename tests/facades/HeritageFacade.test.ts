import { createClassDeclaration, createProgram, SyntaxKind } from "typescript";
import * as ts from "typescript";

import { expect } from "chai";
import { stubInterface } from "ts-sinon";
import { HeritageFacade } from "../../src/facades/HeritageFacade";

describe("Heritage facade tests", () => {
    const heritageFacade = new HeritageFacade();
    const path = "tests/cases/ClassDeclarationWithInterface.ts";

    const classWithInterfaceProgram = createProgram([path], { });
    const sourceFile = classWithInterfaceProgram.getSourceFile(path) as ts.SourceFile;
    const classDeclaration = sourceFile.statements[1] as ts.ClassDeclaration;
    it("should return an array of interfaces that a class implements", () => {

        const type = heritageFacade.getImplementsByHeritage(
            classDeclaration,
            classWithInterfaceProgram.getTypeChecker(),
            SyntaxKind.ImplementsKeyword,
        );

        expect(type.length).to.equal(1);
        expect(type[0].symbol.getName()).to.eql("FooInterface");
    });

    it("should return an array of interfaces based on type", () => {

        const symbol = classWithInterfaceProgram.getTypeChecker().getSymbolAtLocation(classDeclaration.name!)!;

        const type = classWithInterfaceProgram.getTypeChecker().getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration,
        );

        const heritageOfType = heritageFacade.getHeritageOfType(
            type as ts.InterfaceType,
            classWithInterfaceProgram.getTypeChecker(),
            SyntaxKind.ImplementsKeyword,
        );

        expect(heritageOfType.length).to.equal(1);
        expect(heritageOfType[0].symbol.getName()).to.eql("FooInterface");
    });

    it("should return an empty list of implements when heritage is empty", () => {
        const classDecl = createClassDeclaration(undefined, undefined, undefined, undefined, undefined, []);
        expect(heritageFacade.getImplementsByHeritage(
            classDecl,
            stubInterface<ts.TypeChecker>(),
            ts.SyntaxKind.ImplementsKeyword,
        ).length).to.eql(0);
    });
});
