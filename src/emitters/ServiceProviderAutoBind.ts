import * as ts from "typescript";
import {HeritageFacade} from "../facades/HeritageFacade";
import {IProviderFileBuilder} from "../sourceFiles/IProviderFileBuilder";

export class ServiceProviderAutoBind {

    constructor(private heritageFacade: HeritageFacade, private checker: ts.TypeChecker) {}

    public bindType(type: ts.InterfaceType, providerFileBuilder: IProviderFileBuilder) {
        const extendHeritage = this.heritageFacade.getImplementsByHeritage(
            type.symbol.valueDeclaration as ts.ClassDeclaration,
            this.checker,
            ts.SyntaxKind.ExtendsKeyword,
        );

        const implementsHeritage = this.heritageFacade.getImplementsByHeritage(
            type.symbol.valueDeclaration as ts.ClassDeclaration,
            this.checker,
            ts.SyntaxKind.ImplementsKeyword,
        );

        for (const fromType of implementsHeritage) {
            providerFileBuilder.addBind(fromType, type);
        }

        for (const from of extendHeritage) {
            providerFileBuilder.addBind(from, type);
        }
    }
}
