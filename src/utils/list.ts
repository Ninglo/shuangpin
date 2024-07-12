import { flatten, repeat } from "ramda";

export function repeatListTill<T>(list: T[], count: number): T[] {
    const repeatTimes = Math.ceil(count / list.length);
    const repeatedList = flatten(repeat(list, repeatTimes)).slice(0, count);
    return repeatedList;
}