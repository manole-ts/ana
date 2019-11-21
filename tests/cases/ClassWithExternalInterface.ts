import IDefaultInterface, { ISecondInterface } from "./ExternalInterface";

export class MyClass implements ISecondInterface, IDefaultInterface {
    public test() { }

    public testing(): void { }
}
