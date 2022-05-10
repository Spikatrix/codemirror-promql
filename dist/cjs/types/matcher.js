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
exports.Matcher = void 0;
var parser_terms_1 = require("../grammar/parser.terms");
var Matcher = /** @class */ (function () {
    function Matcher(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }
    Matcher.prototype.matchesEmpty = function () {
        switch (this.type) {
            case parser_terms_1.EqlSingle:
                return this.value === '';
            case parser_terms_1.Neq:
                return this.value !== '';
            default:
                return false;
        }
    };
    return Matcher;
}());
exports.Matcher = Matcher;
//# sourceMappingURL=matcher.js.map