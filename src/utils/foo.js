//@ts-check
// type CourseChars = [base: string, newLeft: string, newRight: string];
// type Course = string[][];

function removeTones(input) {
    const tones = ['ā', 'ē', 'ī', 'ō', 'ū', 'ǖ', 'á', 'é', 'í', 'ó', 'ú', 'ǘ', 'ǎ', 'ě', 'ǐ', 'ǒ', 'ǔ', 'ǚ', 'à', 'è', 'ì', 'ò', 'ù', 'ǜ'];
    const noTones = ['a', 'e', 'i', 'o', 'u', 'ü', 'a', 'e', 'i', 'o', 'u', 'ü', 'a', 'e', 'i', 'o', 'u', 'ü', 'a', 'e', 'i', 'o', 'u', 'ü'];
    let output = input;
    for (let i = 0; i < tones.length; i++) {
        const regex = new RegExp(tones[i], 'g');
        output = output.replace(regex, noTones[i]);
    }
    return output;
}
function startsWithConsonant(input) {
    const consonants = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'v', 'w', 'y'];
    for (let i = 0; i < consonants.length; i++) {
        if (input.startsWith(consonants[i])) {
            return { match: true, length: consonants[i].length };
        }
    }
    return { match: false, length: 0 };
}
function splitIntoSyllables(input) {
    const words = input.split(/([\s,.;:!?"])/);
    const syllables = [];
    for (let i = 0; i < words.length; i++) {
        const consonantCheck = startsWithConsonant(words[i]);
        if (consonantCheck.match) {
            const consonant = words[i].substring(0, consonantCheck.length);
            const vowel = words[i].substring(consonantCheck.length);
            syllables.push(consonant, vowel);
        }
        else {
            syllables.push(words[i]);
        }
    }
    return syllables.filter(c => c.trim());
}
const raw1 = 'jiong chang de shan, feng liang e mei. da cheng shi de jia ting, si ji ke ai. kan jian shui chong de luo ye, you xiang qi jia. ji ai de hai zi men, zai yuan an de yuan zi li wan. ling jia de fang zi, qing jie liang shuang. da jia dou xiang ge di fang de sheng huo, jin qiang ai lian.'
const raw2 = 'shang jing tong shuo san lang jian shan kai guo hai ling xiao feng dao shuai jiong tuan feng yuan kang deng. tian qian sheng kuang jiao an guan she hui tong zhuang. shang nan shang kai lu jiu huan. yuan shang dao jian feng xiang kuai zhuai dian jian kang.'
const raw3 = 'Sha rao ceng diong lian, pai fong yie. Ji dail song lai, kai jian ling. Fu la jing yan, pon kian. Ca pe lang, kun siang jun. Li piao sheng, qun ji un. Suan jing diang, liang lan. Piao jian song, yong dian cang. Luo kang yuan, zhao reng jiong. Pian ling cuan, juai pan.'
const raw4 = 'zhang dong wei mian, jia li zhu sha xiong. ba sha xiong dong xi zhao san dong shang. qi li shuo: "mian bian kuai shang jia le." sha xiong jiu mian xiang jia. zhe shi jian bian de shi qing. xia wu, qian mian de lian shi hui, zhuan xian ba lei jie yi qi. dong tian lai le, sha xiong yong qing qian de hua xi jian yi ge an ning de jia yuan.'

const mp = [
    'courseDisplay_1_4',
    'courseDisplay_2_5',
    'courseDisplay_3_3',
    'courseDisplay_4_3',
];
const x = [
    raw1,
    raw2,
    raw3,
    raw4
].map(input => {
    const noTones = removeTones(input);
    const characters = splitIntoSyllables(noTones);
    return characters;
}).map((cs, i) => {
    const str = `export const ${mp[i]} = ${JSON.stringify(cs)};`;
    console.log(str)
})
