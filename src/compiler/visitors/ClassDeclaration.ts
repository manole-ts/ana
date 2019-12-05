import * as ts from "typescript";
import { INodeVisitor } from "../NodeVisitor";
import UnsupportedNodeKind from "./errors/UnsupportedNodeKind";

export default class ClassDeclaration implements INodeVisitor {

    public visit(node: ts.Node, checker: ts.TypeChecker): ts.InterfaceType {
        if (!ts.isClassDeclaration(node) || !node.name) {
            throw new UnsupportedNodeKind();
        }

        const symbol = checker.getSymbolAtLocation(node.name);

        if (!symbol) {
            throw new UnsupportedNodeKind();
        }

        return checker.getTypeAtLocation(node) as ts.InterfaceType;
    }
}
