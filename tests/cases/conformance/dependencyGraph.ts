import { ConstructorDependencyGraph } from "@manole-ts/ana";
import { ClassWithConstructor as ClassWithConstructor } from "tests/cases/ClassWithConstructor";
export const graph = new ConstructorDependencyGraph();
graph.add(ClassWithConstructor, [{ kind: 1, fqcn: "\"tests/cases/ExternalInterface\".IDefaultInterface" }]);
