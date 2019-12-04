import * as ts from "typescript";
import {Identifier, ImportDeclaration} from "typescript";

export interface ITypeImport {
    identifier: Identifier;
    declaration: ImportDeclaration;
}

export default class AstService {

    private static isDefaultExport(declaration: ts.Declaration): boolean {
        if (!declaration.modifiers) {
            return false;
        }

        for (const modifier of declaration.modifiers) {
            if (modifier.kind === ts.SyntaxKind.DefaultKeyword) {
                return true;
            }
        }

        return false;
    }

    private checker: ts.TypeChecker;

    public constructor(checker: ts.TypeChecker) {
        this.checker = checker;
    }

    public createBindingExpression(fromTypeAlias: ts.Identifier, toTypeAlias: ts.Identifier): ts.ExpressionStatement {

        return ts.createExpressionStatement(
            ts.createCall(
                ts.createPropertyAccess(ts.createIdentifier("container"), "bind"),
                [ts.createTypeReferenceNode(fromTypeAlias, undefined)],
                [toTypeAlias],
            ),
        );
    }

    public createImportDeclaration(type: ts.InterfaceType): ITypeImport {
        const isDefault = AstService.isDefaultExport(type.symbol.declarations[0]!);
        const identifier = ts.createOptimisticUniqueName(this.checker.typeToString(type));

        const propertyName = isDefault ? identifier : undefined;
        const named = !isDefault ? ts.createNamedImports([
            ts.createImportSpecifier(
                ts.createIdentifier(this.checker.typeToString(type)),
                identifier,
            ),
        ]) : undefined;

        const source = type.symbol.declarations[0]!.getSourceFile();

        const declaration =  ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(propertyName, named),
            ts.createStringLiteral(source.fileName.slice(0, -3)),
        );

        return { identifier, declaration };
    }

    public getFullyQualifiedName(type: ts.InterfaceType): string {
        return this.checker.getFullyQualifiedName(type.symbol);
    }
}
