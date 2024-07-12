const firstLineLeft = 'qwert'.split('') as Char[];
const firstLineRight = 'yuiop'.split('') as Char[];
const secondLineLeft = 'asdfg'.split('') as Char[];
const secondLineRight = 'hjkl'.split('') as Char[];
const thirdLineLeft = 'zxcv'.split('') as Char[];
const thirdLineRight = 'bnm'.split('') as Char[];

export const lines = [
    firstLineLeft, firstLineRight,
    secondLineLeft, secondLineRight,
    thirdLineLeft, thirdLineRight,
    [...firstLineLeft, ...firstLineRight],
    [...secondLineLeft, ...secondLineRight],
    [...thirdLineLeft, ...thirdLineRight],
    [...firstLineLeft, ...firstLineRight, ...secondLineLeft, ...secondLineRight, ...thirdLineLeft, ...thirdLineRight]
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
