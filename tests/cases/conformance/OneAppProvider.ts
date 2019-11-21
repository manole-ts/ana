import { IContainer, IServiceProvider } from "@manole-ts/ana";
import ExternalInterface from "../ExternalInterface";
import { MyClass } from "../ClassWithExternalInterface";

export default class AppProvider implements IServiceProvider {
    public configure(container: IContainer) {
        container.bind<ExternalInterface>(MyClass);
    }
}
