<script setup lang="ts">
import Keyboard from "../components/Keyboard.vue";
import Hanzi from "../components/Hanzi.vue";
import Pinyin from "../components/Pinyin.vue";
import TypeSummary from "../components/TypeSummary.vue";
import MenuList from "../components/MenuList.vue";

import { onActivated, onDeactivated, ref } from "vue";
import { lines, matchSpToPinyin, ShuangpinConfig } from "../utils/keyboard";
import { useStore } from "../store";
import { computed } from "vue";
import { getPinyinOf } from "../utils/hanzi";
import { TypingSummary } from "../utils/summary";
import { followKeys, leadKeys } from "../utils/pinyin";
import { randInt } from "../utils/number";

export interface SingleModeProps {
  nextChar?: () => string;
  hanziList?: string[];
  onValidInput?: (result: boolean) => void;
  mode?: "Lead" | "Follow";
  extraMode?: "SingleChar";
  line?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

// eslint-disable-next-line vue/no-dupe-keys
function nextChar(init?: boolean) {
  if (props.extraMode === "SingleChar") {
    const key = props.mode === "Lead" ? "leads" : "follows";
    const line = init ? lineRef.value : props.line ?? 3;
    const config = store.mode();
    return _nextChar(key, line, config);
  }

  if (!props.mode) {
    return props.nextChar?.() ?? "";
  }
  return props.hanziList?.[randInt(props.hanziList?.length)] ?? "";
}

const pinyin = ref<string[]>([]);

const store = useStore();
const props = defineProps<SingleModeProps>();
const bufferNum = 16;
const hanziSeq = ref(new Array(bufferNum).fill(0).map(() => nextChar()));
const isValid = ref(false);
const lineRef = ref(props.line ?? 3);
const index = ref(0);

const summary = ref(new TypingSummary());

function _nextChar(
  key: "leads" | "follows",
  line: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  config: ShuangpinConfig
): string {
  const chars = lines[line].flatMap((chr) => config.groupByKey.get(chr)![key]);

  const index = Math.floor(Math.random() * chars.length);
  const curt = chars[index];

  return curt;
}

const keys = {
  Lead: leadKeys,
  Follow: followKeys,
  "": [] as string[],
}[props.mode ?? ""];

const progresses = computed(() =>
  keys.map((v) => {
    return {
      key: v,
      progress: store.getProgress(v),
    };
  })
);

const listMenuItems = computed(() => {
  if (props.extraMode === "SingleChar") {
    return [
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
  }

  return progresses.value.map(
    (v) =>
      `${v.key.toUpperCase()} ${(store.getAccuracy(v.key) * 100).toFixed(2)}%`
  );
});

const menuIndex = computed(() => {
  if (props.extraMode === "SingleChar") {
    return lineRef.value;
  } else if (props.mode === "Lead") {
    return store.currentLeadIndex;
  } else if (props.mode === "Follow") {
    return store.currentFollowIndex;
  }
  return -1;
});

function onMenuChange(i: number) {
  if (props.extraMode === "SingleChar") {
    if (i === lineRef.value) return;
    setState({
      index: 0,
      line: i as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    });
    lineRef.value = i as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  } else if (props.mode === "Lead") {
    store.currentLeadIndex = i;
  } else if (props.mode === "Follow") {
    store.currentFollowIndex = i;
  }
}

function setState(params: { index: number; line: 0 | 1 | 2 | 3 | 4 | 5 | 6 }) {
  index.value = params.index;
  lineRef.value = params.line;
  const key = props.mode === "Lead" ? "leads" : "follows";
  hanziSeq.value = new Array(bufferNum)
    .fill(0)
    .map(() => _nextChar(key, params.line, store.mode()));
}

const updateHanziSeq = () => {
  index.value++;
  if (index.value >= bufferNum) {
    setState({
      index: 0,
      line: lineRef.value,
    });
  }
};

function onKeyPressed() {
  summary.value.onKeyPressed();
}

onActivated(() => {
  document.addEventListener("keypress", onKeyPressed);
});

onDeactivated(() => {
  document.removeEventListener("keypress", onKeyPressed);
});

const answer = computed(() => {
  const pys = getPinyinOf(hanziSeq.value.at(0) ?? "");
  return pys.at(0) ?? "";
});

const hints = computed(() => {
  return (store.mode().py2sp.get(answer.value) ?? "").split("");
});

function onSeq([lead, follow]: [Char?, Char?]) {
  if (props.extraMode === "SingleChar") {
    const key = props.mode === "Lead" ? "leads" : "follows";
    const choices = store.mode().groupByKey.get(lead!)?.[key];

    const valid = Boolean(
      choices?.includes(hanziSeq.value.at(index.value) ?? "")
    );
    console.log(
      lead,
      choices,
      hanziSeq.value.at(index.value),
      hanziSeq.value,
      valid
    );
    isValid.value = valid;

    if (valid) {
      updateHanziSeq();
    }

    return true;
  }

  const res = matchSpToPinyin(
    store.mode(),
    lead as Char,
    follow as Char,
    answer.value
  );

  console.log(res);

  if (!!lead && !!follow) {
    props.onValidInput?.(res.valid);
    store.updateProgressOnValid(res.lead, res.follow, res.valid);
  }

  const fullInput = !!lead && !!follow;
  if (fullInput) {
    summary.value.onValid(res.valid);
  }

  pinyin.value = [res.lead, res.follow].filter((v) => !!v) as string[];

  isValid.value = res.valid;

  if (res.valid) {
    setTimeout(() => {
      hanziSeq.value.shift();
      hanziSeq.value.push(nextChar());
      pinyin.value = [];
      isValid.value = false;
    }, 100);
  }

  return res.valid;
}

// watchPostEffect(() => {
//   if (isValid.value) {
//     setTimeout(() => {
//       hanziSeq.value.unshift(nextChar());
//       hanziSeq.value.pop();
//       pinyin.value = [];
//       isValid.value = false;
//     }, 100);
//   }
// });
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

    <div class="input-area">
      <Pinyin :chars="pinyin" />
    </div>

    <div class="hanzi-list">
      <Hanzi :hanzi-seq="hanziSeq" :index="index" />
    </div>

    <div class="single-keyboard">
      <Keyboard :valid-seq="onSeq" :hints="hints" :mode="extraMode" />
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

  .hanzi-list {
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
