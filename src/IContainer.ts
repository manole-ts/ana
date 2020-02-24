import {INodeTypeObject} from "./compiler/GraphNodeService";

export default interface IContainer {
    bind<T>(to: new (...args: any[]) => T): void;

    bindAlias<T = any>(from: string, to: new (...args: any[]) => T): void;

    bindInternal<T = any>(from: INodeTypeObject, to: new (...args: any[]) => T): void;
}
