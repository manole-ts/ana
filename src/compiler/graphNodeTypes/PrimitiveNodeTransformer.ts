import * as ts from "typescript";
import {isTypeReference} from "../../../tests/utils/Guards";
import {INodeTypeObject} from "../GraphNodeService";
import {IGraphNodeTransformer} from "../IGraphNodeTransformer";

interface IPrimitiveNodeType extends INodeTypeObject {
    kind: 5;
    name: string;
}

export class PrimitiveNodeTransformer implements IGraphNodeTransformer {

    constructor(private checker: ts.TypeChecker) { }

    public isApplicable(node: ts.Type): boolean {
        return !node.isClassOrInterface() && !isTypeReference(node);
    }

    public transform(node: ts.Type): IPrimitiveNodeType {
        return { kind: 5, name: this.checker.typeToString(node, undefined, undefined) };
    }
}
