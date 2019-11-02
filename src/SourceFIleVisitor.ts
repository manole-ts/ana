import * as ts from "typescript";
import {INodeVisitor} from "./NodeVisitor";

export default class SourceFileVisitor {

    constructor(private handlers: { [key: string]: INodeVisitor }) {}

    public visit(sourceFile: ts.SourceFile, checker: ts.TypeChecker) {
        const types: ts.Type[]  = [];

        sourceFile.forEachChild(node => {
            const type = this.visitChild(node, checker);

            if (type) {
                types.push(type);
            }
        });

        return types;
    }

    private visitChild(node: ts.Node, checker: ts.TypeChecker): ts.Type | undefined {
        if (this.handlers[node.kind]) {
            return this.handlers[node.kind].visit(node, checker);
        }
    }
}
