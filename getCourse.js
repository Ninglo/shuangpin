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

// courseChars.map((_chars) => {
//   const chars = _chars[0] + _chars[1];
//   const res = chars
//     .split("")
//     .flatMap((char) => {
//       const { follows, leads } = store.mode().groupByKey.get(char as Char) ?? {
//         follows: [],
//         leads: [],
//       };
//       return { follows, leads };
//     })
//     .reduce<{ follows: string[]; leads: string[] }>(
//       (prev, curt) => {
//         const { follows, leads } = prev;
//         return {
//           follows: follows.concat(curt.follows),
//           leads: leads.concat(curt.leads),
//         };
//       },
//       { follows: [], leads: [] }
//     );
//   console.log(
//     "元音: ",
//     JSON.stringify(res.follows.filter(Boolean)),
//     "\n",
//     "辅音: ",
//     JSON.stringify(res.leads.filter(Boolean))
//   );
// });
export const courseChars_1 = ['asdef', ';lkij'];
export const courseChars_2 = ['asdfgt', 'lkjhoun'];
export const courseChars_3 = ['asdfrc', 'lkjy,:p'];
export const courseChars_4 = ['asdfqwzxvb', 'lkjm'];

export const courseChars = [courseChars_1, courseChars_2, courseChars_3, courseChars_4];

const mp = ["course_1_4", "course_2_5", "course_3_3", "course_4_3"];
const as = courseDisplays
    .map((cs) => {
        const as = cs.map((c) => {
            const { main } = store.mode().groupByFollow.get(c) ??
                store.mode().groupByLead.get(c) ?? { main: c };

            return main;
        });
        return as;
    })
    .map((cs, i) => {
        return `export const ${mp[i]} = ${JSON.stringify(cs)};`;
    })
    .join("\n");
console.log(as);
