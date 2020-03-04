import {dirname} from "path";
import * as ts from "typescript";
import {DependencyInjectionBuilder} from "./DependencyInjectionBuilder";
import SourceFileVisitor from "./SourceFIleVisitor";

export function buildContainer(sourceFileVisitor: SourceFileVisitor): void {

    const configPath = ts.findConfigFile(
        /*searchPath*/ process.cwd(),
        ts.sys.fileExists,
        "tsconfig.json",
    );

    if (!configPath) {
        throw new Error("Config file tsconfig.json not found!");
    }

    // Build a program using the set of root file names in fileNames
    const program = createProgramFromTsConfig(configPath);

    // Get the checker, we will use it to find more about classes
    const checker = program.getTypeChecker();

    const builder = new DependencyInjectionBuilder(checker, sourceFileVisitor);

    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
        builder.registerSourceFile(sourceFile);
    }

    builder.build(program);
}

export const createProgramFromTsConfig = (configFile: string): ts.Program => {
    const projectDirectory = dirname(configFile);
    const { config } = ts.readConfigFile(configFile, ts.sys.readFile);

    const parseConfigHost: any = {
        fileExists: ts.sys.fileExists,
        readDirectory: ts.sys.readDirectory,
        readFile: (file: string) => ts.sys.readFile(file, "utf8"),
        useCaseSensitiveFileNames: true,
    };

    const parsed = ts.parseJsonConfigFileContent(config, parseConfigHost, projectDirectory);
    parsed.options.baseUrl = parsed.options.baseUrl || projectDirectory;
    const host = ts.createCompilerHost(parsed.options, true);

    return ts.createProgram(parsed.fileNames, parsed.options, host);
};


