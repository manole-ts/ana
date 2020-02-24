import * as ts from "typescript";
import {ClassDeclaration, TransformationContext} from "typescript";
import { HeritageFacade } from "../facades/HeritageFacade";
import {GraphNodeService} from "../GraphNodeService";

export class ProviderTransformer {
    constructor(
        private checker: ts.TypeChecker,
        private heritageFacade: HeritageFacade,
        private context: TransformationContext,
        private service: GraphNodeService,
    ) {
        this.visit = this.visit.bind(this);
    }

    public visit(source: ts.SourceFile): ts.SourceFile {
        return ts.visitEachChild(source, (node: ts.Node) => this.statementVisitor(node), this.context);
    }

    private statementVisitor(node: ts.Node): ts.Node {
        if (this.isServiceProvider(node)) {
            return this.visitServiceProvider(node);
        }

        return node;
    }

    private visitServiceProvider(provider: ts.Node): ts.Node {
        return ts.visitEachChild(
            this.changeContainerBind(provider),
            (node: ts.Node) => this.visitServiceProvider(node),
            this.context,
        );
    }

    private changeContainerBind(node: ts.Node): ts.Node {
        if (!ts.isCallExpression(node)) {
            return node;
        }

        const propertyAccess = node.expression;

        if (!ts.isPropertyAccessExpression(propertyAccess)) {
            return node;
        }

        const interfaceDeclaration = this.checker.getTypeAtLocation(propertyAccess.expression)!.symbol.declarations[0];

        if (!ts.isInterfaceDeclaration(interfaceDeclaration)) {
            return node;
        }

        if (interfaceDeclaration.name.escapedText !== "IContainer") {
            return node;
        }

        if (propertyAccess.name.escapedText !== "bind") {
            return node;
        }

        const newNode = ts.getMutableClone(node);
        newNode.expression = ts.updatePropertyAccess(propertyAccess, propertyAccess.expression, ts.createIdentifier("bindInternal"));

        const typeArg = this.checker.getTypeFromTypeNode(node.typeArguments![0]);

        return ts.updateCall(
            newNode,
            newNode.expression,
            node.typeArguments,
            [this.createObject(this.service.transform(typeArg)), ...node.arguments],
        );
    }

    private createObject(property: any) {
        if (typeof property === "object" && property !== null) {
            const entries: ts.PropertyAssignment[] = Object
                .entries(property)
                .map((entry) => ts.createPropertyAssignment(entry[0], this.createObject(entry[1])));
            return ts.createObjectLiteral(entries);
        }

        return ts.createLiteral(property);
    }

    private isServiceProvider(node: ts.Node): node is ts.ClassDeclaration {
        if (!ts.isClassDeclaration(node)) {
            return false;
        }

        const types = this.heritageFacade.getImplementsByHeritage(node, this.checker, ts.SyntaxKind.ImplementsKeyword);

        for (const type of types) {
            const declaration = type.symbol.declarations[0] as ClassDeclaration;
            if (!ts.isInterfaceDeclaration(declaration)) {
                continue;
            }

            /**
             * @TODO: Naive check, I'll need a better way to identify the interface.
             */
            if (declaration.name!.escapedText === "IServiceProvider") {
                return true;
            }
        }

        return false;
    }
}
