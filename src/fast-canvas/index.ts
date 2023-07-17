import type { CornerPoint } from './types';
import nms from './nms';

interface FASTOptions {
  border?: number;
  imageData: ImageData;
  radius?: number;
  threshold?: number;
}

function clamp(value: number, max = 255, min = 0): number {
  if (value > max) {
    return max;
  }
  return value < min ? min : value;
}

function drawSquare(pixels: Uint8ClampedArray, x: number, y: number, width: number) {
  for (let i = -3; i <= 3; i += 1) {
		const px1 = getPixel(x + i, y - 3, width);
		const px2 = getPixel(x + i, y + 3, width);
		pixels[px1 + 1] = 255;
		pixels[px2 + 1] = 255;
	}
	for (let i = -2; i <= 2; i += 1) {
		const px1 = getPixel(x - 3, y + i, width)
		const px2 = getPixel(x + 3, y + i, width)
		pixels[px1 + 1] = 255;
		pixels[px2 + 1] = 255;
	}
}

function getCoordinates(
  pixel: number,
  width: number,
): { x: number; y: number; } {
  return {
    x: pixel % width,
    y: Math.floor(pixel / width),
  };
}

function getPixel(
  x: number,
  y: number,
  width: number,
): number {
  return ((y * width) + x) * 4;
}

function grayscale(pixels: Uint8ClampedArray): Uint8ClampedArray {
  for (let i = 0; i < pixels.length; i += 4) {
    const average = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
    pixels[i] = average;
    pixels[i + 1] = average;
    pixels[i + 2] = average;
  }
  return pixels;
}

export default function fast({
  border = 5,
  imageData,
  radius = 15,
  threshold = 120,
}: FASTOptions): ImageData {
  const { data: pixels, height, width } = imageData;
  const gray = grayscale(pixels);

  const points: CornerPoint[] = [];

  for (let i = 0; i < pixels.length; i += 4) {
    const { x, y } = getCoordinates(i / 4, width);

    // skip border pixels
    if (x < border || x > width - border
      || y < border || y > height - border) {
      continue;
    }

    const grayPixel = gray[i];
    const circle = new Array<number>(16);
    circle[0] = gray[getPixel(x, y - 3, width)];
    circle[4] = gray[getPixel(x + 3, y, width)];
    circle[8] = gray[getPixel(x, y + 3, width)];
    circle[12] = gray[getPixel(x - 3, y, width)];

    const deltaMax = clamp(grayPixel + threshold);
    const deltaMin = clamp(grayPixel - threshold);

    let brighterCount = 0;
    let darkerCount = 0;
    if (circle[0] > deltaMax) {
      brighterCount += 1;
    } else if (circle[0] < deltaMin) {
      darkerCount += 1;
    }
    if (circle[4] > deltaMax) {
      brighterCount += 1;
    } else if (circle[4] < deltaMin) {
      darkerCount += 1;
    }
    if (circle[8] > deltaMax) {
      brighterCount += 1;
    } else if (circle[8] < deltaMin) {
      darkerCount += 1;
    }
    if (circle[12] > deltaMax) {
      brighterCount += 1;
    } else if (circle[12] < deltaMin) {
      darkerCount += 1;
    }

    if (brighterCount < 3 && darkerCount < 3) {
      continue;
    }

    circle[1] = gray[getPixel(x + 1, y - 3, width)];
    circle[2] = gray[getPixel(x + 2, y - 2, width)];
    circle[3] = gray[getPixel(x + 3, y - 1, width)];
    circle[5] = gray[getPixel(x + 3, y + 1, width)];
    circle[6] = gray[getPixel(x + 2, y + 2, width)];
    circle[7] = gray[getPixel(x + 1, y + 3, width)];
    circle[9] = gray[getPixel(x - 1, y + 3, width)];
    circle[10] = gray[getPixel(x - 2, y + 2, width)];
    circle[11] = gray[getPixel(x - 3, y + 1, width)];
    circle[13] = gray[getPixel(x - 3, y - 1, width)];
    circle[14] = gray[getPixel(x - 2, y - 2, width)];
    circle[15] = gray[getPixel(x - 1, y - 3, width)];

    const invalidIndexes = circle.reduce(
      (array: number[], value: number): number[] => {
        if (value < deltaMax && value > deltaMin) {
          array.push(value);
        }
        return array;
      },
      [],
    );

    const { length: invalidIndexesLength } = invalidIndexes; 
    if (invalidIndexesLength > 4) {
      continue;
    }
    const checkBright = darkerCount < brighterCount;
    let nextIndex = invalidIndexes.length > 0 ? clamp(invalidIndexes[0] + 1, 15) : 0;
    let currentValid = 0;
    let maxValid = 0;
    let intensitySum = 0;
    for (let i = 0; i < 15; i += 1) {
      const point = circle[nextIndex];
      if ((checkBright && point > deltaMax) || (!checkBright && point < deltaMin)) {
        currentValid += 1;
        intensitySum += Math.abs(grayPixel - point);
      } else {
        currentValid = 0;
      }
      if (currentValid > maxValid) {
        maxValid = currentValid;
      }
      nextIndex = clamp(nextIndex + 1, 15);
    }
    if (maxValid < 12) {
      continue;
    }

    const intensityAverage = intensitySum / maxValid;
    const intensityDifference = grayPixel > intensityAverage
      ? grayPixel - intensityAverage
      : intensityAverage - grayPixel;
    
    points.push({
      intensityDifference,
      x,
      y,
    });
  }

  // const nmsPoints = nms(points, radius);
  points.forEach((point: CornerPoint): void => {
    if (point) {
      drawSquare(pixels, point.x, point.y, width);
    }
  });

  return imageData;
}
