// tslint:disable-next-line:interface-name
interface FooInterface {
    test: string;
}

export class ClassDeclarationWithInterface implements FooInterface {
    public test: string;

    constructor(test: FooInterface, testin: string) {
        this.test = testin;
    }
}
