import * as ts from "typescript";

export interface INodeVisitor {
    visit(node: ts.Node, checker: ts.TypeChecker): ts.Type;
}
