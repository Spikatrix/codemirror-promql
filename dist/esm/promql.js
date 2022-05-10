// Copyright 2021 The Prometheus Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { parser } from './grammar/parser';
import { styleTags, tags } from '@codemirror/highlight';
import { newCompleteStrategy } from './complete';
import { newLintStrategy, promQLLinter } from './lint';
import { LRLanguage } from '@codemirror/language';
export var LanguageType;
(function (LanguageType) {
    LanguageType["PromQL"] = "PromQL";
    LanguageType["MetricName"] = "MetricName";
})(LanguageType || (LanguageType = {}));
export function promQLLanguage(top) {
    return LRLanguage.define({
        parser: parser.configure({
            top: top,
            props: [
                styleTags({
                    LineComment: tags.comment,
                    LabelName: tags.labelName,
                    StringLiteral: tags.string,
                    NumberLiteral: tags.number,
                    Duration: tags.number,
                    'Abs Absent AbsentOverTime Acos Acosh Asin Asinh Atan Atanh AvgOverTime Ceil Changes Clamp ClampMax ClampMin Cos Cosh CountOverTime DaysInMonth DayOfMonth DayOfWeek Deg Delta Deriv Exp Floor HistogramQuantile HoltWinters Hour Idelta Increase Irate LabelReplace LabelJoin LastOverTime Ln Log10 Log2 MaxOverTime MinOverTime Minute Month Pi PredictLinear PresentOverTime QuantileOverTime Rad Rate Resets Round Scalar Sgn Sin Sinh Sort SortDesc Sqrt StddevOverTime StdvarOverTime SumOverTime Tan Tanh Time Timestamp Vector Year': tags.function(tags.variableName),
                    'Avg Bottomk Count Count_values Group Max Min Quantile Stddev Stdvar Sum Topk': tags.operatorKeyword,
                    'By Without Bool On Ignoring GroupLeft GroupRight Offset Start End': tags.modifier,
                    'And Unless Or': tags.logicOperator,
                    'Sub Add Mul Mod Div Atan2 Eql Neq Lte Lss Gte Gtr EqlRegex EqlSingle NeqRegex Pow At': tags.operator,
                    UnaryOp: tags.arithmeticOperator,
                    '( )': tags.paren,
                    '[ ]': tags.squareBracket,
                    '{ }': tags.brace,
                    '⚠': tags.invalid,
                }),
            ],
        }),
        languageData: {
            closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
            commentTokens: { line: '#' },
        },
    });
}
/**
 * This class holds the state of the completion extension for CodeMirror and allow hot-swapping the complete strategy.
 */
export class PromQLExtension {
    constructor() {
        this.complete = newCompleteStrategy();
        this.lint = newLintStrategy();
        this.enableLinter = true;
        this.enableCompletion = true;
    }
    setComplete(conf) {
        this.complete = newCompleteStrategy(conf);
        return this;
    }
    getComplete() {
        return this.complete;
    }
    activateCompletion(activate) {
        this.enableCompletion = activate;
        return this;
    }
    setLinter(linter) {
        this.lint = linter;
        return this;
    }
    getLinter() {
        return this.lint;
    }
    activateLinter(activate) {
        this.enableLinter = activate;
        return this;
    }
    asExtension(languageType = LanguageType.PromQL) {
        const language = promQLLanguage(languageType);
        let extension = [language];
        if (this.enableCompletion) {
            const completion = language.data.of({
                autocomplete: (context) => {
                    return this.complete.promQL(context);
                },
            });
            extension = extension.concat(completion);
        }
        if (this.enableLinter) {
            extension = extension.concat(promQLLinter(this.lint.promQL, this.lint));
        }
        return extension;
    }
}
//# sourceMappingURL=promql.js.map