import {TypeChecker} from "typescript";
import {GraphNodeService} from "./GraphNodeService";
import {ArrayOfTypesTransformer} from "./graphNodeTypes/ArrayOfTypesTransformer";
import {ClassNodeTransformer} from "./graphNodeTypes/ClassNodeTransformer";
import {GenericsNodeTransformer} from "./graphNodeTypes/GenericsNodeTransformer";
import {InterfaceNodeTransformer} from "./graphNodeTypes/InterfaceNodeTransformer";
import {PrimitiveNodeTransformer} from "./graphNodeTypes/PrimitiveNodeTransformer";

export class GraphNodeServiceFactory {

    public createService(checker: TypeChecker): GraphNodeService {
        const service = new GraphNodeService([
            new InterfaceNodeTransformer(checker),
            new ClassNodeTransformer(checker),
            new PrimitiveNodeTransformer(checker),
        ]);

        const genericsNodeTransformer = new GenericsNodeTransformer(checker, service);
        const arrayOfTypesTransformer = new ArrayOfTypesTransformer(checker, service);

        service.addTransformer(genericsNodeTransformer);
        service.addTransformer(arrayOfTypesTransformer);

        return service;
    }
}
