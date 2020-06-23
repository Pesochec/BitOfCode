<template>
  <div class="container video">
    <div class="flex flex-justify-between title=block">
      <h1 class="block-title">
        Аудиолекции
      </h1>
    </div>
    <div v-if="audio" class="page-content payments__content">
      <div class="flex flex-wrap row">
        <template v-for="(item, i) in audio">
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
  async asyncData({ store }) {
    try {
      if (!store.getters['audio/audio']) {
        await store.dispatch('audio/fetchAudio')
      }
    } catch (e) {
      console.log(e)
    }
    return {
      audio: store.getters['audio/audio']
    }
  }
}
</script>

<style>

</style>
