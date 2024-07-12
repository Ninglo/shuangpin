<script setup lang="ts">
import Keyboard from "../components/Keyboard.vue";
import PhonemeComponent from "../components/Phoneme.vue";
import TypeSummary from "../components/TypeSummary.vue";
import MenuList from "../components/MenuList.vue";

import { onActivated, onDeactivated, ref } from "vue";
import { useStore } from "../store";
import { computed } from "vue";
import { getPinyinOf } from "../utils/hanzi";
import { TypingSummary } from "../utils/summary";
import type { PhonemeInputStatus, Phoneme } from "../utils/phoneme";
import { lines } from "../utils/keyPosition";
import { repeatListTill } from "../utils/list";
import { ShuangpinConfig } from "../utils/keyboard";

/**
 * create whole seq -> update display seq ->
 * loop: keyboard tap -> check result -> update display seq
 * -(after the whole seq being finished)-> create new whole seq
 */

type SeqType =
  | {
      type: "random";
      count: number;
    }
  | {
      type: "sequence";
      count: number;
    };
function createWholeSeq(type: SeqType, chars: readonly Char[]): Phoneme[] {
  const config = store.mode();
  const phonemeValues = chars
    .flatMap((chr) => config.groupByKey.get(chr)?.[mode] ?? "")
    .filter(Boolean);
  const repeatedChars = repeatListTill(phonemeValues, type.count);
  const phonemes = repeatedChars.map<Phoneme>((value, i) => {
    const status: PhonemeInputStatus = i === 0 ? "activate" : "unfinished";
    return { status, value };
  });

  switch (type.type) {
    case "sequence":
      return phonemes;
    case "random":
      // TODO random
      return phonemes;
  }
}

function validPhoneme(
  config: ShuangpinConfig,
  char: string,
  phoneme: Phoneme["value"],
  mode: "leads" | "follows"
): boolean {
  const result = config.groupByKey.get(char as Char)?.[mode].includes(phoneme);
  return Boolean(result);
}

interface PhonemeProps {
  mode?: "Lead" | "Follow";
  seqType?: SeqType;
}
const store = useStore();
const props = defineProps<PhonemeProps>();
const mode = props.mode === "Lead" ? "leads" : "follows";
const summary = ref(new TypingSummary());

function init(_menuIndex = 0) {
  index.value = 0;
  menuIndex.value = _menuIndex;
  const type = props.seqType ?? { type: "sequence", count: 16 };
  const chars = lines[menuIndex.value];
  wholeSeq.value = createWholeSeq(type, chars);
  displaySeq.value = wholeSeq.value.slice(0, perFragmentLength);
}

const perFragmentLength = 8;
const index = ref(0);
const menuIndex = ref(0);
const wholeSeq = ref<Phoneme[]>([]);
const displaySeq = ref<Phoneme[]>([]);

init();

function onFinish() {
  init((menuIndex.value + 1) % listMenuItems.length);
}

const resultMap = {
  // prev0: "finished-wrong",
  // prev1: "finished-correct",
  curt0: "finished-wrong",
  curt1: "finished-correct",
  next0: "activate",
  next1: "activate",
} as const satisfies Record<string, PhonemeInputStatus>;
function updatePhonemeStatus(
  key: string,
  index: number,
  type: "curt" | "next"
): boolean {
  if (index < 0 || index >= wholeSeq.value.length) {
    return false;
  }

  const config = store.mode();
  const phoneme = wholeSeq.value[index];
  const result = validPhoneme(config, key, phoneme.value, mode);
  const status = resultMap[`${type}${Number(result) as 0 | 1}`];
  phoneme.status = status;

  return result;
}

function onSeq([key]: [string?, string?]) {
  if (!key) return false;

  const valid = updateDisplaySeq({ key, index: index.value });
  if (valid) {
    summary.value.onValid(valid);
  }

  return valid;
}

function updateDisplaySeq(option?: { key: string; index: number }): boolean {
  let result = false;
  if (option) {
    // not init

    // TODO: support backspace
    // update current phoneme status
    result = updatePhonemeStatus(option.key, option.index, "curt");
    // update next phoneme status
    updatePhonemeStatus(option.key, option.index + 1, "next");

    // update index
    index.value++;
    // check whether finish
    if (index.value >= wholeSeq.value.length) {
      onFinish();
      return false;
    }
  }

  // check display seq slice by index and perFragmentLength
  const fragmentIndex = Math.floor(index.value / perFragmentLength);
  const fragment = wholeSeq.value.slice(
    fragmentIndex * perFragmentLength,
    (fragmentIndex + 1) * perFragmentLength
  );
  // update display seq
  displaySeq.value = fragment;

  return result;
}

const listMenuItems = [
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
];

function onMenuChange(i: number) {
  if (i === menuIndex.value) return;
  init(i);
}

function onKeyPressed() {
  summary.value.onKeyPressed();
}

onActivated(() => {
  document.addEventListener("keypress", onKeyPressed);
});

onDeactivated(() => {
  document.removeEventListener("keypress", onKeyPressed);
});

// TODO
const hints = computed(() => {
  const pys = getPinyinOf(wholeSeq.value[index.value].value ?? "");
  const answer = pys.at(0) ?? "";
  return store.mode().py2sp.get(answer)?.split("");
});
</script>

<template>
  <div class="home-page">
    <div class="single-menu">
      <menu-list
        enable-arrow
        :items="listMenuItems"
        :index="menuIndex"
        @menu-change="onMenuChange"
      />
    </div>

    <div class="input-area"></div>

    <div class="phoneme-list">
      <PhonemeComponent :phoneme-seq="displaySeq" />
    </div>

    <div class="single-keyboard">
      <Keyboard :valid-seq="onSeq" :hints="hints" mode="singleKey" />
    </div>

    <div class="summary">
      <TypeSummary
        :speed="summary.hanziPerMinutes"
        :accuracy="summary.accuracy"
        :avgpress="summary.pressPerHanzi"
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
