<template>
  <div class="container video">
    <div class="flex flex-justify-between title=block">
      <div>
        <h2 class="page__toptitle">
          {{ audio.title }}
        </h2>
        <h1 class="block-title">
          Аудиолекции
        </h1>
      </div>
      <div>
        <button @click="$router.go(-1)" class="video__button button button--fill button--main">
          Назад
        </button>
      </div>
    </div>
    <div v-if="audio.audiosCollection.length" class="page-content payments__content">
      <div class="flex flex-wrap row">
        <template v-for="(item, i) in audio.audiosCollection">
          <audio-item :index="i" :key="item.id" :item="item" @generatePlaylist="generatePlaylist" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AudioItem from '../../components/audio/audio-card'
import playlistMixin from '../../components/mixins/audio'
export default {
  components: {
    AudioItem
  },
  mixins: [playlistMixin],
  async asyncData({ store, params }) {
    try {
      if (!store.getters['audio/audioByID'](params.id)) {
        await store.dispatch('audio/fetchAudio')
      }
    } catch (e) {
      console.log(e)
    }
    return {
      audio: store.getters['audio/audioByID'](params.id)
    }
  },
  async validate({ store, params }) {
    const find = store.getters['audio/audioByID'](params.id)
    if (find) return true
    try {
      await store.dispatch('audio/fetchAudio')
      const finded = store.getters['audio/audioByID'](params.id)
      if (finded) return true
      return false
    } catch (e) {
      console.log(e)
      return false
    }
  }
}
</script>

<style>

</style>
