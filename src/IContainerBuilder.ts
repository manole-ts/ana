import {INodeTypeObject} from "./compiler/GraphNodeService";
import IContainer from "./IContainer";

export interface IContainerBuilder extends IContainer {
    /**
     * Bind an interface to a concretion (class).
     *
     * @param to
     */
    bind<T>(to: new (...args: any[]) => T): void;

    /**
     * Bind a concretion to a named alias.
     *
     * The alias could be then used in the service provider to be injected in other services.
     *
     * @param from
     * @param to
     */
    bindAlias<T = any>(from: string, to: new (...args: any[]) => T): void;

    /**
     * The internal implementation of the bind() method. It should NOT be used in applications.
     *
     * @internal
     *
     * @param from
     * @param to
     */
    bindInternal<T>(from: INodeTypeObject, to: new (...args: any[]) => T): void;

    /**
     * Unbind a given type from the container.
     */
    unbind<T>(): void;

    /**
     * Unbind a given type from the container.
     *
     * @internal
     *
     */
    unbindInternal<K extends INodeTypeObject>(from: K): void;

    getContainer(): IContainer;
}
