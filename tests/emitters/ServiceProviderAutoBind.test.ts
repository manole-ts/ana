import { expect } from "chai";
import * as sinonts from "ts-sinon";
import sinon from "ts-sinon";

import * as ts from "typescript";
import {createProgram} from "typescript";
import { ServiceProviderAutoBind } from "../../src/compiler/emitters/ServiceProviderAutoBind";
import {HeritageFacade} from "../../src/compiler/facades/HeritageFacade";
import {IProviderFileBuilder} from "../../src/compiler/sourceFiles/IProviderFileBuilder";
import {TypeExportable} from "../utils/TypeExportable";

describe("Container register bind emitter", () => {
    const checker = createProgram([], {}, undefined, undefined, []).getTypeChecker();

    it("should it bind only to itself when it doesnt have any interfaces/extends", () => {
        const type = sinonts.stubInterface<ts.InterfaceType>();
        const heritageFacade = sinon.createStubInstance(HeritageFacade);
        const stubChecker = sinonts.stubObject(checker);
        heritageFacade.getImplementsByHeritage
            .withArgs(type.symbol.valueDeclaration as ts.ClassDeclaration, stubChecker, ts.SyntaxKind.ImplementsKeyword)
            .returns([]);

        heritageFacade.getImplementsByHeritage
            .withArgs(type.symbol.valueDeclaration as ts.ClassDeclaration, stubChecker, ts.SyntaxKind.ExtendsKeyword)
            .returns([]);

        const containerBind = new ServiceProviderAutoBind(
            heritageFacade,
            stubChecker,
            new TypeExportable(),
        );

        const providerBuilder = sinonts.stubInterface<IProviderFileBuilder>();
        containerBind.bindType(type, providerBuilder);
        expect(providerBuilder.addBind.calledOnceWith(type, type)).to.eql(true);
    });

    it("should bind inheritence types to implementations", () => {
        const type = sinonts.stubInterface<ts.InterfaceType>();
        const parentType = sinonts.stubInterface<ts.InterfaceType>();
        const extendParentType = sinonts.stubInterface<ts.InterfaceType>();

        const heritageFacade = sinon.createStubInstance(HeritageFacade);
        const stubChecker = sinonts.stubObject(checker);
        heritageFacade.getImplementsByHeritage
            .withArgs(type.symbol.valueDeclaration as ts.ClassDeclaration, stubChecker, ts.SyntaxKind.ImplementsKeyword)
            .returns([extendParentType]);

        heritageFacade.getImplementsByHeritage
            .withArgs(type.symbol.valueDeclaration as ts.ClassDeclaration, stubChecker, ts.SyntaxKind.ExtendsKeyword)
            .returns([parentType]);

        const typeExportable = sinonts.stubConstructor(TypeExportable);
        typeExportable.isExportable.returns(true);

        const containerBind = new ServiceProviderAutoBind(
            heritageFacade,
            stubChecker,
            typeExportable,
        );

        const providerBuilder = sinonts.stubInterface<IProviderFileBuilder>();
        containerBind.bindType(type, providerBuilder);

        expect(providerBuilder.addBind.calledWith(parentType, type)).to.eq(true);
        expect(providerBuilder.addBind.calledWith(extendParentType, type)).to.eq(true);
    });
});
