import { IContainerBuilder, IServiceProvider } from "@manole-ts/ana";
import IDefaultInterface from "tests/cases/SecondExternalInterface";
import { MyClass as MyClass } from "tests/cases/SecondClassWithExternalInterface";
import IDefaultInterface_1 from "tests/cases/ExternalInterface";
import { MyClass as MyClass_1 } from "tests/cases/ClassWithExternalInterface";
export default class AutoWireServiceProvider implements IServiceProvider {
    public configure(container: IContainerBuilder) { container.bind<IDefaultInterface>(MyClass); container.bind<IDefaultInterface_1>(MyClass_1); }
}
