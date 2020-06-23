<template>
  <div class="container tickets">
    <div class="flex flex-justify-between title=block">
      <h1 class="block-title">
        Мои билеты
      </h1>
      <div class="flex flex-align-center">
        <nuxt-link to="/lectures" class="page__button button button--fill button--main">
          РАСПИСАНИЕ ЖИВЫХ ЛЕКЦИЙ
        </nuxt-link>
      </div>
    </div>
    <div v-if="tikets.length" class="page-content tickets__content">
      <ticket-item v-for="(bilet, i) in tikets" :key="i" :item="bilet" />
    </div>
  </div>
</template>

<script>
import TicketItem from '../components/ticket/ticket-item'
export default {
  components: {
    TicketItem
  },
  async asyncData({ store }) {
    try {
      if (!store.getters['tikets/tikets'].length) {
        await store.dispatch('tikets/fetchTikets')
      }
    } catch (e) {
      console.log(e)
    }
    return {
      tikets: store.getters['tikets/tikets']
    }
  }
}
</script>

<style>

</style>
