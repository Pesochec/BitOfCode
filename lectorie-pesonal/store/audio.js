import { autioLectures } from '../helpers/fbHelper'
import AudioCollection from '../storeHelper/AudioCollection'
import AudioItem from '../storeHelper/AudioItem'

export const state = () => ({
  audio: null
})

export const mutations = {
  SET_AUDIO(state, payload) {
    state.audio = payload
  }
}

export const actions = {
  async fetchAudio({ commit }) { //* Получение списка аудиолекций
    try {
      const audios = (await autioLectures.get()).docs
      const audioInfo = []
      for (const audio of audios) {
        const audioSnap = audio.data()
        //* Материалы аудиолекций
        const audiosCollection = []
        const audioDoc = (await autioLectures.doc(audio.id).collection('collection').orderBy('position').get()).docs 
        for (const audioItem of audioDoc) {
          audiosCollection.push(new AudioItem(audioItem.id, audioItem.data().name, audioItem.data().time, audioItem.data().url))
        }
        //* Материалы аудиолекций
        audioInfo.push(new AudioCollection(audio.id, audioSnap.categori_name, audioSnap.count, audioSnap.category, audioSnap.image, audiosCollection))
      }
      commit('SET_AUDIO', audioInfo)
      return audioInfo
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

export const getters = {
  audio: state => state.audio,
  audioByID: state => id => state.audio ? state.audio.find(item => item.id === id) : null
}
