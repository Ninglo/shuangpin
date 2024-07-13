import { flatten, repeat, split, unnest, xprod } from "ramda";

type Group = string[];
type Course = Group[];

const xprodWithoutSame = (str: string) =>
    xprod(str.split(""), str.split("")).filter((chr) => chr[0] !== chr[1]);

// a s d e f | ; l k i j
export const course_1_1 = unnest(
    repeat(["asdf", ";lkj"].map(split("")), 6)
) satisfies Course;
export const course_1_2 = unnest(
    repeat(["asdef", ";lkij"].map(split("")), 5)
) satisfies Course;
export const course_1_3 = xprodWithoutSame("asdeflkij") satisfies Course;
export const course_1_4 = [];
export const course_1_5 = [];

// g t | h o u n
export const course_2_1 = unnest(
    repeat(["a;sldkfjgh"].map(split("")), 6)
) satisfies Course;
export const course_2_2 = unnest(
    repeat(["asdefghk", "lokijujhjn"].map(split("")), 4)
) satisfies Course;
export const course_2_3 =
    "l.  a.  l.  s.  l.  d.  l.  e.  l.  n.  l.  t.  l.  o. l.  a.  l.  s.  l.  d.  l.  e.  l.  n.  l.  t.  l.  o."
        .split(" ")
        .map(split("")) satisfies Course;
export const course_2_4 = xprodWithoutSame("asdfgtlokjuhn") satisfies Course;
export const course_2_5 = [];
export const course_2_6 = [];

// r c | y , : p
export const course_3_1 = unnest(
    repeat(
        [
            "deki",
            "frju",
            "dck,",
            "dcl.",
            "frju",
            "ftjy",
            "fgjh",
            ";p;p",
            "jujy",
            "dedc",
            "lol.",
            "kik,",
            "fgju",
            ";:;:",
            "frfk",
            "jujy",
            "dedc",
            "kik,",
        ].map(split("")),
        1
    )
) satisfies Course;
export const course_3_2 = xprodWithoutSame("asdcfrplkjhy") satisfies Course;
export const course_3_3 = [];
export const course_3_4 = [];

// q w z x v b | m
export const course_4_1 = unnest(
    repeat(
        [
            "dedc",
            "kik,",
            "frfv",
            "jujm",
            "swsx",
            "lol.",
            "aqaz",
            ";p;p",
            "frfv",
            "jujm",
            "ftfb",
            "jyjn",
            "aqsw",
            "az;p",
            "sxl.",
            "fvjm",
            "fvjn",
            "fbjn",
        ].map(split("")),
        1
    )
) satisfies Course;
export const course_4_2 = xprodWithoutSame("aqzswxdfvblkjm") satisfies Course;
export const course_4_3 = [];
export const course_4_4 = [];

export const courses = [
    [course_1_1, course_1_2, course_1_3, course_1_4, course_1_5],
    [course_2_1, course_2_2, course_2_3, course_2_4, course_2_5, course_2_6],
    [course_3_1, course_3_2, course_3_3, course_3_4,],
    [
        course_4_1,
        course_4_2,
        course_4_3,
        course_4_4,
    ],
] as const;

function generateCalculatedResult() {
    const res = courses
        .map((coursesInOneSection, i) => {
            return coursesInOneSection
                .map((course, j) => {
                    return `export const course_${i + 1}_${j + 1} = ${JSON.stringify(flatten(course))};`;
                })
                .join("\n");
        })
        .join("\n");
    console.log(res);
}

function generateCalculatedResult2() {
    const res = courses
        .map((coursesInOneSection, i) => {
            return coursesInOneSection
                .map((course, j) => {
                    return `'课程 ${i + 1}-${j + 1}',`;
                })
                .join("\n");
        })
        .join("\n");
    console.log(res);
}

generateCalculatedResult();
generateCalculatedResult2()
