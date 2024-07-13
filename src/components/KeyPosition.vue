<script setup lang="ts">
import Keyboard from "../components/Keyboard.vue";
import PhonemeComponent from "../components/Phoneme.vue";
import TypeSummary from "../components/TypeSummary.vue";
import MenuList from "../components/MenuList.vue";

import { ref } from "vue";
import { computed } from "vue";
import { useStore } from "../store";
import type { PhonemeInputStatus, Phoneme } from "../utils/phoneme";
import {
  courseChars,
  courseDisplays,
  courseNames,
  courses,
  courseTitles,
  keyboardLayoutWithPunctuation,
  paragraphCourseIndexs,
} from "../utils/c";
import "../utils/course";
import { useRoute, useRouter } from "vue-router";

function createWholeSeq(chars: readonly string[]): Phoneme[] {
  const isParagraphCourse = paragraphCourseIndexs.includes(menuIndex.value);
  console.log("isParagraphCourse: ", isParagraphCourse);
  const config = store.mode();
  let nextLead = true;
  const phonemes = chars.map<Phoneme>((char, i) => {
    const mode = nextLead ? "leads" : "follows";
    const status: PhonemeInputStatus = i === 0 ? "activate" : "unfinished";
    const phonemeValues = config.groupByKey.get(char as Char)?.[mode];
    if (phonemeValues) {
      nextLead = !nextLead;
    }
    const values = phonemeValues ?? [char];
    const fragmentIndex = Math.floor(i / perFragmentLength);
    const charIndex = fragmentIndex % values.length;
    const _index = paragraphCourseIndexs.indexOf(menuIndex.value);

    console.log(_index, charIndex);
    const displayValue = isParagraphCourse
      ? courseDisplays[_index][i]
      : values[charIndex];
    return { status, displayValue, values, char };
  });
  return phonemes;
}

interface PhonemeProps {
  mode?: "Lead" | "Follow";
}
const store = useStore();
const props = defineProps<PhonemeProps>();
const mode = props.mode === "Lead" ? "leads" : "follows";

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

function init(_menuIndex: number) {
  router.push({ query: { ...route.query, course: _menuIndex } });
  index.value = 0;
  menuIndex.value = _menuIndex;
  const chars = courses[_menuIndex];
  phonemeSeq.value = createWholeSeq(chars);
  summary.value = {
    inputCharNum: 0,
    correctCharNum: 0,
    startTime: Date.now(),
  };
}

const perFragmentLength = 16;
const currentMenuChangeKeys = ["PageUp", "PageDown"] as const;
const mainMenuChangeKeys = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
] as const;
const allMenuChangeKeys = [...currentMenuChangeKeys, mainMenuChangeKeys];
const route = useRoute();
const router = useRouter();
const index = ref(0);
const menuIndex = ref(0);
const phonemeSeq = ref<Phoneme[]>([]);
const summary = ref({
  startTime: Date.now(),
  inputCharNum: 0,
  correctCharNum: 0,
});
const extraInfos = ref<string[]>([]);
const summaryResult = computed(() => {
  const { startTime, inputCharNum, correctCharNum } = summary.value;
  const now = Date.now();
  const timeDiffer = now - startTime;
  const speed = timeDiffer && (inputCharNum / timeDiffer) * 1000 * 60;
  const accuracy = inputCharNum && correctCharNum / inputCharNum;
  return {
    speed,
    accuracy,
  };
});

console.log(route.query.course);
init(Number(route.query.course ?? 0));

const passRequire = 0.9;
function onFinish() {
  const { accuracy } = summaryResult.value;
  const pass = accuracy >= passRequire;
  extraInfos.value = pass ? [] : ["失败率过高, 请重新完成课程"];
  const newMenuIndex = pass
    ? (menuIndex.value + 1) % courseNames.length
    : menuIndex.value;
  init(newMenuIndex);
}

const resultMap = {
  curt0: "finished-wrong",
  curt1: "finished-correct",
  next0: "activate",
  next1: "activate",
} as const satisfies Record<string, PhonemeInputStatus>;
const punctuationMapper: Record<string, string> = {
  "；": ";",
  "。": ".",
  "，": ",",
};
function updatePhonemeStatus(
  _key: string,
  index: number,
  type: "curt" | "next"
): boolean {
  if (index < 0 || index >= phonemeSeq.value.length) {
    return false;
  }

  const phoneme = phonemeSeq.value[index];
  const key = _key in punctuationMapper ? punctuationMapper[_key] : _key;
  const result = Boolean(key === phoneme.char);
  const status = resultMap[`${type}${Number(result) as 0 | 1}`];
  phoneme.status = status;

  return result;
}

function onSeq([key]: [string?, string?]) {
  // TODO: support backspace
  if (!key) return false;

  extraInfos.value = [];
  if (key === "Backspace" || allMenuChangeKeys.includes(key as any))
    return false;

  const valid = updateSeq({ key, index: index.value });
  valid && summary.value.correctCharNum++;
  summary.value.inputCharNum++;
  return valid;
}

function updateSeq(option?: { key: string; index: number }): boolean {
  let result = false;
  if (option) {
    // non init
    // update current phoneme status
    result = updatePhonemeStatus(option.key, option.index, "curt");
    // update next phoneme status
    updatePhonemeStatus(option.key, option.index + 1, "next");

    // update index
    index.value++;
    document.querySelector(".phoneme.activate")?.scrollIntoView({
      inline: "nearest",
      block: "center",
      behavior: "smooth",
    });

    // check whether finish
    if (index.value >= phonemeSeq.value.length) {
      onFinish();
      return false;
    }
  }

  return result;
}

function onMenuChange(i: number) {
  if (i === menuIndex.value) return;
  init(i);
}

const hints = computed(() => {
  const key = phonemeSeq.value[index.value]?.char ?? "";
  return [key];
});
</script>

<template>
  <div class="home-page">
    <div class="single-menu">
      <menu-list
        enable-arrow
        :menu-change-keys="currentMenuChangeKeys"
        :items="courseNames"
        :index="menuIndex"
        @menu-change="onMenuChange"
      />
    </div>

    <div class="input-area"></div>

    <div class="phoneme-list">
      <PhonemeComponent
        :phoneme-seq="phonemeSeq"
        :title="courseTitles[menuIndex]"
      />
    </div>

    <div class="single-keyboard">
      <Keyboard
        :valid-seq="onSeq"
        :hints="hints"
        mode="singleKey"
        :key-board-layout="keyboardLayoutWithPunctuation"
      />
    </div>

    <div class="summary">
      <TypeSummary
        hide-avgpress
        :avgpress="0"
        :extra-infos="extraInfos"
        :speed="summaryResult.speed"
        :accuracy="summaryResult.accuracy"
      />
    </div>
  </div>
</template>

<style lang="less">
@import "../styles/color.less";
@import "../styles/var.less";

.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  .single-menu {
    position: absolute;
    top: 0;
    left: 100px;
  }

  .input-area {
    margin-bottom: 32px;
    height: 160px;
    display: flex;
    align-items: center;

    @media (max-width: 576px) {
      margin-top: 30vh;
    }
  }

  .summary {
    position: absolute;
    right: var(--app-padding);
    bottom: var(--app-padding);

    @media (max-width: 576px) {
      top: 36px;
    }
  }

  .phoneme-list {
    position: absolute;
    top: var(--app-padding);
    left: 200px;

    @media (max-width: 576px) {
      top: 120px;
    }
  }

  @media (max-width: 576px) {
    .single-keyboard {
      position: absolute;
      bottom: 1em;
    }
  }
}
</style>
