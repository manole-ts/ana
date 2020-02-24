import ExternalInterface from "./ExternalInterface";

export interface IGenericInterface<T, K> {
    obj?: T;
    ttt: string;
}

export class MyClassGenerics<T, k> implements IGenericInterface<T, string> {
    public ttt: string = "ddd";
}
