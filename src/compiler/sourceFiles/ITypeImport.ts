import {Identifier, ImportDeclaration} from "typescript";

export interface ITypeImport {
    identifier: Identifier;
    declaration: ImportDeclaration;
}