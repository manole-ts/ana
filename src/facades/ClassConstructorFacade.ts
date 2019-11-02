import ts = require("typescript");

export class ClassConstructorFacade {
    public getConstructorParameters(classType: ts.Type, checker: ts.TypeChecker): readonly ts.Type[] {

        const constructorArgs = classType.getConstructSignatures();

        if (!constructorArgs[0] || constructorArgs[0].parameters === undefined) {
            return [];
        }

        return constructorArgs[0].parameters.map(
            csymbol => checker.getTypeOfSymbolAtLocation(csymbol, csymbol.valueDeclaration),
        );
    }
}
