import * as ts from "typescript";

export const printCode = (node: ts.Node): string => {
    const source = ts.createSourceFile(
        "",
        "",
        ts.ScriptTarget.ESNext,
        false,
        ts.ScriptKind.TS,
    );

    return ts.createPrinter().printNode(ts.EmitHint.Unspecified, node, source);
};

export const printArrayNode = (node: ts.NodeArray<ts.Node>): string => {
    const source = ts.createSourceFile(
        "",
        "",
        ts.ScriptTarget.ESNext,
        false,
        ts.ScriptKind.TS,
    );

    return ts.createPrinter().printList(ts.ListFormat.SourceFileStatements, node, source);
};
