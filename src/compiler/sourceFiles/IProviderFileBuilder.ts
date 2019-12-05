import * as ts from "typescript";

export interface IProviderFileBuilder {
    getSourceFile(): ts.SourceFile;

    addBind(from: ts.InterfaceType, to: ts.InterfaceType): void;
}
