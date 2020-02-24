import ExternalInterface from "./ExternalInterface";

export class ClassWithConstructor {
    private test: ExternalInterface;

    constructor(test: ExternalInterface) {
        this.test = test;
    }
}
