import * as ts from "typescript";

import { IProviderFileBuilder } from "./IProviderFileBuilder";
import ProviderAstService, { ITypeImport } from "./ProviderAstService";

export class AppProviderFileBuilder implements IProviderFileBuilder {

    private static createImportStatement(): ts.Statement {
        return ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(undefined, ts.createNamedImports([
                ts.createImportSpecifier(undefined, ts.createIdentifier("IContainer")),
                ts.createImportSpecifier(undefined, ts.createIdentifier("IServiceProvider")),
            ])),
            ts.createStringLiteral("@manole-ts/ana"),
        );
    }

    private imports: { [key: string]: ITypeImport } = {};

    private methodStatements: ts.Statement[] = [];

    private readonly fileName: string;

    private providerAstService: ProviderAstService;

    constructor(fileName: string, providerAstService: ProviderAstService) {
        this.fileName = fileName;
        this.providerAstService = providerAstService;
    }

    public getSourceFile(): ts.SourceFile {
        const file = ts.createSourceFile(this.fileName, "", ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
        const imports = Object.values(this.imports).map(typeImport => typeImport.declaration);

        const statements = ts.createNodeArray(
            [AppProviderFileBuilder.createImportStatement(), ...imports, this.createClassDeclaration()],
        );

        const source = ts.createPrinter().printList(ts.ListFormat.SourceFileStatements, statements, file);

        return ts.createSourceFile(this.fileName, source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
    }

    public addBind(fromType: ts.InterfaceType, toType: ts.InterfaceType) {
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

    private createClassDeclaration() {
        const typeParameter = ts.createParameter(
            undefined,
            undefined,
            undefined,
            "container",
            undefined,
            ts.createTypeReferenceNode(ts.createIdentifier("IContainer"), undefined),
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
            "AppProvider",
            undefined,
            [ts.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
                ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier("IServiceProvider")),
            ])],
            [configureMethod],
        );
    }
}
