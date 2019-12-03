import { IContainer, IServiceProvider } from "@manole-ts/ana";
import IDefaultInterface from "tests/cases/SecondExternalInterface";
import { MyClass as MyClass } from "tests/cases/SecondClassWithExternalInterface";
import IDefaultInterface_1 from "tests/cases/ExternalInterface";
import { MyClass as MyClass_1 } from "tests/cases/ClassWithExternalInterface";
export default class AutoWireServiceProvider implements IServiceProvider {
    public configure(container: IContainer) { container.bindAlias<IDefaultInterface>("\"tests/cases/SecondExternalInterface\".IDefaultInterface", MyClass); container.bindAlias<IDefaultInterface_1>("\"tests/cases/ExternalInterface\".IDefaultInterface", MyClass_1); }
}
