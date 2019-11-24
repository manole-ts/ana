import * as ts from "typescript";
import {HeritageFacade} from "../facades/HeritageFacade";
import {IProviderFileBuilder} from "../sourceFiles/IProviderFileBuilder";

export class ServiceProviderAutoBind {

    private static isExportable(type: ts.InterfaceType): boolean {
        if (!type.symbol.declarations[0].modifiers) {
            return false;
        }

        for (const modifier of type.symbol.declarations[0].modifiers) {
            if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
                return true;
            }
        }

        return false;
    }

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
            if (!ServiceProviderAutoBind.isExportable(fromType)) {
                continue;
            }

            providerFileBuilder.addBind(fromType, type);
        }

        for (const from of extendHeritage) {
            if (!ServiceProviderAutoBind.isExportable(from)) {
                continue;
            }

            providerFileBuilder.addBind(from, type);
        }
    }
}
