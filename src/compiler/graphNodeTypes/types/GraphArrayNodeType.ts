import {INodeTypeObject} from "../../GraphNodeService";

export class GraphArrayNodeType implements INodeTypeObject {
    public static readonly kind = 3;

    public readonly kind = GraphArrayNodeType.kind;
    public readonly element: INodeTypeObject | null;

    constructor(element: INodeTypeObject | null) {
        this.element = element;
    }
}
