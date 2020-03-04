#!/usr/bin/env node

import SourceFileVisitor from "../compiler/SourceFIleVisitor";
import ClassDeclaration from "../compiler/visitors/ClassDeclaration";
import { watchMain } from "../watcher";

import * as ts from "typescript";
import {buildContainer} from "../builder";
const sourceFileVisitor = new SourceFileVisitor({ [ts.SyntaxKind.ClassDeclaration]: new ClassDeclaration() });

if (process.argv.indexOf("--watch") !== -1) {
    watchMain(sourceFileVisitor);
} else {
    buildContainer(sourceFileVisitor);
}
