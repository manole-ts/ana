import {InterfaceType, Signature, TypeChecker} from "typescript";
import * as ts from "typescript";
import {GraphNodeService} from "./GraphNodeService";

export class ConstructorService {

    constructor(private graphNodeService: GraphNodeService, private checker: TypeChecker) { }

    public transformSignature(signature: Signature) {
        const getType = (symbol: ts.Symbol) => this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);

        return signature.parameters.map(
            (parameter) => this.graphNodeService.transform(getType(parameter)),
        );
    }

    public getConstructorParameters(type: InterfaceType)  {
        const constructorType = this.checker.getTypeOfSymbolAtLocation(type.symbol, type.symbol.valueDeclaration);

        const signatures = constructorType.getConstructSignatures();

        if (signatures.length === 0 || signatures[0].getParameters().length === 0) {
            return [];
        }

        return this.transformSignature(signatures[0]);

    }
}
