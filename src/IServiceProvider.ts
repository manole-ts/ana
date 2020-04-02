import {IContainerBuilder} from "./IContainerBuilder";

export default interface IServiceProvider {
    configure(configure: IContainerBuilder): void;
}
