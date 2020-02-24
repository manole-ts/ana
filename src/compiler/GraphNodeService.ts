import * as ts from "typescript";
import {IGraphNodeTransformer} from "./IGraphNodeTransformer";


export interface INodeTypeObject {
    kind: number;
}

export class GraphNodeService {

    /**
     * Graph node transformers.
     *
     * @param transformers
     */
    constructor(private transformers: IGraphNodeTransformer[]) { }

    /**
     * Transform a TypeScript type to a graph node.
     *
     * @param node
     */
    public transform(node: ts.Type): INodeTypeObject {

        for (const transformer of this.transformers) {
           if (transformer.isApplicable(node)) {
               return transformer.transform(node);
           }
        }

        throw new Error("Cannot map the type");
    }

    /**
     * Add a transformer.
     *
     * @param transformer
     */
    public addTransformer(transformer: IGraphNodeTransformer): void {
        this.transformers.push(transformer);
    }

    /**
     * Get the available transformers.
     */
    public getTransformers(): IGraphNodeTransformer[] {
        return this.transformers;
    }
}
