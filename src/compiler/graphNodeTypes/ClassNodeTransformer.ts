import * as ts from "typescript";
import {IGraphNodeTransformer} from "../IGraphNodeTransformer";
import {ClassNodeType} from "./types/ClassNodeType";

export class ClassNodeTransformer implements IGraphNodeTransformer {

    constructor(private checker: ts.TypeChecker) { }

    /**
     * Check if the given type is an interface.
     *
     * @param node
     */
    public isApplicable(node: ts.ObjectType): boolean {
        return node.isClass();
    }

    /**
     * Transform an interface type to a Graph node.
     *
     * @param node
     */
    public transform(node: ts.ObjectType): ClassNodeType {
        if (!this.isApplicable(node)) {
            throw new Error("Invalid type provided");
        }

        return { kind: 2, fqcn: this.checker.getFullyQualifiedName(node.symbol) };
    }
}
