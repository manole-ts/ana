import { expect } from "chai";
import { createProgram } from "typescript";

import * as ts from "typescript";
import ProviderAstService from "../../src/sourceFiles/ProviderAstService";
import { printArrayNode, printCode } from "../utils/printer";

describe("ProviderAstService tests", () => {
    const path = "tests/cases/ClassWithExternalInterface.ts";
    const secondPathClass = "tests/cases/SecondClassWithExternalInterface.ts";

    const interfacePath = "tests/cases/ExternalInterface.ts";
    const secondInterfacePath = "tests/cases/SecondExternalInterface.ts";
    const program = createProgram([path, interfacePath, secondInterfacePath, secondPathClass], { });
    const service = new ProviderAstService(program.getTypeChecker());

    const getImportsOutput = (indexStatement: number, indexStatement2: number) => {
        program.getSourceFile(interfacePath)!.fileName = interfacePath;

        const node = program.getSourceFile(interfacePath)!.statements[indexStatement];
        const type = program.getTypeChecker().getTypeAtLocation(node) as ts.InterfaceType;

        const importStatement = service.createImportDeclaration(type).declaration;

        program.getSourceFile(secondInterfacePath)!.fileName = secondInterfacePath;

        const node2 = program.getSourceFile(secondInterfacePath)!.statements[indexStatement2];
        const type2 = program.getTypeChecker().getTypeAtLocation(node2) as ts.InterfaceType;

        const importStatement2 = service.createImportDeclaration(type2).declaration;

        return (ts.createNodeArray([importStatement, importStatement2]));
    };

    it("should create a default import", () => {

        program.getSourceFile(interfacePath)!.fileName = interfacePath;

        const node = program.getSourceFile(interfacePath)!.statements[0];
        const type = program.getTypeChecker().getTypeAtLocation(node) as ts.InterfaceType;

        const importStatement = service.createImportDeclaration(type).declaration;
        const output = `import IDefaultInterface from "${interfacePath.slice(0, -3)}";`;

        expect(printCode(importStatement)).to.eql(output);
    });

    it("should create multiple defaults with the same name", () => {
        expect(printArrayNode(getImportsOutput(0, 0))).to.eql("import IDefaultInterface from \"tests/cases/ExternalInterface\";\n" +
            "import IDefaultInterface_1 from \"tests/cases/SecondExternalInterface\";");
    });

    it("should create a import", () => {
        program.getSourceFile(interfacePath)!.fileName = interfacePath;

        const node = program.getSourceFile(interfacePath)!.statements[1];
        const type = program.getTypeChecker().getTypeAtLocation(node) as ts.InterfaceType;

        const importStatement = service.createImportDeclaration(type).declaration;
        const output = `import { ISecondInterface as ISecondInterface } from "${interfacePath.slice(0, -3)}";`;

        expect(printCode(importStatement)).to.eql(output);
    });

    it("should create a import of interfaces with the same name", () => {
        expect(printArrayNode(getImportsOutput(1, 1))).to.eql(`import { ISecondInterface as ISecondInterface } from "tests/cases/ExternalInterface";
import { ISecondInterface as ISecondInterface_1 } from "tests/cases/SecondExternalInterface";`);
    });

    it("should create a binding", () => {
        program.getSourceFile(interfacePath)!.fileName = interfacePath;

        const ast = service.createBindingExpression(ts.createIdentifier("from"), ts.createIdentifier("to"));

        const output = printCode(ast);
        expect(output).to.eql("container.bind<from>(to);");
    });

});
