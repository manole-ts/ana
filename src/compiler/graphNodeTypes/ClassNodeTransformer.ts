import * as ts from "typescript";
import {INodeTypeObject} from "../GraphNodeService";
import {IGraphNodeTransformer} from "../IGraphNodeTransformer";

interface IClassNodeType extends INodeTypeObject {
    kind: 2;
    fqcn: string;
}

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
    public transform(node: ts.ObjectType): IClassNodeType {
        if (!this.isApplicable(node)) {
            throw new Error("Invalid type provided");
        }

        return { kind: 2, fqcn: this.checker.getFullyQualifiedName(node.symbol) };
    }
}
