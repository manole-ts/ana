export default interface IContainer {
    bind<T>(to: new (...args: any[]) => T): void;

    bindAlias<T = any>(from: string, to: new (...args: any[]) => T): void;
}
