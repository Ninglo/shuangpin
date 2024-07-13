import { repeat, unnest } from "ramda";

export function repeatListTill<T>(list: readonly T[], count: number): readonly T[] {
    const repeatTimes = Math.ceil(count / list.length);
    const repeatedList = unnest(repeat(list, repeatTimes)).slice(0, count);
    return repeatedList;
}