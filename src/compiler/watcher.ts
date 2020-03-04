import * as ts from "typescript";
import {DependencyInjectionBuilder} from "./DependencyInjectionBuilder";
import SourceFileVisitor from "./SourceFIleVisitor";

const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
};

export const watchMain = (sourceFileVisitor: SourceFileVisitor) => {
    const configPath = ts.findConfigFile(
        /*searchPath*/ process.cwd(),
        ts.sys.fileExists,
        "tsconfig.json",
    );

    if (!configPath) {
        throw new Error("Could not find a valid 'tsconfig.json'.");
    }

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    const host = ts.createWatchCompilerHost(
        configPath,
        { incremental: true, skipLibCheck: true },
        ts.sys,
        createProgram,
        reportDiagnostic,
        reportWatchStatusChanged,
    );

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
        const builder = new DependencyInjectionBuilder(builderProgram.getProgram().getTypeChecker(), sourceFileVisitor);

        for (const sourceFile of builderProgram.getSourceFiles()) {
            builder.registerSourceFile(sourceFile);
        }

        builder.build(builderProgram.getProgram());

        // tslint:disable-next-line:no-console
        console.log("** The container was built! **");
    };

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
