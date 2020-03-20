import {INodeTypeObject} from "../../GraphNodeService";

export class GenericsNodeType implements INodeTypeObject {
    public static readonly kind = 4;

    public readonly kind = GenericsNodeType.kind;
    public readonly fqcn: string;
    public readonly parameters: INodeTypeObject[];

    constructor(name: string, parameters: INodeTypeObject[]) {
        this.fqcn = name;
        this.parameters = parameters;
    }
}
