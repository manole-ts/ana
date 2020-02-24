import { expect } from "chai";
import * as chai from "chai";
import * as sinonChai from "sinon-chai";
import * as sinonts from "ts-sinon";
import * as ts from "typescript";
import {GraphNodeService, INodeTypeObject} from "../src/compiler/GraphNodeService";
import {IGraphNodeTransformer} from "../src/compiler/IGraphNodeTransformer";
chai.use(sinonChai);

describe("GraphNodeService", function() {
    const service = new GraphNodeService([]);

    it("should accept an node", function() {
        const node = sinonts.stubInterface<ts.TypeReference>();
        expect(() => service.transform(node)).to.throw();
    });

    it("should return null if the node is not supported by any transformers", function() {
        const node = sinonts.stubInterface<ts.TypeReference>();
        expect(() => service.transform(node)).to.throw();
    });

    it("should apply only on applicable transformers", function() {
        const node = sinonts.stubInterface<ts.TypeReference>();
        const response = sinonts.stubInterface<INodeTypeObject>();
        const nonApplicableNode = sinonts.stubInterface<ts.TypeReference>();
        const transformer = sinonts.stubInterface<IGraphNodeTransformer>();
        transformer.isApplicable.withArgs(node).returns(true);
        transformer.transform.withArgs(node).returns(response);

        transformer.isApplicable.withArgs(nonApplicableNode).returns(false);

        const graphService = new GraphNodeService([transformer]);
        expect(graphService.transform(node)).to.eq(response);
        expect(() => graphService.transform(nonApplicableNode)).to.throw();
    });

    it("should be able to add a new transformer", function() {
        const transformerService = new GraphNodeService([]);
        transformerService.addTransformer(sinonts.stubInterface<IGraphNodeTransformer>());
        expect(transformerService.getTransformers().length).to.eq(1);
    });
});
