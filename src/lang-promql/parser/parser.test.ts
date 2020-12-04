// The MIT License (MIT)
//
// Copyright (c) 2020 The Prometheus Authors
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import chai from 'chai';
import { Parser } from './parser';
import { ValueType } from './type';
import { Diagnostic } from '@codemirror/next/lint';
import { createEditorState } from '../../test/utils';
import { syntaxTree } from '@codemirror/next/language';

describe('promql operations', () => {
  const testCases = [
    {
      expr: '1',
      expectedValueType: ValueType.scalar,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: '2 * 3',
      expectedValueType: ValueType.scalar,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: '1 unless 1',
      expectedValueType: ValueType.scalar,
      expectedDiag: [
        {
          from: 0,
          to: 10,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'metric_name * "string"',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 14,
          to: 22,
          message: 'binary expression must contain only scalar and instant vector types',
          severity: 'error',
        },
      ] as Diagnostic[],
    },
    {
      expr: 'metric_name_1 > bool metric_name_2',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'metric_name_1 + bool metric_name_2',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 34,
          message: 'bool modifier can only be used on comparison operators',
          severity: 'error',
        },
      ] as Diagnostic[],
    },
    {
      expr: 'metric_name offset 1d',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'metric_name[5m] offset 1d',
      expectedValueType: ValueType.matrix,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'rate(metric_name[5m])[1h:] offset 1m',
      expectedValueType: ValueType.matrix,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'sum(metric_name offset 1m)',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'rate(metric_name[5m] offset 1d)',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'max_over_time(rate(metric_name[5m])[1h:] offset 1m)',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo * bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo*bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo* bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo *bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo==bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo * sum',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo == 1',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo == bool 1',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: '2.5 / bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo and bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo or bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo unless bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      // Test and/or precedence and reassigning of operands.
      // Here it will test only the first VectorMatching so (a + b) or (c and d) ==> ManyToMany
      expr: 'foo + bar or bla and blub',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      // Test and/or/unless precedence.
      // Here it will test only the first VectorMatching so ((a and b) unless c) or d ==> ManyToMany
      expr: 'foo and bar unless baz or qux',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo * on(test,blub) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo*on(test,blub)bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo * on(test,blub) group_left bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo*on(test,blub)group_left()bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo and on(test,blub) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo and on() bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo and ignoring(test,blub) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo and ignoring() bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo unless on(bar) baz',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo / on(test,blub) group_left(bar) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo / ignoring(test,blub) group_left(blub) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo / ignoring(test,blub) group_left(bar) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo - on(test,blub) group_right(bar,foo) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo - ignoring(test,blub) group_right(bar,foo) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [] as Diagnostic[],
    },
    {
      expr: 'foo and 1',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 9,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    {
      expr: '1 and foo',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 9,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo or 1',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 8,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    {
      expr: '1 or foo',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 8,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo unless 1',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 12,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    {
      expr: '1 unless foo',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 12,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    {
      expr: '1 or on(bar) foo',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 16,
          message: 'vector matching only allowed between instant vectors',
          severity: 'error',
        },
        {
          from: 0,
          to: 16,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo == on(bar) 10',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 17,
          message: 'vector matching only allowed between instant vectors',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo and on(bar) group_left(baz) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 35,
          message: 'no grouping allowed for set operations',
          severity: 'error',
        },
        {
          from: 0,
          to: 35,
          message: 'set operations must always be many-to-many',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo and on(bar) group_right(baz) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 36,
          message: 'no grouping allowed for set operations',
          severity: 'error',
        },
        {
          from: 0,
          to: 36,
          message: 'set operations must always be many-to-many',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo or on(bar) group_left(baz) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 34,
          message: 'no grouping allowed for set operations',
          severity: 'error',
        },
        {
          from: 0,
          to: 34,
          message: 'set operations must always be many-to-many',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo or on(bar) group_right(baz) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 35,
          message: 'no grouping allowed for set operations',
          severity: 'error',
        },
        {
          from: 0,
          to: 35,
          message: 'set operations must always be many-to-many',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo unless on(bar) group_left(baz) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 38,
          message: 'no grouping allowed for set operations',
          severity: 'error',
        },
        {
          from: 0,
          to: 38,
          message: 'set operations must always be many-to-many',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo unless on(bar) group_right(baz) bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 39,
          message: 'no grouping allowed for set operations',
          severity: 'error',
        },
        {
          from: 0,
          to: 39,
          message: 'set operations must always be many-to-many',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'http_requests{group="production"} + on(instance) group_left(job,instance) cpu_count{type="smp"}',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 95,
          message: 'label "instance" must not occur in ON and GROUP clause at once',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo + bool bar',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 14,
          message: 'bool modifier can only be used on comparison operators',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo + bool 10',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 13,
          message: 'bool modifier can only be used on comparison operators',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'foo and bool 10',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 15,
          message: 'bool modifier can only be used on comparison operators',
          severity: 'error',
        },
        {
          from: 0,
          to: 15,
          message: 'set operator not allowed in binary scalar expression',
          severity: 'error',
        },
      ],
    },
    // test aggregration
    {
      expr: 'sum by (foo)(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'avg by (foo)(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'max by (foo)(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'sum without (foo) (some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'sum (some_metric) without (foo)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'stddev(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'stdvar by (foo)(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'sum by ()(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'sum by (foo,bar,)(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'sum by (foo,)(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'topk(5, some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'topk( # my awesome comment\n' + '5, some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'count_values("value", some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'sum without(and, by, avg, count, alert, annotations)(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'sum some_metric by (test)',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 25,
          message: 'unable to find the parameter for the expression',
          severity: 'error',
        },
      ],
    },
    // Test function calls.
    {
      expr: 'time()',
      expectedValueType: ValueType.scalar,
      expectedDiag: [],
    },
    {
      expr: 'floor(some_metric{foo!="bar"})',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'rate(some_metric[5m])',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'round(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'round(some_metric, 5)',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
    {
      expr: 'floor()',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 7,
          message: 'expected 1 argument(s) in call to "floor", got 0',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'floor(some_metric, other_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 32,
          message: 'expected 1 argument(s) in call to "floor", got 2',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'floor(some_metric, 1)',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 21,
          message: 'expected 1 argument(s) in call to "floor", got 2',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'floor(1)',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 6,
          to: 7,
          message: 'expected type vector in call to function "floor", got scalar',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'hour(some_metric, some_metric, some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 0,
          to: 43,
          message: 'expected at most 1 argument(s) in call to "hour", got 3',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'time(some_metric)',
      expectedValueType: ValueType.scalar,
      expectedDiag: [
        {
          from: 0,
          to: 17,
          message: 'expected 0 argument(s) in call to "time", got 1',
          severity: 'error',
        },
      ],
    },
    {
      expr: 'rate(some_metric)',
      expectedValueType: ValueType.vector,
      expectedDiag: [
        {
          from: 5,
          to: 16,
          message: 'expected type matrix in call to function "rate", got vector',
          severity: 'error',
        },
      ],
    },
    {
      expr:
        'histogram_quantile(                                             # Root of the query, final result, approximates a quantile.\n' +
        '  0.9,                                                          # 1st argument to histogram_quantile(), the target quantile.\n' +
        '  sum by(le, method, path) (                                    # 2nd argument to histogram_quantile(), an aggregated histogram.\n' +
        '    rate(                                                       # Argument to sum(), the per-second increase of a histogram over 5m.\n' +
        '      demo_api_request_duration_seconds_bucket{job="demo"}[5m]  # Argument to rate(), the raw histogram series over the last 5m.\n' +
        '    )\n' +
        '  )\n' +
        ')',
      expectedValueType: ValueType.vector,
      expectedDiag: [],
    },
  ];
  testCases.forEach((value) => {
    const state = createEditorState(value.expr);
    const parser = new Parser(state);
    it(value.expr, () => {
      chai.expect(parser.checkAST(syntaxTree(state).topNode.firstChild)).to.equal(value.expectedValueType);
      chai.expect(parser.getDiagnostics()).to.deep.equal(value.expectedDiag);
    });
  });
});
