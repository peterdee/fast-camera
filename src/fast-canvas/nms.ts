import type { CornerPoint } from './types';

function selectPoints(
  array: CornerPoint[] = [],
  radius: number = 15,
): CornerPoint[] {
  let i = 0;
  const result: CornerPoint[] = [];
  for (; i < array.length;) {
    if (i >= array.length) {
      break;
    }
    const current = array[i];
    if (result.length === 0) {
      result.push(current);
      i += 1;
      continue;
    }
    const lastResultIndex = result.length - 1;
    const previous = result[lastResultIndex];
    if ((current.x - previous.x) < radius
      && Math.abs(current.y - previous.y) < radius) {
      if (current.intensitySum > previous.intensitySum) {
        result[lastResultIndex] = current;
        i += 1;
        continue;
      } else {
        i += 1;
        continue;
      }
    } else {
      result.push(current);
      i += 1;
    }
  }
  return result;
}

export default function NMS(
  array: CornerPoint[] = [],
  radius: number = 15,
): CornerPoint[] {
  if (array.length <= 1) {
    return array;
  }
  const sortedX = array.sort((a, b) => a.x - b.x || a.y - b.y);
  const sortedY = selectPoints(sortedX, radius).sort((a, b) => a.y - b.y || a.x - b.x);
  return selectPoints(sortedY, radius);
}
