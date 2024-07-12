<script setup lang="ts">
import { Phoneme } from "../utils/phoneme";

type Props = {
  phonemeSeq: Phoneme[];
};
defineProps<Props>();
</script>

<template>
  <div class="displayer">
    <div
      v-for="(phoneme, i) in phonemeSeq"
      :key="i"
      :class="`phoneme-${phoneme.status}`"
    >
      {{ phoneme.value }}
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

  .phoneme-unfinished,
  .phoneme-finished-correct,
  .phoneme-finished-wrong {
    opacity: 0.4;

    padding-right: 12px;
    padding-bottom: 16px;
    font-size: 24px;
    font-weight: bold;
  }

  .phoneme-activate,
  .phoneme-activate-correct,
  .phoneme-activate-wrong {
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

    font-size: 36px;
    font-weight: bold;
  }
}
</style>
