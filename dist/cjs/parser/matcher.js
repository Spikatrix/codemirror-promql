"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelMatchersToString = exports.buildLabelMatchers = void 0;
var parser_terms_1 = require("../grammar/parser.terms");
var types_1 = require("../types");
function createMatcher(labelMatcher, state) {
    var matcher = new types_1.Matcher(0, '', '');
    var cursor = labelMatcher.cursor();
    if (!cursor.next()) {
        // weird case, that would mean the labelMatcher doesn't have any child.
        return matcher;
    }
    do {
        switch (cursor.type.id) {
            case parser_terms_1.LabelName:
                matcher.name = state.sliceDoc(cursor.from, cursor.to);
                break;
            case parser_terms_1.MatchOp:
                var ope = cursor.node.firstChild;
                if (ope) {
                    matcher.type = ope.type.id;
                }
                break;
            case parser_terms_1.StringLiteral:
                matcher.value = state.sliceDoc(cursor.from, cursor.to).slice(1, -1);
                break;
        }
    } while (cursor.nextSibling());
    return matcher;
}
function buildLabelMatchers(labelMatchers, state) {
    var matchers = [];
    labelMatchers.forEach(function (value) {
        matchers.push(createMatcher(value, state));
    });
    return matchers;
}
exports.buildLabelMatchers = buildLabelMatchers;
function labelMatchersToString(metricName, matchers, labelName) {
    var e_1, _a;
    if (!matchers || matchers.length === 0) {
        return metricName;
    }
    var matchersAsString = '';
    try {
        for (var matchers_1 = __values(matchers), matchers_1_1 = matchers_1.next(); !matchers_1_1.done; matchers_1_1 = matchers_1.next()) {
            var matcher = matchers_1_1.value;
            if (matcher.name === labelName || matcher.value === '') {
                continue;
            }
            var type = '';
            switch (matcher.type) {
                case parser_terms_1.EqlSingle:
                    type = '=';
                    break;
                case parser_terms_1.Neq:
                    type = '!=';
                    break;
                case parser_terms_1.NeqRegex:
                    type = '!~';
                    break;
                case parser_terms_1.EqlRegex:
                    type = '=~';
                    break;
                default:
                    type = '=';
            }
            var m = "".concat(matcher.name).concat(type, "\"").concat(matcher.value, "\"");
            if (matchersAsString === '') {
                matchersAsString = m;
            }
            else {
                matchersAsString = "".concat(matchersAsString, ",").concat(m);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (matchers_1_1 && !matchers_1_1.done && (_a = matchers_1.return)) _a.call(matchers_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return "".concat(metricName, "{").concat(matchersAsString, "}");
}
exports.labelMatchersToString = labelMatchersToString;
//# sourceMappingURL=matcher.js.map