import { IContainerBuilder, IServiceProvider } from "@manole-ts/ana";
import ExternalInterface from "../ExternalInterface";
import { MyClass } from "../ClassWithExternalInterface";

export default class AutoWireServiceProvider implements IServiceProvider {
    public configure(container: IContainerBuilder) {
        container.bind<ExternalInterface>(MyClass);
    }
}
