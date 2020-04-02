import * as ts from "typescript";

import {isTypeReference, isTypeVariable} from "../../../tests/utils/Guards";
import AstService from "./AstService";
import { IProviderFileBuilder } from "./IProviderFileBuilder";
import {ITypeImport} from "./ITypeImport";

interface IImportStatement { statement: ts.Statement; container: ts.Identifier; provider: ts.Identifier; }

export class AppProviderFileBuilder implements IProviderFileBuilder {

    private static createImportStatement(): IImportStatement {
        const iContainer = ts.createOptimisticUniqueName("IContainerBuilder");
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

    public addBind(from: ts.ObjectType, to: ts.ObjectType): void {
        const fromName = this.providerAstService.getFullyQualifiedName(from);
        const toName = this.providerAstService.getFullyQualifiedName(to);

        if (!Object.prototype.hasOwnProperty.call(this.imports, fromName)) {
            this.imports[fromName] = this.providerAstService.createImportDeclaration(from);
        }
        if (!Object.prototype.hasOwnProperty.call(this.imports, toName)) {
            this.imports[toName] = this.providerAstService.createImportDeclaration(to);
        }

        const fromTypeArgs = isTypeReference(from) ? this.getTypeReferenceNode(from) : undefined;

        this.methodStatements.push(
            this.providerAstService.createBindingExpression(
                { identifier: this.imports[fromName].identifier, typeArgs: fromTypeArgs },
                this.imports[toName].identifier,
            ),
        );
    }

    private getTypeReferenceNode(args: ts.TypeReference): ts.TypeNode[] {
        return this.providerAstService.getTypeArguments(args)
            .filter((type: ts.Type) => {
                const parameter = type as ts.Type & { isThisType: boolean };
                return !parameter.isThisType;
            })
            .map((type: ts.Type) => {
                const name = this.providerAstService.getFullyQualifiedName(type);

                if (!type.isClassOrInterface() && isTypeVariable(type)) {
                    return ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
                }

                const params = isTypeReference(type) ? this.getTypeReferenceNode(type) : undefined;

                if (!type.isClassOrInterface()) {
                    return this.providerAstService.typeToTypeNode(type)!;
                }

                if (!Object.prototype.hasOwnProperty.call(this.imports, name)) {
                    this.imports[name] = this.providerAstService.createImportDeclaration(type as ts.InterfaceType);
                }

                return ts.createTypeReferenceNode(this.imports[name].identifier, params);
            });
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
