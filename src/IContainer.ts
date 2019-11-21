export default interface IContainer {
    bind<T>(to: new () => T): void;

    bindAlias<T = any>(from: string, to: new () => T): void;
}
