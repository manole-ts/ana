import { createProgram } from "typescript";
import * as ts from "typescript";
import { ClassConstructorFacade } from "../../src/facades/ClassConstructorFacade";

import {expect} from "chai";

describe("Class constructor facade", () => {
    const classConstructorFacade =  new ClassConstructorFacade();

    it("should return an array of parameters", () => {

        const path = "tests/cases/ClassDeclarationWithInterface.ts";

        const classWithInterfaceProgram = createProgram([path], { });
        const sourceFile = classWithInterfaceProgram.getSourceFile(path) as ts.SourceFile;
        const classDeclaration = sourceFile.statements[1] as ts.ClassDeclaration;
        // @ts-ignore
        const symbol = classWithInterfaceProgram.getTypeChecker().getSymbolAtLocation(classDeclaration.name)!;

        const type = classWithInterfaceProgram.getTypeChecker().getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration,
        );

        const constructorArgs = classConstructorFacade.getConstructorParameters(
            type,
            classWithInterfaceProgram.getTypeChecker(),
        );

        expect(constructorArgs.length).to.eql(2);

    });
});
