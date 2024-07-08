<script setup lang="ts">
import { effect, ref } from "vue";
import { useStore } from "../store";
import { getPinyinOf } from "../utils/hanzi";

type Props = {
  hanziSeq: string[];
  index: number;
};
const props = defineProps<Props>();

const maxChar = 8;
function getComputedValues({ hanziSeq, index }: Props) {
  const _page = Math.floor(index / maxChar);
  const start = _page * maxChar;
  const end = start + maxChar;
  const _seq = hanziSeq.slice(start, end);
  return { _seq, _page };
}

const showPinyin = ref(false);
const index = ref(props.index);
const page = ref(0);
const curtSeq = ref<string[]>([]);
const settings = useStore().settings;

function togglePinyin(show: boolean) {
  showPinyin.value = show;
}

effect(() => {
  // eslint-disable-next-line vue/no-mutating-props
  index.value = props.index;
  const { _seq, _page } = getComputedValues(props);
  curtSeq.value = _seq;
  page.value = _page;
  console.log("index", index.value, page.value, curtSeq.value);
});
</script>

<template>
  <div class="displayer">
    <div v-for="(item, i) in curtSeq" :key="i">
      <div
        v-if="i == index - page * maxChar"
        class="current-outset"
        @mouseover="togglePinyin(true)"
        @mouseleave="togglePinyin(false)"
      >
        <div class="current-item">
          <div class="hanzi">
            {{ item }}
          </div>
        </div>
      </div>
      <div v-else class="rest-item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.displayer {
  display: flex;
  align-items: baseline;
  justify-content: center;
  position: relative;

  .current-outset {
    // border: 1px solid var(--black);
    padding: 5px;
  }

  .follow-item {
    font-size: 36px;
    font-weight: bold;
    margin-right: 10px;
    margin-top: -1px;
    position: absolute;
    right: 0;
    // transition: all ease 0.3s;
  }

  .rest-item {
    opacity: 0.4;

    padding-right: 12px;
    padding-bottom: 16px;
    font-size: 24px;
    font-weight: bold;
  }

  .current-item {
    @size: 54px;
    height: @size;
    width: @size;

    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    padding: 10px;
    margin-right: 16px;
    border-radius: 0px;

    .mi-bg {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      opacity: 0.2;
    }

    .pinyin {
      font-size: 14px;
      position: absolute;
      top: -1px;
    }

    .hanzi {
      font-size: 36px;
      font-weight: bold;
    }
  }
}
</style>
