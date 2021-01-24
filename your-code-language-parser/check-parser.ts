import { BlockScope } from "../your-code-parser/block-scope";
import { YCParser } from "../your-code-parser/parser";
import { LanguageFunctionValue, LanguageVariableValue } from "./language";
import { PatternFunctionItem, PatternVariableItem } from "./parser";


// FIXME: So dirtyy!
export class CheckParser extends YCParser {
    check() {
        this.checkDefinitions();
        this.checkVariables(this.variables.collectValues());
        this.checkFunctions(this.functions.collectValues());
    }

    checkVariables(variables: LanguageVariableValue[]) {
        variables.forEach(variable => this.parseWithPattern(this.variables, variable));
    }
    
    checkFunctions(fns: LanguageFunctionValue[]) {
        fns.forEach(fn => {
            this.checkVariables(Object.values(fn.variables));
            this.parseWithPattern(this.variables, fn.pattern);
        });
    }

    parsePatternParsers(matcher: PatternVariableItem | PatternFunctionItem) {
        // only checking function and variable existance
        const self = this;
        const checkers = {
            fn() {
                self.functions.get(matcher.name);
            },
            variable() {
                self.variables.get(matcher.name);
            },
        }
        const checker = checkers[matcher.patternType];
        return checker ?? (() => {});
    }
}