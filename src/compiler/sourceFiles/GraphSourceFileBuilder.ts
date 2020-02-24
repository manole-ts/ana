import * as ts from "typescript";
import {ExpressionStatement} from "typescript";
import {ConstructorService} from "../ConstructorService";
import {INodeTypeObject} from "../GraphNodeService";
import AstService from "./AstService";
import {ITypeImport} from "./ITypeImport";

export interface IGraphStatement {
    constructor: any;
    parameters: INodeTypeObject[];
}

/**
 * Responsible with building the class constructor dependency graph.
 */
export class GraphSourceFileBuilder {

    private static createImportGraphModule(): ITypeImport {
        const graph = ts.createOptimisticUniqueName("ConstructorDependencyGraph");
        const statement = ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(undefined, ts.createNamedImports([
                ts.createImportSpecifier(undefined, graph),
            ])),
            ts.createStringLiteral("@manole-ts/ana"),
        );

        return {identifier: graph, declaration: statement};
    }

    private statements: IGraphStatement[] = [];

    private imports: { [key: string]: ITypeImport } = {};

    constructor(
        private fileName: string,
        private astService: AstService,
        private constructorService: ConstructorService,
    ) {
    }

    /**
     * Add a note from type.
     *
     * @param type
     */
    public addNodeFromType(type: ts.InterfaceType): void {
        const importType = this.astService.createImportDeclaration(type);

        this.imports[this.astService.getFullyQualifiedName(type)] = importType;

        const parameters = this.constructorService.getConstructorParameters(type);

        this.statements.push({ constructor: importType.identifier, parameters });
    }

    public getStatements(): IGraphStatement[] {
        return this.statements;
    }

    /**
     * Get the source file imports.
     */
    public getImports(): ITypeImport[] {
        return Object.values(this.imports);
    }

    /**
     *  Convert the builder into a typescript source file.
     */
    public getSourceFile(): ts.SourceFile {
        const graphModule = GraphSourceFileBuilder.createImportGraphModule();

        const newExpr = ts.createNew(graphModule.identifier, undefined, []);
        const exportModifier = ts.createModifiersFromModifierFlags(ts.ModifierFlags.Export);
        const declaration = [ts.createVariableDeclaration("graph", undefined, newExpr)];
        const assign = ts.createVariableStatement(exportModifier, declaration);
        assign.declarationList.flags = ts.NodeFlags.Const;


        const print = ts.createPrinter().printList(ts.ListFormat.None, ts.createNodeArray([
            graphModule.declaration,
                ...this.getImports().map(importDeclaration => importDeclaration.declaration),
            assign,
            ...this.astStatements,
        ]), ts.createSourceFile(this.fileName, "", ts.ScriptTarget.ESNext));

        return ts.createSourceFile(this.fileName, print, ts.ScriptTarget.ESNext);
    }

    private get astStatements(): ExpressionStatement[] {
        return this.statements.map((statement: IGraphStatement) => {

            const parameters = ts.createArrayLiteral(
                statement.parameters.map((node: INodeTypeObject) => this.astService.createAstObjectFromObject(node)),
            );

            return ts.createExpressionStatement(
                ts.createCall(
                    ts.createPropertyAccess(ts.createIdentifier("graph"), "add"),
                    [],
                    [statement.constructor, parameters],
                ),
            );
        });
    }
}
