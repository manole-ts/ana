import {ConstructorDependencyGraph} from "@manole-ts/ana";
import {expect} from "chai";

describe("ConstructorDependency graph tests", function() {

    const createGraph = () => new ConstructorDependencyGraph();
    const cl = class {};

    it("should add a new node", function() {
        const graph = createGraph();

        graph.add(cl, []);

        expect(graph.get(cl)).to.eql([]);
    });

    it("should throw an error when the node is not found", function() {
        const graph = createGraph();

        expect(() => graph.get(cl)).to.throw();
    });

    it("should return the correct mapped node", function() {
        const graph = createGraph();

        graph.add(cl, [{kind: 1}]);

        expect(graph.get(cl)).to.eql([{kind: 1}]);
    });
});
