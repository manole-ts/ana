import * as ts from "typescript";
import {INodeTypeObject} from "../GraphNodeService";
import {IGraphNodeTransformer} from "../IGraphNodeTransformer";

interface IInterfaceNodeType extends INodeTypeObject {
    kind: 1;
    fqcn: string;
}

export class InterfaceNodeTransformer implements IGraphNodeTransformer {

    constructor(private checker: ts.TypeChecker) { }

    /**
     * Check if the given type is an interface.
     *
     * @param node
     */
    public isApplicable(node: ts.Type): node is ts.InterfaceType {
        return node.isClassOrInterface() && !node.isClass();
    }

    /**
     * Transform an interface type to a Graph node.
     *
     * @param node
     */
    public transform(node: ts.Type): IInterfaceNodeType {
        if (!this.isApplicable(node)) {
            throw new Error("Invalid type provided");
        }

        return { kind: 1, fqcn: this.checker.getFullyQualifiedName(node.symbol) };
    }
}
