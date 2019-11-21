import IDefaultInterface, { ISecondInterface } from "./SecondExternalInterface";

export class MyClass implements ISecondInterface, IDefaultInterface {
    public test() { }

    public testing(): void { }
}
