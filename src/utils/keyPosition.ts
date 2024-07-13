
const firstLineLeft = "qwert".split("") as Char[];
const firstLineRight = "yuiop".split("").reverse() as Char[];
const secondLineLeft = "asdfg".split("") as Char[];
const secondLineRight = "hjkl".split("").reverse() as Char[];
const thirdLineLeft = "zxcv".split("") as Char[];
const thirdLineRight = "bnm".split("").reverse() as Char[];

const firstLine = [...firstLineLeft, ...firstLineRight];
const secondLine = [...secondLineLeft, ...secondLineRight];
const thirdLine = [...thirdLineLeft, ...thirdLineRight];
const total = [
    ...firstLineLeft,
    ...firstLineRight,
    ...secondLineLeft,
    ...secondLineRight,
    ...thirdLineLeft,
    ...thirdLineRight,
];
export const lines = [
    firstLineLeft,
    firstLineRight,
    secondLineLeft,
    secondLineRight,
    thirdLineLeft,
    thirdLineRight,
    firstLine,
    secondLine,
    thirdLine,
    total,
] as const;

export const lineNames = [
    "第一行(左)",
    "第一行(右)",
    "第二行(左)",
    "第二行(右)",
    "第三行(左)",
    "第三行(右)",
    "第一行",
    "第二行",
    "第三行",
    "全部",
] as const;
