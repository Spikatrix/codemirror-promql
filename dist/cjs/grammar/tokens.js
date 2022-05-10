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
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendIdentifier = exports.specializeIdentifier = void 0;
var parser_terms_js_1 = require("./parser.terms.js");
var keywordTokens = {
    inf: parser_terms_js_1.inf,
    nan: parser_terms_js_1.nan,
    bool: parser_terms_js_1.Bool,
    ignoring: parser_terms_js_1.Ignoring,
    on: parser_terms_js_1.On,
    group_left: parser_terms_js_1.GroupLeft,
    group_right: parser_terms_js_1.GroupRight,
    offset: parser_terms_js_1.Offset,
};
var specializeIdentifier = function (value, stack) {
    return keywordTokens[value.toLowerCase()] || -1;
};
exports.specializeIdentifier = specializeIdentifier;
var contextualKeywordTokens = {
    avg: parser_terms_js_1.Avg,
    atan2: parser_terms_js_1.Atan2,
    bottomk: parser_terms_js_1.Bottomk,
    count: parser_terms_js_1.Count,
    count_values: parser_terms_js_1.CountValues,
    group: parser_terms_js_1.Group,
    max: parser_terms_js_1.Max,
    min: parser_terms_js_1.Min,
    quantile: parser_terms_js_1.Quantile,
    stddev: parser_terms_js_1.Stddev,
    stdvar: parser_terms_js_1.Stdvar,
    sum: parser_terms_js_1.Sum,
    topk: parser_terms_js_1.Topk,
    by: parser_terms_js_1.By,
    without: parser_terms_js_1.Without,
    and: parser_terms_js_1.And,
    or: parser_terms_js_1.Or,
    unless: parser_terms_js_1.Unless,
    start: parser_terms_js_1.Start,
    end: parser_terms_js_1.End,
};
var extendIdentifier = function (value, stack) {
    return contextualKeywordTokens[value.toLowerCase()] || -1;
};
exports.extendIdentifier = extendIdentifier;
//# sourceMappingURL=tokens.js.map