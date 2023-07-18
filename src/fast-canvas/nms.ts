// Reference: https://github.com/peterdee/js-nms
import type { CornerPoint } from './types';

type SortField = 'x' | 'y';

function combineClusters(
  cluster: CornerPoint[] = [],
  clusters: CornerPoint[][] = [],
  radius: number = 10,
  primary: SortField = 'x',
  secondary: SortField = 'y',
): CornerPoint[][] {
  const [lastCluster = []] = clusters.slice(-1);
  let combine = false;
  for (let i = 0; i < lastCluster.length; i += 1) {
    const lastClusterPoint = lastCluster[i];
    for (let j = 0; j < cluster.length; j += 1) {
      const currentClusterPoint = cluster[j];
      if ((currentClusterPoint[primary] - lastClusterPoint[primary]) < radius
        && Math.abs(currentClusterPoint[secondary] - lastClusterPoint[secondary]) < radius) {
        combine = true;
        break;
      }
    }
    if (combine) {
      break;
    }
  }
  return !combine
    ? [...clusters, cluster]
    : [
      ...clusters.slice(0, clusters.length - 2),
      [...lastCluster, ...cluster].sort(
        (a, b) => a[primary] - b[primary] || a[secondary] - b[secondary],
      ),
    ];
}

function nms(
  array: CornerPoint[] = [],
  radius: number = 10,
  previous: CornerPoint | null = null,
  cluster: CornerPoint[] = [],
  clusters: CornerPoint[][] = [],
  isSorted: boolean = false,
  primarySortField: SortField = 'x',
): CornerPoint[] {
  const primary = primarySortField === 'x' ? 'x' : 'y';
  const secondary = primarySortField !== 'x' ? 'x' : 'y';
  if (!isSorted && array.length > 0) {
    return nms(
      array.sort((a, b) => a[primary] - b[primary] || a[secondary] - b[secondary]),
      radius,
      previous,
      cluster,
      clusters,
      true,
      primarySortField,
    );
  }
  if (array.length === 0) {
    return combineClusters(cluster, clusters, radius, primary, secondary).map(
      (element) => element.sort(
        (a, b) => b.intensitySum - a.intensitySum,
      )[0],
    );
  }
  const [current, ...rest] = array;
  if (previous === null) {
    return nms(rest, radius, current, [current], clusters, true, primarySortField);
  }
  if ((current[primary] - previous[primary]) < radius
    && Math.abs(current[secondary] - previous[secondary]) < radius) {
    cluster.push(current);
    return nms(rest, radius, current, cluster, clusters, true, primarySortField);
  }
  if (clusters.length > 0) {
    return nms(
      rest,
      radius,
      current,
      [current],
      combineClusters(cluster, clusters, radius, primary, secondary),
      true,
      primarySortField,
    );
  }
  clusters.push(cluster);
  return nms(
    rest,
    radius,
    current,
    [current],
    clusters,
    true,
    primarySortField,
  );
}

export default function nmsRecursion(
  array: CornerPoint[] = [],
  radius: number = 10,
  prevLength: number | null = null,
): CornerPoint[] {
  const clusteredX = nms(
    array,
    radius,
    null,
    [],
    [],
    false,
    'x',
  );
  if (prevLength && clusteredX.length === prevLength) {
    return clusteredX;
  }
  const clusteredY = nms(
    clusteredX,
    radius,
    null,
    [],
    [],
    false,
    'y',
  );
  if (clusteredX.length === clusteredY.length) {
    return clusteredY;
  }
  return nmsRecursion(clusteredY, radius, clusteredY.length);
}
