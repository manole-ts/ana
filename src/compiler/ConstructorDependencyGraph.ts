import {ServiceItem} from "../ServiceItem";

interface IGraphNode {
    kind: number;
    [others: string]: any;
}

export class ConstructorDependencyGraph {

    private contructorMap = new Map<any, IGraphNode[]>();

    /**
     * Add the constructor parameters of a constructor.
     *
     * @param constructor
     * @param parameters
     */
    public add(constructor: ServiceItem<any>, parameters: IGraphNode[]) {
        this.contructorMap.set(constructor, parameters);
    }

    /**
     *
     * @param constructor
     */
    public get(constructor: ServiceItem<any>): IGraphNode[] {
        if (!this.contructorMap.has(constructor)) {
            throw new Error("The constructor is not registered" + constructor.name);
        }

        return this.contructorMap.get(constructor)!;
    }
}
