import {INodeTypeObject} from "../../GraphNodeService";

export class ClassNodeType implements INodeTypeObject {
    public static readonly kind = 2;

    public readonly kind = ClassNodeType.kind;
    public readonly fqcn: string;

    constructor(name: string) {
        this.fqcn = name;
    }


    [key: string]: any;
}
