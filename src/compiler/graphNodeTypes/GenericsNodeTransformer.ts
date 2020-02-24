import * as ts from "typescript";

import {isTypeReference} from "../../../tests/utils/Guards";
import {GraphNodeService, INodeTypeObject} from "../GraphNodeService";
import {IGraphNodeTransformer} from "../IGraphNodeTransformer";

interface IGenericsNodeType extends INodeTypeObject {
    kind: 4;
    fqcn: string;
    parameters: INodeTypeObject[];
}
export class GenericsNodeTransformer implements IGraphNodeTransformer {
    constructor(private checker: ts.TypeChecker, private service: GraphNodeService) { }

    public isApplicable(node: ts.Type): node is ts.TypeReference {
        return isTypeReference(node);
    }

    public transform(node: ts.Type): IGenericsNodeType {

        if (!this.isApplicable(node)) {
            throw new Error("Not applicable to this node");
        }

        const parameters = this.checker.getTypeArguments(node).map(arg => this.service.transform(arg)!);

        return { kind: 4, fqcn: this.checker.getFullyQualifiedName(node.symbol), parameters };
    }

}
