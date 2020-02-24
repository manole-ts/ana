import { IContainer, IServiceProvider } from "@manole-ts/ana";
import { IGenericInterface as IGenericInterface } from "tests/cases/ClassInterfaceGeneric";
import { MyClassGenerics as MyClassGenerics } from "tests/cases/ClassInterfaceGeneric";
export default class AutoWireServiceProvider implements IServiceProvider {
    public configure(container: IContainer) { container.bind<IGenericInterface<any, string>>(MyClassGenerics); }
}
