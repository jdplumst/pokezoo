export function withinInstanceLimit(
  newInstanceCount: number, // instances after
  catchingCharm: boolean,
) {
  const limit = catchingCharm ? 3000 : 2000;
  return newInstanceCount <= limit;
}
