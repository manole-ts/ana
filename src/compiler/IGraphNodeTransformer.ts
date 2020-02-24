import * as ts from "typescript";
import {INodeTypeObject} from "./GraphNodeService";

export interface IGraphNodeTransformer {
    /**
     * Transform the TS type to a graph node.
     *
     * @param node
     */
    transform(node: ts.Type): INodeTypeObject;

    /**
     * Check if the transformer is applicable to the given type.
     *
     * @param node
     */
    isApplicable(node: ts.Type): boolean;
}
