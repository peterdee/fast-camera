import type { CornerPoint } from './types';

type SortField = 'x' | 'y';

export default function simpleNMS(
  array: CornerPoint[] = [],
  result: CornerPoint[] = [],
  radius: number = 15,
  sorted: boolean = false,
  sortField: SortField = 'x',
): CornerPoint[] {
  const primary = sortField === 'x' ? 'x' : 'y';
  const secondary = sortField !== 'x' ? 'x' : 'y';
  if (!sorted && array.length > 0) {
    return simpleNMS(
      array.sort((a, b) => a[primary] - b[primary] || a[secondary] - b[secondary]),
      result,
      radius,
      true,
      sortField,
    );
  }
  if (array.length === 0) {
    console.log(result.length);
    return result;
  }
  const [current, ...rest] = array;
  if (result.length === 0) {
    return simpleNMS(
      rest,
      [...result, current],
      radius,
      true,
      sortField,
    );
  }
  const [lastResult] = result.slice(-1);
  if ((current[primary] - lastResult[primary]) > radius
    && Math.abs(current[secondary] - lastResult[secondary]) > radius) {
    return simpleNMS(
      rest,
      [...result, current],
      radius,
      true,
      sortField,
    );
  }
  if (current.intensitySum > lastResult.intensitySum) {
    result[result.length - 1] = current;
  }
  return simpleNMS(
    rest,
    result,
    radius,
    true,
    sortField,
  );
}
