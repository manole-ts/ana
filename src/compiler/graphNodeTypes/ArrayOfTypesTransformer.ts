import * as ts from "typescript";
import {GraphNodeService} from "../GraphNodeService";
import { IGraphNodeTransformer } from "../IGraphNodeTransformer";
import {GraphArrayNodeType} from "./types/GraphArrayNodeType";


export class ArrayOfTypesTransformer implements IGraphNodeTransformer {

    constructor(private checker: ts.TypeChecker, private service: GraphNodeService) { }

    /**
     * Check if the given node is applicable.
     *
     * @param node
     */
    public isApplicable(node: ts.Type): node is ts.TypeReference {
        const typeNode = this.checker.typeToTypeNode(node);

        if (!typeNode) {
            return false;
        }

        return ts.isArrayTypeNode(typeNode);
    }

    /**
     * Transform a array node to a graph node.
     *
     * @param node
     */
    public transform(node: ts.Type): GraphArrayNodeType {
        if (!this.isApplicable(node)) {
            throw new Error("Invalid type provided");
        }

        const typeNode = this.checker.typeToTypeNode(node)! as ts.ArrayTypeNode;

        this.checker.getTypeFromTypeNode(typeNode.elementType);

        return { kind: 3, element: this.service.transform(this.checker.getTypeFromTypeNode(typeNode.elementType)) };
    }

}
