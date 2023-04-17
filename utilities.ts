import { Platform } from "react-native";
import { selectionAsync } from "expo-haptics";

export const objectToArray = <T>(mixes: Record<string, T>): (T & { id: string })[] => (
  Object.keys(mixes).map((id) => ({
    id,
    ...mixes[id]
  }))
);

export const shallowEqual = <T>(o1: Record<string, T>, o2: Record<string, T>): boolean => {
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

export const range = (size: number, startAt: number = 0, step: number = 1): number[] => (
  [...Array(size).keys()].map((i) => i * step + startAt)
);

export const hapticSelect = async () => {
  if (Platform.OS === "web") return;
  return selectionAsync();
}

export const modulo = (x, y) => ((x % y) + y) % y;

export const prefixSums = (arr: number[]): number[] => {
  const sums = [0];
  for (let i = 0; i < arr.length; i++) {
    sums.push(sums[i] + arr[i]);
  }
  return sums;
};