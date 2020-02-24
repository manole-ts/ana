import * as ts from "typescript";
import {HeritageFacade} from "../facades/HeritageFacade";
import {GraphNodeServiceFactory} from "../GraphNodeServiceFactory";
import {ProviderTransformer} from "./ProviderTransformer";

export default class ProviderTransformerFactory {


    constructor(private checker: ts.TypeChecker, private heritageFacade: HeritageFacade) {
        this.createTransformerFactory = this.createTransformerFactory.bind(this);
    }

    public createTransformerFactory(context: ts.TransformationContext) {
        const service = (new GraphNodeServiceFactory()).createService(this.checker);

        return (new ProviderTransformer(this.checker, this.heritageFacade, context, service)).visit;
    }
}


