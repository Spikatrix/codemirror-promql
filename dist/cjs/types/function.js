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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunction = exports.ValueType = void 0;
var parser_terms_1 = require("../grammar/parser.terms");
var ValueType;
(function (ValueType) {
    ValueType["none"] = "none";
    ValueType["vector"] = "vector";
    ValueType["scalar"] = "scalar";
    ValueType["matrix"] = "matrix";
    ValueType["string"] = "string";
})(ValueType = exports.ValueType || (exports.ValueType = {}));
// promqlFunctions is a list of all functions supported by PromQL, including their types.
// Based on https://github.com/prometheus/prometheus/blob/master/promql/parser/functions.go#L26
var promqlFunctions = (_a = {},
    _a[parser_terms_1.Abs] = {
        name: 'abs',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Absent] = {
        name: 'absent',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.AbsentOverTime] = {
        name: 'absent_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Acos] = {
        name: 'acos',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Acosh] = {
        name: 'acosh',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Asin] = {
        name: 'asin',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Asinh] = {
        name: 'asinh',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Atan] = {
        name: 'atan',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Atanh] = {
        name: 'atanh',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.AvgOverTime] = {
        name: 'avg_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Ceil] = {
        name: 'ceil',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Changes] = {
        name: 'changes',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Clamp] = {
        name: 'clamp',
        argTypes: [ValueType.vector, ValueType.scalar, ValueType.scalar],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.ClampMax] = {
        name: 'clamp_max',
        argTypes: [ValueType.vector, ValueType.scalar],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.ClampMin] = {
        name: 'clamp_min',
        argTypes: [ValueType.vector, ValueType.scalar],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Cos] = {
        name: 'cos',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Cosh] = {
        name: 'Cosh',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.CountOverTime] = {
        name: 'count_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.DaysInMonth] = {
        name: 'days_in_month',
        argTypes: [ValueType.vector],
        variadic: 1,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.DayOfMonth] = {
        name: 'day_of_month',
        argTypes: [ValueType.vector],
        variadic: 1,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.DayOfWeek] = {
        name: 'day_of_week',
        argTypes: [ValueType.vector],
        variadic: 1,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Deg] = {
        name: 'deg',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Delta] = {
        name: 'delta',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Deriv] = {
        name: 'deriv',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Exp] = {
        name: 'exp',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Floor] = {
        name: 'floor',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.HistogramQuantile] = {
        name: 'histogram_quantile',
        argTypes: [ValueType.scalar, ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.HoltWinters] = {
        name: 'holt_winters',
        argTypes: [ValueType.matrix, ValueType.scalar, ValueType.scalar],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Hour] = {
        name: 'hour',
        argTypes: [ValueType.vector],
        variadic: 1,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Idelta] = {
        name: 'idelta',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Increase] = {
        name: 'increase',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Irate] = {
        name: 'irate',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.LabelReplace] = {
        name: 'label_replace',
        argTypes: [ValueType.vector, ValueType.string, ValueType.string, ValueType.string, ValueType.string],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.LabelJoin] = {
        name: 'label_join',
        argTypes: [ValueType.vector, ValueType.string, ValueType.string, ValueType.string],
        variadic: -1,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.LastOverTime] = {
        name: 'last_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Ln] = {
        name: 'ln',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Log10] = {
        name: 'log10',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Log2] = {
        name: 'log2',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.MaxOverTime] = {
        name: 'max_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.MinOverTime] = {
        name: 'min_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Minute] = {
        name: 'minute',
        argTypes: [ValueType.vector],
        variadic: 1,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Month] = {
        name: 'month',
        argTypes: [ValueType.vector],
        variadic: 1,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Pi] = {
        name: 'pi',
        argTypes: [],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.PredictLinear] = {
        name: 'predict_linear',
        argTypes: [ValueType.matrix, ValueType.scalar],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.PresentOverTime] = {
        name: 'present_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.QuantileOverTime] = {
        name: 'quantile_over_time',
        argTypes: [ValueType.scalar, ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Rad] = {
        name: 'rad',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Rate] = {
        name: 'rate',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Resets] = {
        name: 'resets',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Round] = {
        name: 'round',
        argTypes: [ValueType.vector, ValueType.scalar],
        variadic: 1,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Scalar] = {
        name: 'scalar',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.scalar,
    },
    _a[parser_terms_1.Sgn] = {
        name: 'sgn',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Sin] = {
        name: 'sin',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Sinh] = {
        name: 'Sinh',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Sort] = {
        name: 'sort',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.SortDesc] = {
        name: 'sort_desc',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Sqrt] = {
        name: 'sqrt',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.StddevOverTime] = {
        name: 'stddev_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.StdvarOverTime] = {
        name: 'stdvar_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.SumOverTime] = {
        name: 'sum_over_time',
        argTypes: [ValueType.matrix],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Tan] = {
        name: 'tan',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Tanh] = {
        name: 'tanh',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Time] = {
        name: 'time',
        argTypes: [],
        variadic: 0,
        returnType: ValueType.scalar,
    },
    _a[parser_terms_1.Timestamp] = {
        name: 'timestamp',
        argTypes: [ValueType.vector],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Vector] = {
        name: 'vector',
        argTypes: [ValueType.scalar],
        variadic: 0,
        returnType: ValueType.vector,
    },
    _a[parser_terms_1.Year] = {
        name: 'year',
        argTypes: [ValueType.vector],
        variadic: 1,
        returnType: ValueType.vector,
    },
    _a);
function getFunction(id) {
    return promqlFunctions[id];
}
exports.getFunction = getFunction;
//# sourceMappingURL=function.js.map