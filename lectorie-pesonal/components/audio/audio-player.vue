//? Таймер отключения аудио (sleep)
//! Сброс прогресса прослушивания
<template>
  <div class="audio-player">
    <audio ref="audio" :src="activeAudio.url" @ended="nextAudio" @loadedmetadata="onLoaded()" @timeupdate="timeUpdate()" />
    <div ref="progress" @click="changeTime" class="audio-player__progress">
      <div class="audio-player__times">
        <div class="audio-player__times-current">
          {{ transformTime(audio.time) }}
        </div>
        <div class="audio-player__times-all">
          {{ transformTime(audio.currentTime) }}
        </div>
      </div>
      <div class="audio-player__progress-bar">
        <div :style="{ 'width': `${audio.progress}%` }" class="audio-player__progress-complete" />
      </div>
    </div>
    <div class="audio-player__bottom">
      <div class="flex flex-align-center audio-player__container">
        <div class="audio-player__controls flex flex-align-center">
          <button @click="prevAudio" :class="{ 'audio-player__button-disabled': playIndex === 0 }" class="audio-player__button audio-player__button--small">
            <img src="/icons/audio/prev.svg" alt="">
          </button>
          <button @click="playAndPause" class="audio-player__button">
            <img v-if="!audio.play" src="/icons/audio/play.svg" alt="">
            <img v-else src="/icons/audio/pause.svg" alt="">
          </button>
          <button @click="nextAudio" :class="{ 'audio-player__button-disabled': playIndex === (playlist.length - 1)}" class="audio-player__button audio-player__button--small">
            <img src="/icons/audio/next.svg" alt="">
          </button>
        </div>
        <div class="audio-player__info flex flex-align-center">
          <img :src="activeAudio.image" alt="">
          <div class="audio-player__info-text">
            <div class="audio-player__info-title">
              {{ activeAudio.title }}
            </div>
            <div v-if="activeAudio.lector" class="audio-player__info-lector">
              {{ activeAudio.lector }}
            </div>
          </div>
        </div>
        <div class="audio-player__second-control flex">
          <div class="lection-filter__item">
            <button
              @click="selectedFilter('speed')"
              :class="{ 'lection-filter__trigger--active': selecteble.speed }"
              class="lection-filter__trigger flex flex-align-center"
            >
              <div class="lection-filter__title">
                <img src="/icons/audio/speed.svg" alt="">
              </div>
            </button>
            <div v-if="selecteble.speed" class="lection-filter__list">
              <label
                v-for="(item, i) in speed"
                :key="i"
                class="lection-filter__checkbox form-checkbox form-label form-checkbox--base flex flex-align-center"
              >
                <input
                  v-model="selectSpeed"
                  :value="item.value"
                  name="speed"
                  type="radio"
                >
                <span class="form-checkbox__button" />
                <span class="form-label__subtitle form-radio__subtitle">
                  {{ item.title }}
                </span>
              </label>
            </div>
          </div>
          <div class="audio-player__volume-control flex flex-align-center">
            <button @click="mute" :class="{ 'audio-player__mute--true': audio.volume === 0 }" class="audio-player__mute">
              <img src="/icons/audio/volume.svg" alt="">
            </button>
            <div ref="volume" @mousedown="volumeMouseDown" class="audio-player__volume">
              <div :style="{ 'width': `${audio.volume}%` }" class="audio-player__volume-slider" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      selecteble: {
        speed: false,
        sleep: false
      },
      selectSpeed: 1,
      speed: [
        {
          title: '0.5x',
          value: 0.5
        },
        {
          title: '0.75x',
          value: 0.75
        },
        {
          title: 'Normal',
          value: 1
        },
        {
          title: '1.25x',
          value: 1.25
        },
        {
          title: '1.5x',
          value: 1.5
        },
        {
          title: '2x',
          value: 2
        }
      ],
      audio: {
        play: false,
        time: 1,
        currentTime: 0,
        progress: 0,
        speed: 100,
        volume: 100,
        volumeDrag: false,
        beforeValue: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      playlist: 'audioplayer/playlist',
      activeAudio: 'audioplayer/activeAudio',
      playIndex: 'audioplayer/playIndex'
    }),
    transformTime(time) {
      const sec = time
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
  watch: {
    activeAudio: function (val) {
      this.audio = {
        play: true,
        time: 1,
        currentTime: 0,
        progress: 0,
        speed: 100,
        volume: 100,
        volumeDrag: false,
        beforeValue: 0
      }
      this.$refs.audio.autoplay = true
    },
    selectSpeed: function (val) {
      this.$refs.audio.playbackRate = this.selectSpeed
    },
    'audio.currentTime': function (val) {
      this.audio.progress = (Math.floor(this.audio.currentTime) / (Math.floor(this.audio.time) / 100)).toFixed(2)
    }
  },
  mounted() {
    document.addEventListener('mouseup', () => {
      this.audio.volumeDrag = false
    })
    document.addEventListener('mousemove', (e) => {
      if (this.audio.volumeDrag) {
        this.changeVolume(e)
      }
    })
  },
  methods: {
    ...mapMutations({
      nextAudio: 'audioplayer/NEXT_AUDIO',
      prevAudio: 'audioplayer/PREV_AUDIO'
    }),
    volumeMouseDown(e) {
      this.audio.volumeDrag = true
      this.changeVolume(e)
    },
    changeTime(e) {
      const mouseX = Math.floor(e.pageX - this.$refs.progress.offsetLeft)
      const progress = mouseX / (this.$refs.progress.offsetWidth / 100)
      this.$refs.audio.currentTime = this.audio.time * (progress / 100)
    },
    mute() {
      if (this.audio.volume !== 0) {
        this.audio.beforeVolume = this.audio.volume
        this.$refs.audio.volume = 0
        this.audio.volume = 0
      } else {
        this.$refs.audio.volume = this.audio.beforeVolume / 100
        this.audio.volume = this.audio.beforeVolume
      }
    },
    changeVolume(e) {
      const mouseX = Math.floor(e.pageX - this.$refs.volume.offsetLeft)
      const progress = mouseX / (this.$refs.volume.offsetWidth / 100)
      if ((progress / 100) > 1) return false
      if ((progress / 100) < 0) return false
      this.$refs.audio.volume = progress / 100
      this.audio.volume = progress
    },
    timeUpdate() {
      this.audio.currentTime = Math.floor(this.$refs.audio.currentTime)
      this.$store.commit('history/UPDATE_HISTORY', {
        title: this.activeAudio.title,
        field: 'currentTime',
        value: this.audio.currentTime
      })
      this.$store.commit('history/UPDATE_HISTORY', {
        title: this.activeAudio.title,
        field: 'progress',
        value: this.audio.progress
      })
    },
    onLoaded() {
      this.audio.time = Math.floor(this.$refs.audio.duration)
      this.audio.currentTime = Math.floor(this.$refs.audio.currentTime)
    },
    playAndPause() {
      if (this.audio.play) {
        this.$refs.audio.pause()
        this.audio.play = false
      } else {
        this.$refs.audio.play()
        this.audio.play = true
      }
    },
    selectedFilter(target) {
      for (const key in this.selecteble) {
        if (key === target) {
          this.selecteble[target] = !this.selecteble[target]
        } else {
          this.selecteble[key] = false
        }
      }
    }
  }
}
</script>

<style>

</style>
