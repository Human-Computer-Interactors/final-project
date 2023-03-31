export const objectToArray = <T>(mixes: StringToTypeMap<T>): (T & { id: string })[] => (
  Object.keys(mixes).map((id) => ({
    id,
    ...mixes[id]
  }))
);

export const shallowEqual = <T>(o1: StringToTypeMap<T>, o2: StringToTypeMap<T>): boolean => {
  const k1 = Object.keys(o1);
  const k2 = Object.keys(o2);
  if (k1.length !== k2.length) return false;
  for (const k of k1) {
    if (o1[k] !== o2[k]) {
      return false;
    }
  }
  return true;
};