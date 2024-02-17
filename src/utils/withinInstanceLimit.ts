export function withinInstanceLimit(instanceCount: number, ovalCharm: boolean) {
  const limit = ovalCharm ? 3000 : 2000;
  return instanceCount < limit;
}
