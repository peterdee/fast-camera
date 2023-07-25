package main

import (
	"math"
	"syscall/js"
)

type Point struct {
	IntensitySum float64
	X            int
	Y            int
}

const BORDER int = 5

func fastWASM() js.Func {
	return js.FuncOf(func(this js.Value, arguments []js.Value) any {
		if len(arguments) < 1 {
			return "MISSING_ARGUMENTS"
		}
		pixelData := arguments[0]
		height, width := arguments[1].Int(), arguments[2].Int()
		threshold := arguments[3].Int()
		useNMS := arguments[4].Bool()
		nmsRadius := arguments[5].Int()

		pixLen := pixelData.Get("byteLength").Int()
		buffer := make([]uint8, pixLen)
		js.CopyBytesToGo(buffer, pixelData)

		for i := 0; i < pixLen; i += 4 {
			channel := uint8((int(buffer[i]) + int(buffer[i+1]) + int(buffer[i+2])) / 3)
			buffer[i], buffer[i+1], buffer[i+2] = channel, channel, channel
		}

		points := []Point{}
		for i := 0; i < pixLen; i += 4 {
			x, y := getCoordinates(i/4, width)

			if x < BORDER || x > width-BORDER ||
				y < BORDER || y > height-BORDER {
				continue
			}

			brighterCount, darkerCount := 0, 0
			grayPixel := buffer[i]
			deltaMax := uint8(clamp(int(grayPixel)+int(threshold), 0, 255))
			deltaMin := uint8(clamp(int(grayPixel)-int(threshold), 0, 255))
			point0, point8 := buffer[getPixel(x, y-3, width)], buffer[getPixel(x, y+3, width)]
			if point0 > deltaMax {
				brighterCount += 1
			} else if point0 < deltaMin {
				darkerCount += 1
			}
			if point8 > deltaMax {
				brighterCount += 1
			} else if point8 < deltaMin {
				darkerCount += 1
			}
			if brighterCount+darkerCount == 0 {
				continue
			}
			point4, point12 := buffer[getPixel(x+3, y, width)], buffer[getPixel(x-3, y, width)]
			if point4 > deltaMax {
				brighterCount += 1
			} else if point4 < deltaMin {
				darkerCount += 1
			}
			if point12 > deltaMax {
				brighterCount += 1
			} else if point12 < deltaMin {
				darkerCount += 1
			}
			if brighterCount < 3 && darkerCount < 3 {
				continue
			}

			circle := [16]uint8{}
			circle[0] = point0
			circle[1] = buffer[getPixel(x+1, y-3, width)]
			circle[2] = buffer[getPixel(x+2, y-2, width)]
			circle[3] = buffer[getPixel(x+3, y-1, width)]
			circle[4] = point4
			circle[5] = buffer[getPixel(x+3, y+1, width)]
			circle[6] = buffer[getPixel(x+2, y+2, width)]
			circle[7] = buffer[getPixel(x+1, y+3, width)]
			circle[8] = point8
			circle[9] = buffer[getPixel(x-1, y+3, width)]
			circle[10] = buffer[getPixel(x-2, y+2, width)]
			circle[11] = buffer[getPixel(x-3, y+1, width)]
			circle[12] = point12
			circle[13] = buffer[getPixel(x-3, y-1, width)]
			circle[14] = buffer[getPixel(x-2, y-2, width)]
			circle[15] = buffer[getPixel(x-1, y-3, width)]

			invalidIndexes := make([]int, 0, 12)
			for index, value := range circle {
				if value < deltaMax && value > deltaMin {
					invalidIndexes = append(invalidIndexes, index)
				}
			}

			invalidIndexesLength := len(invalidIndexes)
			if invalidIndexesLength > 4 {
				continue
			}

			checkBright := darkerCount < brighterCount
			nextIndex := 0
			if invalidIndexesLength > 0 {
				nextIndex = clamp(invalidIndexes[0]+1, 0, 15)
			}
			currentValid := 0
			maxValid := 0
			intensitySum := 0.0
			for i := 0; i < 15; i += 1 {
				point := circle[nextIndex]
				if (checkBright && point > deltaMax) || (!checkBright && point < deltaMin) {
					currentValid += 1
				} else {
					currentValid = 0
				}
				if currentValid > maxValid {
					maxValid = currentValid
				}
				intensitySum += math.Abs(float64(grayPixel) - float64(point))
				nextIndex = clamp(nextIndex+1, 0, 15)
			}

			if maxValid < 12 {
				continue
			}

			points = append(
				points,
				Point{
					IntensitySum: intensitySum,
					X:            x,
					Y:            y,
				},
			)
		}

		if useNMS {
			nmsPoints := nms(points, nmsRadius)
			for i := range nmsPoints {
				drawSquare(buffer, nmsPoints[i].X, nmsPoints[i].Y, width)
			}
		} else {
			for i := range points {
				drawSquare(buffer, points[i].X, points[i].Y, width)
			}
		}

		return js.CopyBytesToJS(pixelData, buffer)
	})
}

func main() {
	js.Global().Set("fastWASM", fastWASM())
	select {}
}
