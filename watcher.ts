import * as ts from "typescript";
import {ServiceProviderAutoBind} from "./src/emitters/ServiceProviderAutoBind";
import {HeritageFacade} from "./src/facades/HeritageFacade";
import {AppProviderFileBuilder} from "./src/sourceFiles/AppProviderFileBuilder";
import ProviderAstService from "./src/sourceFiles/ProviderAstService";
import SourceFileVisitor from "./src/SourceFIleVisitor";

const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
};

export const watchMain = (sourceFileVisitor: SourceFileVisitor) => {
    const configPath = ts.findConfigFile(
        /*searchPath*/ "./",
        ts.sys.fileExists,
        "tsconfig.json",
    );

    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    const createProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram;

    // Note that there is another overload for `createWatchCompilerHost` that takes
    // a set of root files.
    const host = ts.createWatchCompilerHost(
        configPath,
        {
        },
        ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged,
    );


    // You can technically override any given hook on the host, though you probably
    // don't need to.
    // Note that we're assuming `origCreateProgram` and `origPostProgramCreate`
    // doesn't use `this` at all.
    const origCreateProgram = host.createProgram;
    host.createProgram = (
        rootNames: ReadonlyArray<string> | undefined,
        options,
        parameterHost,
        oldProgram,
    ) => {
        // tslint:disable-next-line:no-console
        console.log("** Starting to compile the DI container... **");
        return origCreateProgram(rootNames, options, parameterHost, oldProgram);
    };

    host.afterProgramCreate = builderProgram => {
        const serviceProviderBind = new ServiceProviderAutoBind(
            new HeritageFacade(),
            builderProgram.getProgram().getTypeChecker(),
        );

        const serviceProviderBuilder = new AppProviderFileBuilder(
            "./containers/generated-container.ts",
            new ProviderAstService(builderProgram.getProgram().getTypeChecker()),
        );

        for (const sourceFile of builderProgram.getSourceFiles()) {
            const types = sourceFileVisitor
                .visit(sourceFile, builderProgram.getProgram().getTypeChecker()) as ts.InterfaceType[];

            for (const type of types) {
                serviceProviderBind.bindType(type, serviceProviderBuilder);
            }
        }

        const file = serviceProviderBuilder.getSourceFile();
        const textFile = ts.createPrinter().printFile(file);
        ts.sys.writeFile(file.fileName, textFile);

        // tslint:disable-next-line:no-console
        console.log("** The container was built! **");
    };

    // `createWatchProgram` creates an initial program, watches files, and updates
    // the program over time.
    ts.createWatchProgram(host);
};

function reportDiagnostic(diagnostic: ts.Diagnostic) {
    console.error(
        "Error",
        diagnostic.code,
        ":",
        ts.flattenDiagnosticMessageText(
            diagnostic.messageText,
            formatHost.getNewLine(),
        ),
    );
}


/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
    // tslint:disable-next-line:no-console
    console.info(ts.formatDiagnostic(diagnostic, formatHost));
}
