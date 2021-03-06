import { expect } from "chai";
import {createProgram} from "typescript";
import * as ts from "typescript";
import {HeritageFacade} from "../../src/compiler/facades/HeritageFacade";
import ProviderTransformerFactory from "../../src/compiler/transformers/ProviderTransformerFactory";

describe("ProviderTransformer", function() {
    const compare = (input: string, expected: string) => {
        const serviceProviderPath = `tests/cases/conformance/${input}`;
        const iContainer = "src/IContainer.ts";
        const iServiceProvider = "src/IServiceProvider.ts";
        const program = createProgram(
            [ serviceProviderPath, iContainer, iServiceProvider],
            {
                baseUrl: ".",
                sourceMap: true,
                strict: true,
                // tslint:disable-next-line:object-literal-sort-keys
                paths: {
                    "@manole-ts/ana": ["src/index"],
                }},
        );

        const factory = new ProviderTransformerFactory(program.getTypeChecker(), new HeritageFacade());

        const source = program.getSourceFile(serviceProviderPath)!;

        const transformationResult = ts.transform(source, [factory.createTransformerFactory], {});
        const code = ts.createPrinter().printFile(transformationResult.transformed[0]);
        expect(code).to.eql(ts.sys.readFile(`tests/cases/conformance/${expected}`));
    };

    it("should replace bind with bindInternal", function() {
        compare("AppProviderConfigured.ts", "TransformedAppProviderConfigured.ts");
    });

    it("should throw an error when the types are not supported for autowiring", function() {
        expect(() => compare("AppProviderGenericConfigured.ts", "TransformedAppProviderGenericConfigured")).to.throw();
    });
});
