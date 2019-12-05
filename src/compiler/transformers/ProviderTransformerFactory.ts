import * as ts from "typescript";
import {HeritageFacade} from "../facades/HeritageFacade";
import {ProviderTransformer} from "./ProviderTransformer";

export default class ProviderTransformerFactory {


    constructor(private checker: ts.TypeChecker, private heritageFacade: HeritageFacade) {
        this.createTransformerFactory = this.createTransformerFactory.bind(this);
    }

    public createTransformerFactory(context: ts.TransformationContext) {
        return (new ProviderTransformer(this.checker, this.heritageFacade, context)).visit;
    }
}


