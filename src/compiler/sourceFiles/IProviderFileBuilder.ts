import * as ts from "typescript";

export interface IProviderFileBuilder {
    getSourceFile(): ts.SourceFile;

    addBind(from: ts.ObjectType, to: ts.ObjectType): void;
}
