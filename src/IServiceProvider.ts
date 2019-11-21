import IContainer from "./IContainer";

export default interface IServiceProvider {
    configure(configure: IContainer): void;
}
