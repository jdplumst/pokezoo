export function withinInstanceLimit(
  instanceCount: number,
  catchingCharm: boolean,
) {
  const limit = catchingCharm ? 3000 : 2000;
  return instanceCount <= limit;
}
