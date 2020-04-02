import { IContainerBuilder, IServiceProvider } from "@manole-ts/ana";
import { IGenericInterface as IGenericInterface } from "tests/cases/ClassInterfaceGeneric";
import { MyClassGenerics as MyClassGenerics } from "tests/cases/ClassInterfaceGeneric";
export default class AutoWireServiceProvider implements IServiceProvider {
    public configure(container: IContainerBuilder) { container.bind<IGenericInterface<any, string>>(MyClassGenerics); }
}
