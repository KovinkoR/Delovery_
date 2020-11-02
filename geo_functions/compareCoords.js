export default function (centerCoordStr, toCheckCoordStr, radius) {
  const cC = centerCoordStr.split(" ");
  const tC = toCheckCoordStr.split(" ");
  if (
    (cC[0] * 1000000 - tC[0] * 1000000) ** 2 +
      (cC[1] * 1000000 - tC[1] * 1000000) ** 2 <=
    (radius * 0.008998 * 1000000) ** 2
  )
    return true;
  return false;
}
