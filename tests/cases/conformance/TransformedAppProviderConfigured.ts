import { IContainerBuilder, IServiceProvider } from "@manole-ts/ana";
import IDefaultInterface from "tests/cases/SecondExternalInterface";
import { MyClass as MyClass } from "tests/cases/SecondClassWithExternalInterface";
import IDefaultInterface_1 from "tests/cases/ExternalInterface";
import { MyClass as MyClass_1 } from "tests/cases/ClassWithExternalInterface";
export default class AutoWireServiceProvider implements IServiceProvider {
    public configure(container: IContainerBuilder) { container.bindInternal<IDefaultInterface>({ kind: 1, fqcn: "\"tests/cases/SecondExternalInterface\".IDefaultInterface" }, MyClass); container.bindInternal<IDefaultInterface_1>({ kind: 1, fqcn: "\"tests/cases/ExternalInterface\".IDefaultInterface" }, MyClass_1); }
}
