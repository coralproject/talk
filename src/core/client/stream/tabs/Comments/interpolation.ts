/* eslint-disable */
const colors: Color[] = [
  [ 142, 155, 165 ],
  [ 184, 188, 189 ],
  [ 204, 207, 208 ],
  [ 255, 226, 227 ]
]

type Color = [number, number, number];

const diff = (a: Color, b: Color): Color =>
  a.map((c, i) => c - b[i]) as Color;

const diffs = colors.slice(1)
  .map((c, i) => diff(c, colors[i]));

console.log(diffs);
