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
exports.Parser = void 0;
var parser_terms_1 = require("../grammar/parser.terms");
var path_finder_1 = require("./path-finder");
var type_1 = require("./type");
var matcher_1 = require("./matcher");
var language_1 = require("@codemirror/language");
var types_1 = require("../types");
var vector_1 = require("./vector");
var Parser = /** @class */ (function () {
    function Parser(state) {
        this.tree = (0, language_1.syntaxTree)(state);
        this.state = state;
        this.diagnostics = [];
    }
    Parser.prototype.getDiagnostics = function () {
        return this.diagnostics.sort(function (a, b) {
            return a.from - b.from;
        });
    };
    Parser.prototype.analyze = function () {
        // when you are at the root of the tree, the first node is not `Expr` but a node with no name.
        // So to be able to iterate other the node relative to the promql node, we have to get the first child at the beginning
        this.checkAST(this.tree.topNode.firstChild);
        this.diagnoseAllErrorNodes();
    };
    Parser.prototype.diagnoseAllErrorNodes = function () {
        var cursor = this.tree.cursor();
        while (cursor.next()) {
            // usually there is an error node at the end of the expression when user is typing
            // so it's not really a useful information to say the expression is wrong.
            // Hopefully if there is an error node at the end of the tree, checkAST should yell more precisely
            if (cursor.type.id === 0 && cursor.to !== this.tree.topNode.to) {
                var node = cursor.node.parent;
                this.diagnostics.push({
                    severity: 'error',
                    message: 'unexpected expression',
                    from: node ? node.from : cursor.from,
                    to: node ? node.to : cursor.to,
                });
            }
        }
    };
    // checkAST is inspired of the same named method from prometheus/prometheus:
    // https://github.com/prometheus/prometheus/blob/3470ee1fbf9d424784eb2613bab5ab0f14b4d222/promql/parser/parse.go#L433
    Parser.prototype.checkAST = function (node) {
        if (!node) {
            return types_1.ValueType.none;
        }
        switch (node.type.id) {
            case parser_terms_1.Expr:
                return this.checkAST(node.firstChild);
            case parser_terms_1.AggregateExpr:
                this.checkAggregationExpr(node);
                break;
            case parser_terms_1.BinaryExpr:
                this.checkBinaryExpr(node);
                break;
            case parser_terms_1.FunctionCall:
                this.checkCallFunction(node);
                break;
            case parser_terms_1.ParenExpr:
                this.checkAST((0, path_finder_1.walkThrough)(node, parser_terms_1.Expr));
                break;
            case parser_terms_1.UnaryExpr:
                var unaryExprType = this.checkAST((0, path_finder_1.walkThrough)(node, parser_terms_1.Expr));
                if (unaryExprType !== types_1.ValueType.scalar && unaryExprType !== types_1.ValueType.vector) {
                    this.addDiagnostic(node, "unary expression only allowed on expressions of type scalar or instant vector, got ".concat(unaryExprType));
                }
                break;
            case parser_terms_1.SubqueryExpr:
                var subQueryExprType = this.checkAST((0, path_finder_1.walkThrough)(node, parser_terms_1.Expr));
                if (subQueryExprType !== types_1.ValueType.vector) {
                    this.addDiagnostic(node, "subquery is only allowed on instant vector, got ".concat(subQueryExprType, " in ").concat(node.name, " instead"));
                }
                break;
            case parser_terms_1.MatrixSelector:
                this.checkAST((0, path_finder_1.walkThrough)(node, parser_terms_1.Expr));
                break;
            case parser_terms_1.VectorSelector:
                this.checkVectorSelector(node);
                break;
            case parser_terms_1.StepInvariantExpr:
                var exprValue = this.checkAST((0, path_finder_1.walkThrough)(node, parser_terms_1.Expr));
                if (exprValue !== types_1.ValueType.vector && exprValue !== types_1.ValueType.matrix) {
                    this.addDiagnostic(node, "@ modifier must be preceded by an instant selector vector or range vector selector or a subquery");
                }
                // if you are looking at the Prometheus code, you will likely find that some checks are missing here.
                // Specially the one checking if the timestamp after the `@` is ok: https://github.com/prometheus/prometheus/blob/ad5ed416ba635834370bfa06139258b31f8c33f9/promql/parser/parse.go#L722-L725
                // Since Javascript is managing the number as a float64 and so on 53 bits, we cannot validate that the maxInt64 number is a valid value.
                // So, to manage properly this issue, we would need to use the BigInt which is possible or by using ES2020.BigInt, or by using the lib: https://github.com/GoogleChromeLabs/jsbi.
                //   * Introducing a lib just for theses checks is quite overkilled
                //   * Using ES2020 would be the way to go. Unfortunately moving to ES2020 is breaking the build of the lib.
                //     So far I didn't find the way to fix it. I think it's likely due to the fact we are building an ESM package which is now something stable in nodeJS/javascript but still experimental in typescript.
                // For the above reason, we decided to drop these checks.
                break;
        }
        return (0, type_1.getType)(node);
    };
    Parser.prototype.checkAggregationExpr = function (node) {
        var _a;
        // according to https://github.com/promlabs/lezer-promql/blob/master/src/promql.grammar#L26
        // the name of the aggregator function is stored in the first child
        var aggregateOp = (_a = node.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild;
        if (!aggregateOp) {
            this.addDiagnostic(node, 'aggregation operator expected in aggregation expression but got nothing');
            return;
        }
        var expr = (0, path_finder_1.walkThrough)(node, parser_terms_1.FunctionCallBody, parser_terms_1.FunctionCallArgs, parser_terms_1.Expr);
        if (!expr) {
            this.addDiagnostic(node, 'unable to find the parameter for the expression');
            return;
        }
        this.expectType(expr, types_1.ValueType.vector, 'aggregation expression');
        // get the parameter of the aggregation operator
        var params = (0, path_finder_1.walkThrough)(node, parser_terms_1.FunctionCallBody, parser_terms_1.FunctionCallArgs, parser_terms_1.FunctionCallArgs, parser_terms_1.Expr);
        if (aggregateOp.type.id === parser_terms_1.Topk || aggregateOp.type.id === parser_terms_1.Bottomk || aggregateOp.type.id === parser_terms_1.Quantile) {
            if (!params) {
                this.addDiagnostic(node, 'no parameter found');
                return;
            }
            this.expectType(params, types_1.ValueType.scalar, 'aggregation parameter');
        }
        if (aggregateOp.type.id === parser_terms_1.CountValues) {
            if (!params) {
                this.addDiagnostic(node, 'no parameter found');
                return;
            }
            this.expectType(params, types_1.ValueType.string, 'aggregation parameter');
        }
    };
    Parser.prototype.checkBinaryExpr = function (node) {
        var e_1, _a, e_2, _b;
        // Following the definition of the BinaryExpr, the left and the right
        // expression are respectively the first and last child
        // https://github.com/promlabs/lezer-promql/blob/master/src/promql.grammar#L52
        var lExpr = node.firstChild;
        var rExpr = node.lastChild;
        if (!lExpr || !rExpr) {
            this.addDiagnostic(node, 'left or right expression is missing in binary expression');
            return;
        }
        var lt = this.checkAST(lExpr);
        var rt = this.checkAST(rExpr);
        var boolModifierUsed = (0, path_finder_1.walkThrough)(node, parser_terms_1.BinModifiers, parser_terms_1.Bool);
        var isComparisonOperator = (0, path_finder_1.containsAtLeastOneChild)(node, parser_terms_1.Eql, parser_terms_1.Neq, parser_terms_1.Lte, parser_terms_1.Lss, parser_terms_1.Gte, parser_terms_1.Gtr);
        var isSetOperator = (0, path_finder_1.containsAtLeastOneChild)(node, parser_terms_1.And, parser_terms_1.Or, parser_terms_1.Unless);
        // BOOL modifier check
        if (boolModifierUsed) {
            if (!isComparisonOperator) {
                this.addDiagnostic(node, 'bool modifier can only be used on comparison operators');
            }
        }
        else {
            if (isComparisonOperator && lt === types_1.ValueType.scalar && rt === types_1.ValueType.scalar) {
                this.addDiagnostic(node, 'comparisons between scalars must use BOOL modifier');
            }
        }
        var vectorMatching = (0, vector_1.buildVectorMatching)(this.state, node);
        if (vectorMatching !== null && vectorMatching.on) {
            try {
                for (var _c = __values(vectorMatching.matchingLabels), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var l1 = _d.value;
                    try {
                        for (var _e = (e_2 = void 0, __values(vectorMatching.include)), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var l2 = _f.value;
                            if (l1 === l2) {
                                this.addDiagnostic(node, "label \"".concat(l1, "\" must not occur in ON and GROUP clause at once"));
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (lt !== types_1.ValueType.scalar && lt !== types_1.ValueType.vector) {
            this.addDiagnostic(lExpr, 'binary expression must contain only scalar and instant vector types');
        }
        if (rt !== types_1.ValueType.scalar && rt !== types_1.ValueType.vector) {
            this.addDiagnostic(rExpr, 'binary expression must contain only scalar and instant vector types');
        }
        if ((lt !== types_1.ValueType.vector || rt !== types_1.ValueType.vector) && vectorMatching !== null) {
            if (vectorMatching.matchingLabels.length > 0) {
                this.addDiagnostic(node, 'vector matching only allowed between instant vectors');
            }
        }
        else {
            if (isSetOperator) {
                if ((vectorMatching === null || vectorMatching === void 0 ? void 0 : vectorMatching.card) === types_1.VectorMatchCardinality.CardOneToMany || (vectorMatching === null || vectorMatching === void 0 ? void 0 : vectorMatching.card) === types_1.VectorMatchCardinality.CardManyToOne) {
                    this.addDiagnostic(node, 'no grouping allowed for set operations');
                }
                if ((vectorMatching === null || vectorMatching === void 0 ? void 0 : vectorMatching.card) !== types_1.VectorMatchCardinality.CardManyToMany) {
                    this.addDiagnostic(node, 'set operations must always be many-to-many');
                }
            }
        }
        if ((lt === types_1.ValueType.scalar || rt === types_1.ValueType.scalar) && isSetOperator) {
            this.addDiagnostic(node, 'set operator not allowed in binary scalar expression');
        }
    };
    Parser.prototype.checkCallFunction = function (node) {
        var _a;
        var funcID = (_a = node.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild;
        if (!funcID) {
            this.addDiagnostic(node, 'function not defined');
            return;
        }
        var args = (0, path_finder_1.retrieveAllRecursiveNodes)((0, path_finder_1.walkThrough)(node, parser_terms_1.FunctionCallBody), parser_terms_1.FunctionCallArgs, parser_terms_1.Expr);
        var funcSignature = (0, types_1.getFunction)(funcID.type.id);
        var nargs = funcSignature.argTypes.length;
        if (funcSignature.variadic === 0) {
            if (args.length !== nargs) {
                this.addDiagnostic(node, "expected ".concat(nargs, " argument(s) in call to \"").concat(funcSignature.name, "\", got ").concat(args.length));
            }
        }
        else {
            var na = nargs - 1;
            if (na > args.length) {
                this.addDiagnostic(node, "expected at least ".concat(na, " argument(s) in call to \"").concat(funcSignature.name, "\", got ").concat(args.length));
            }
            else {
                var nargsmax = na + funcSignature.variadic;
                if (funcSignature.variadic > 0 && nargsmax < args.length) {
                    this.addDiagnostic(node, "expected at most ".concat(nargsmax, " argument(s) in call to \"").concat(funcSignature.name, "\", got ").concat(args.length));
                }
            }
        }
        var j = 0;
        for (var i = 0; i < args.length; i++) {
            j = i;
            if (j >= funcSignature.argTypes.length) {
                if (funcSignature.variadic === 0) {
                    // This is not a vararg function so we should not check the
                    // type of the extra arguments.
                    break;
                }
                j = funcSignature.argTypes.length - 1;
            }
            this.expectType(args[i], funcSignature.argTypes[j], "call to function \"".concat(funcSignature.name, "\""));
        }
    };
    Parser.prototype.checkVectorSelector = function (node) {
        var labelMatchers = (0, matcher_1.buildLabelMatchers)((0, path_finder_1.retrieveAllRecursiveNodes)((0, path_finder_1.walkThrough)(node, parser_terms_1.LabelMatchers, parser_terms_1.LabelMatchList), parser_terms_1.LabelMatchList, parser_terms_1.LabelMatcher), this.state);
        var vectorSelectorName = '';
        // VectorSelector ( MetricIdentifier ( Identifier ) )
        // https://github.com/promlabs/lezer-promql/blob/71e2f9fa5ae6f5c5547d5738966cd2512e6b99a8/src/promql.grammar#L200
        var vectorSelectorNodeName = (0, path_finder_1.walkThrough)(node, parser_terms_1.MetricIdentifier, parser_terms_1.Identifier);
        if (vectorSelectorNodeName) {
            vectorSelectorName = this.state.sliceDoc(vectorSelectorNodeName.from, vectorSelectorNodeName.to);
        }
        if (vectorSelectorName !== '') {
            // In this case the last LabelMatcher is checking for the metric name
            // set outside the braces. This checks if the name has already been set
            // previously
            var labelMatcherMetricName = labelMatchers.find(function (lm) { return lm.name === '__name__'; });
            if (labelMatcherMetricName) {
                this.addDiagnostic(node, "metric name must not be set twice: ".concat(vectorSelectorName, " or ").concat(labelMatcherMetricName.value));
            }
            // adding the metric name as a Matcher to avoid a false positive for this kind of expression:
            // foo{bare=''}
            labelMatchers.push(new types_1.Matcher(parser_terms_1.EqlSingle, '__name__', vectorSelectorName));
        }
        // A Vector selector must contain at least one non-empty matcher to prevent
        // implicit selection of all metrics (e.g. by a typo).
        var empty = labelMatchers.every(function (lm) { return lm.matchesEmpty(); });
        if (empty) {
            this.addDiagnostic(node, 'vector selector must contain at least one non-empty matcher');
        }
    };
    Parser.prototype.expectType = function (node, want, context) {
        var t = this.checkAST(node);
        if (t !== want) {
            this.addDiagnostic(node, "expected type ".concat(want, " in ").concat(context, ", got ").concat(t));
        }
    };
    Parser.prototype.addDiagnostic = function (node, msg) {
        this.diagnostics.push({
            severity: 'error',
            message: msg,
            from: node.from,
            to: node.to,
        });
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map