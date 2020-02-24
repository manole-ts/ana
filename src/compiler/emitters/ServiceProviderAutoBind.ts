import * as ts from "typescript";
import {TypeExportable} from "../../../tests/utils/TypeExportable";
import {HeritageFacade} from "../facades/HeritageFacade";
import {IProviderFileBuilder} from "../sourceFiles/IProviderFileBuilder";

export class ServiceProviderAutoBind {

    constructor(
        private heritageFacade: HeritageFacade,
        private checker: ts.TypeChecker,
        private typeExportable: TypeExportable,
    ) {}

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
            if (!this.typeExportable.isExportable(fromType)) {
                continue;
            }

            providerFileBuilder.addBind(fromType, type);
        }

        for (const from of extendHeritage) {
            if (!this.typeExportable.isExportable(from)) {
                continue;
            }

            providerFileBuilder.addBind(from, type);
        }
    }
}
