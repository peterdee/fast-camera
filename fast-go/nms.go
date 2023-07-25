package main

import (
	"math"
	"sort"
)

func selectPoints(
	points []Point,
	radius int,
	primary byte,
) []Point {
	i := 0
	result := []Point{}
	for i < len(points) {
		if i >= len(points) {
			break
		}
		current := points[i]
		if len(result) == 0 {
			result = append(result, current)
			i += 1
			continue
		}
		lastResultIndex := len(result) - 1
		previous := result[lastResultIndex]
		currentPrimary := current.X
		currentSecondary := current.Y
		previousPrimary := previous.X
		previousSecondary := previous.Y
		if primary == 'y' {
			currentPrimary = current.Y
			currentSecondary = current.X
			previousPrimary = previous.Y
			previousSecondary = previous.X
		}
		if currentPrimary-previousPrimary < radius &&
			int(math.Abs(float64(currentSecondary-previousSecondary))) < radius {
			if current.IntensitySum > previous.IntensitySum {
				result[lastResultIndex] = current
				i += 1
				continue
			} else {
				i += 1
				continue
			}
		} else {
			result = append(result, current)
			i += 1
		}
	}
	return result
}

func nms(points []Point, radius int) []Point {
	if len(points) <= 1 {
		return points
	}
	sort.SliceStable(
		points,
		func(i, j int) bool {
			if points[i].X != points[j].X {
				return points[i].X < points[j].X
			}
			return points[i].Y < points[j].Y
		},
	)
	pointsX := selectPoints(points, radius, 'x')
	sort.SliceStable(
		pointsX,
		func(i, j int) bool {
			if pointsX[i].Y != pointsX[j].Y {
				return pointsX[i].Y < pointsX[j].Y
			}
			return pointsX[i].X < pointsX[j].X
		},
	)
	return selectPoints(pointsX, radius, 'y')
}
