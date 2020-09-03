export const matchOpTerms = ['=', '!=', '=~', '!~'];
export const binOpTerms = ['^', '*', '/', '%', '+', '-', '==', '>=', '>', '<', '<=', '!=', 'and', 'or', 'unless'];
export const binOpModifierTerms = ['on', 'ignoring', 'group_left', 'group_right'];
export const functionIdentifierTerms = [
  'abs',
  'absent',
  'absent_over_time',
  'avg_over_time',
  'ceil',
  'changes',
  'clamp_max',
  'clamp_min',
  'count_over_time',
  'days_in_month',
  'day_of_month',
  'day_of_week',
  'delta',
  'deriv',
  'exp',
  'floor',
  'histogram_quantile',
  'holt_winters',
  'hour',
  'idelta',
  'increase',
  'irate',
  'label_replace',
  'label_join',
  'ln',
  'log10',
  'log2',
  'max_over_time',
  'min_over_time',
  'minute',
  'month',
  'predict_linear',
  'quantile_over_time',
  'rate',
  'resets',
  'round',
  'scalar',
  'sort',
  'sort_desc',
  'sqrt',
  'stddev_over_time',
  'stdvar_over_time',
  'sum_over_time',
  'time',
  'timestamp',
  'vector',
  'year',
];
export const aggregateOpTerms = ['avg', 'bottomk', 'count', 'count_values', 'group', 'max', 'min', 'quantile', 'stddev', 'stdvar', 'sum', 'topk'];
export const aggregateOpModifierTerms = ['by', 'without'];
