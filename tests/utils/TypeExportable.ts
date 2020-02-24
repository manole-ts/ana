import * as ts from "typescript";

export class TypeExportable {
    public isExportable(type: ts.ObjectType): boolean {
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
}
