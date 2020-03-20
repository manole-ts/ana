import {INodeTypeObject} from "../../GraphNodeService";

export class InterfaceNodeType implements INodeTypeObject {
    public static readonly kind = 1;
    public readonly kind = InterfaceNodeType.kind;
    public readonly fqcn: string;

    constructor(name: string) {
        this.fqcn = name;
    }
}
