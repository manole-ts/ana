import * as ts from "typescript";

import AstService, { ITypeImport } from "./AstService";
import { IProviderFileBuilder } from "./IProviderFileBuilder";

interface IImportStatement { statement: ts.Statement; container: ts.Identifier; provider: ts.Identifier; }

export class AppProviderFileBuilder implements IProviderFileBuilder {

    private static createImportStatement(): IImportStatement {
        const iContainer = ts.createOptimisticUniqueName("IContainer");
        const iServiceProvider = ts.createOptimisticUniqueName("IServiceProvider");
        const statement = ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(undefined, ts.createNamedImports([
                ts.createImportSpecifier(undefined, iContainer),
                ts.createImportSpecifier(undefined, iServiceProvider),
            ])),
            ts.createStringLiteral("@manole-ts/ana"),
        );

        return { statement, container: iContainer, provider: iServiceProvider };
    }

    private imports: { [key: string]: ITypeImport } = {};

    private methodStatements: ts.Statement[] = [];

    private readonly fileName: string;

    private providerAstService: AstService;

    constructor(fileName: string, providerAstService: AstService) {
        this.fileName = fileName;
        this.providerAstService = providerAstService;
    }

    public getSourceFile(): ts.SourceFile {
        const file = ts.createSourceFile(this.fileName, "", ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
        const imports = Object.values(this.imports).map(typeImport => typeImport.declaration);

        const importResult = AppProviderFileBuilder.createImportStatement();
        const classDeclaration = this.createClassDeclaration(importResult.container, importResult.provider);
        const statements = ts.createNodeArray(
            [importResult.statement, ...imports, classDeclaration],
        );

        const source = ts.createPrinter().printList(ts.ListFormat.SourceFileStatements, statements, file);

        return ts.createSourceFile(this.fileName, source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
    }

    public addBind(fromType: ts.InterfaceType, toType: ts.InterfaceType): void {
        const fromName = this.providerAstService.getFullyQualifiedName(fromType);
        const toName = this.providerAstService.getFullyQualifiedName(toType);

        if (!Object.prototype.hasOwnProperty.call(this.imports, fromName)) {
            this.imports[fromName] = this.providerAstService.createImportDeclaration(fromType);
        }
        if (!Object.prototype.hasOwnProperty.call(this.imports, toName)) {
            this.imports[toName] = this.providerAstService.createImportDeclaration(toType);
        }


        this.methodStatements.push(
            this.providerAstService.createBindingExpression(
                this.imports[fromName].identifier,
                this.imports[toName].identifier,
            ),
        );
    }

    private createClassDeclaration(container: ts.Identifier, provider: ts.Identifier) {
        const typeParameter = ts.createParameter(
            undefined,
            undefined,
            undefined,
            "container",
            undefined,
            ts.createTypeReferenceNode(container, undefined),
            undefined,
        );
        const configureMethod = ts.createMethod(
            undefined,
            [ts.createToken(ts.SyntaxKind.PublicKeyword)],
            undefined,
            "configure",
            undefined,
            [],
            [typeParameter],
            undefined,
            ts.createBlock(this.methodStatements),
        );

        return ts.createClassDeclaration(
            undefined,
            [ts.createToken(ts.SyntaxKind.ExportKeyword), ts.createToken(ts.SyntaxKind.DefaultKeyword)],
            ts.createOptimisticUniqueName("AutoWireServiceProvider"),
            undefined,
            [ts.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
                ts.createExpressionWithTypeArguments(undefined, provider),
            ])],
            [configureMethod],
        );
    }
}
