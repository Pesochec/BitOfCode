import { users } from '../helpers/fbHelper'
import { auth, db } from '../plugins/firebase'
import Ticket from '../storeHelper/Ticket'

export const state = () => ({
  tikets: []
})

export const mutations = {
  SET_TIKET(state, payload) {
    state.tikets = payload
  },
  SET_RAITING(state, payload) {
    const index = state.tikets.findIndex(item => item.arhId === payload.arhId)
    state.tikets[index].raiting = payload.raiting
  },
  SET_VISITED(state, payload) {
    const index = state.tikets.findIndex(item => item === payload.item)
    state.tikets[index].visited = true
  }
}

export const actions = {
  async fetchTikets({ commit }) { //* Получение купленных билетов
    try {
      const { uid } = await auth.currentUser
      const tikets = (await users.doc(uid).collection('my_purchase').get()).docs
      const tiketItems = []
      if (tikets) {
        for (const tiket of tikets) {
          const tiketData = tiket.data()
          let rait
          const raitId = (await db.collection('arhiveSchedule').where('title', '==', tiketData.title).get()).docs //! Получение документа с рейтингом оффлайн лекции из архива 
          if (raitId[0].id) { // 
            const raitInfo = (await db.collection('arhiveSchedule').doc(raitId[0].id).collection('Rate').doc(uid).get()).data() //! Получение оценки текущего пользователя
            if (raitInfo) {
              rait = raitInfo.rate
            }
          }
          tiketItems.push(new Ticket(tiketData.lectionId || tiketData.id, tiketData.title, tiketData.count, tiketData.imageUrl, tiketData.category, tiketData.location, tiketData.isVisited, rait, tiketData.timestamp, tiketData.timesdate, tiketData.abstract, tiketData.presentation, raitId[0].id, tiket.id, tiketData.usageTiket))
        }
      }
      commit('SET_TIKET', tiketItems)
      return tiketItems
    } catch (e) {
      commit('SET_ERROR', e, {
        root: true
      })
      throw e
    }
  },
  async setRaiting({ commit }, { raiting, arhId }) { //* Оценка оффлайн лекции
    try {
      const { uid } = auth.currentUser
      await db.collection('arhiveSchedule').doc(arhId).collection('Rate').doc(uid).set({
        rate: raiting
      })
      commit('SET_RAITING', { raiting, arhId })
    } catch (e) {
      commit('SET_ERROR', e, {
        root: true
      })
      throw e
    }
  },
  async setVisited({ commit }, { item }) { // Установка посещения оффлайнлекции
    try {
      const { uid } = auth.currentUser
      console.log(item)
      await users.doc(uid).collection('my_purchase').doc(item.purhId).update({
        isVisited: true,
        usageTiket: Date.now()
      })
      await commit('SET_VISITED', { item })
    } catch (e) {
      commit('SET_ERROR', e, {
        root: true
      })
      throw e
    }
  }
}

export const getters = {
  tikets: state => state.tikets
}
