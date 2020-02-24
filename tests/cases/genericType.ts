interface ISomeInterface {
    foo: string;
}

export interface IGenericType<T> {
    test: T;
}

const variable: IGenericType<ISomeInterface> = { test: { foo: "dddd" } };
