import {INodeTypeObject} from "./compiler/GraphNodeService";

export default interface IContainer {

    /**
     * Get a service from the container based on it's alias or TypeObject.
     *
     * If the given interface is implemented by multiple concretions, it will throw an error.
     */
    get<T>(): T;

    /**
     * The internal implementation of get() method.
     *
     * @param from
     */
    getInternal(from: INodeTypeObject): any;

    /**
     * Get all concretions that implement an interface from the container based on it's alias or TypeObject.
     *
     * @param name
     */
    getAll<T>(name: string | INodeTypeObject): T[];

    /**
     * The internal implementation of get() method.
     *
     * @param from
     */
    getAllInternal(from: INodeTypeObject): any;

    /**
     * Get service by alias.
     *
     * @param alias
     */
    getAlias<T>(alias: string): T;

    /**
     * Get all implementations of the alias.
     *
     * @param alias
     */
    getAllAlias<T>(alias: string): T[];
}
