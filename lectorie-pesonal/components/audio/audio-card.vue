//! Сброс прогресса прослушивания при повторном включении 
<template>
  <div :class="{ 'audio-no-bg': !item.image }" :style="{ 'background-image': `url(${item.image})` }" class="audio-card">
    <div class="flex audio-card__flex flex-align-center">
      <div @click="$emit('generatePlaylist', index)" class="audio-card__play flex flex-align-center flex-justify-center">
        <svg
          width="27"
          height="32"
          viewBox="0 0 27 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="play-button"
        >
          <path d="M25.9414 17.1887C26.8565 16.6604 26.8565 15.3396 25.9414 14.8113L2.26495 1.14173C1.34992 0.613431 0.206125 1.2738 0.206125 2.33039L0.206124 29.6696C0.206124 30.7262 1.34991 31.3866 2.26495 30.8583L25.9414 17.1887Z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 34 34" class="audio-card__progress">
          <circle cx="16" cy="16" r="15.9155" class="progress-bar__background" />
          <circle :stroke-dashoffset="percentComplete" cx="16" cy="16" r="15.9155" class="progress-bar__progress" />
        </svg>
      </div>
      <div @click="goList" class="audio-card__info">
        <div class="audio-card__info-top flex flex-align-center">
          <div v-if="item.type" class="audio-card__shield" :style="{ 'background-color': item.color }">
            {{ item.type }}
          </div>
          <div v-if="item.count" class="audio-card__count">
            {{ item.count }} лекций
          </div>
          <div v-if="!subscribe" class="audio-card__lock">
            <img src="/icons/lock-white.svg" alt="">
          </div>
        </div>
        <div class="audio-card__title">
          {{ item.title }}
        </div>
        <div v-if="item.time" class="audio-card__bottom">
          {{ audioDur }} {{ item.lector }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters({
      history: 'history/history',
      subscribe: 'user/subscribe'
    }),
    percentComplete() {
      const findProgress = this.history.find(item => item.title === this.item.title)
      if (findProgress) {
        const strokeDashOffsetValue = 100 - ((+findProgress.progress / 100) * 100)
        return strokeDashOffsetValue
      }
      return 100
    },
    audioDur() {
      const sec = this.item.time
      const h = Math.floor(sec / 60 / 60)
      const m = Math.floor(sec / 60) - (h * 60)
      const s = sec % 60
      const formatted = [
        h.toString().padStart(2, '0'),
        m.toString().padStart(2, '0'),
        s.toString().padStart(2, '0')
      ].join(':')
      return formatted
    }
  },
  methods: {
    goList() {
      if (this.item.type && this.subscribe) return this.$router.push('/audio/' + this.item.id)
      return this.$emit('generatePlaylist', this.index)
    }
  }
}
</script>

<style>

</style>
