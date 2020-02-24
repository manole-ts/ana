import * as ts from "typescript";
import {ITypeImport} from "./ITypeImport";

interface IBindNode { identifier: ts.Identifier; typeArgs?: readonly ts.TypeNode[]; }

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

    public createBindingExpression(fromTypeAlias: IBindNode, toTypeAlias: ts.Identifier): ts.ExpressionStatement {
        return ts.createExpressionStatement(
            ts.createCall(
                ts.createPropertyAccess(ts.createIdentifier("container"), "bind"),
                [ts.createTypeReferenceNode(fromTypeAlias.identifier, fromTypeAlias.typeArgs)],
                [toTypeAlias],
            ),
        );
    }

    public createImportDeclaration(type: ts.ObjectType): ITypeImport {
        const isDefault = AstService.isDefaultExport(type.symbol.declarations[0]!);
        const identifier = ts.createOptimisticUniqueName(this.checker.symbolToString(type.symbol));

        const propertyName = isDefault ? identifier : undefined;
        const named = !isDefault ? ts.createNamedImports([
            ts.createImportSpecifier(
                ts.createIdentifier(this.checker.symbolToString(type.symbol)),
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

    public getFullyQualifiedName(type: ts.Type): string {
        if (!type.symbol) {
            return this.checker.typeToString(type);
        }

        return this.checker.getFullyQualifiedName(type.symbol);
    }

    public getTypeArguments(type: ts.TypeReference): readonly ts.Type[] {
        const types = this.checker.getTypeArguments(type);

        return types !== undefined ? types : [];
    }

    public createAstObjectFromObject(property: any) {
        if (typeof property === "object" && property !== null) {
            const entries: ts.PropertyAssignment[] = Object
                .entries(property)
                .map((entry) => ts.createPropertyAssignment(entry[0], this.createAstObjectFromObject(entry[1])));
            return ts.createObjectLiteral(entries);
        }

        return ts.createLiteral(property);
    }

    public typeToTypeNode(type: ts.Type): ts.TypeNode | undefined {
        return this.checker.typeToTypeNode(type);
    }
}
