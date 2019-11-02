import * as ts from "typescript";

export class HeritageFacade {
    public getImplementsByHeritage(
        node: ts.ClassDeclaration,
        checker: ts.TypeChecker,
        heritageType: ts.SyntaxKind.ImplementsKeyword | ts.SyntaxKind.ExtendsKeyword,
    ): ts.InterfaceType[] {

        if (!node.heritageClauses) {
            return [];
        }

        const heritage = node.heritageClauses.find(element => element.token === heritageType);

        return (heritage ? heritage.types.map((p) => checker.getTypeAtLocation(p)) : []) as ts.InterfaceType[];
    }

    public getHeritageOfType(
        type: ts.InterfaceType,
        checker: ts.TypeChecker,
        heritageType: ts.SyntaxKind.ImplementsKeyword | ts.SyntaxKind.ExtendsKeyword,
    ) {
        if (!type.symbol.declarations[0] || !ts.isClassDeclaration(type.symbol.declarations[0])) {
            return [];
        }

        return this.getImplementsByHeritage(type.symbol.declarations[0] as ts.ClassDeclaration, checker, heritageType);
    }
}
