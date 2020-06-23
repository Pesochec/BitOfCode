<template>
  <div class="tiket-item">
    <div class="flex flex-align-center flex-justify-between">
      <nuxt-link :to="`/lectures/${item.id}`" class="tiket-item__image">
        <img :src="item.image" alt="">
        <div class="tiket-item__count flex flex-aling-center flex-justify-center">
          <div>
            {{ item.count }}
          </div>
        </div>
      </nuxt-link>
      <nuxt-link :to="`/lectures/${item.id}`" class="tiket-item__title">
        {{ item.title }}
      </nuxt-link>
      <div class="tiket-item__date-wrap">
        <nuxt-link v-if="!item.visited && !(item.timestamp > Date.now()) && !Boolean(item.raiting)" :to="`/lectures/${item.id}`" class="tiket-item__date-container">
          <div class="tiket-item__date">
            {{ item.timesdate }}
          </div>
          <div class="tiket-item__place">
            {{ item.location }}
          </div>
        </nuxt-link>
				<rait-component @setRaiting="setRaiting" v-else-if="!Boolean(item.raiting) && item.visited" :raiting="item.raiting"/>
        <div v-else>
          <nuxt-link :to="`/lectures/${item.id}`" class="tiket-item__date-container">
            <div class="tiket-item__date">
              {{ item.timesdate }}
            </div>
            <div class="tiket-item__place">
              {{ item.location }}
            </div>
          </nuxt-link>
        </div>
      </div>
      <div v-if="!item.visited" class="buttons">
        <button @click="visited" class="tiket-item__button button button--fill button--main">
          ИСПОЛЬЗОВАТЬ БИЛЕТ
        </button>
      </div>
      <div v-if="item.visited" class="buttons flex">
        <span>
          Использован <br>
          {{ item.timestampStart }}
        </span>
        <a v-if="item.presentation" :href="item.presentation" class="tiket-item__icon">
          <img src="/icons/presentation.svg" alt="">
        </a>
        <a v-if="item.abstract" :href="item.abstract" class="tiket-item__icon">
          <img src="/icons/abstract.svg" alt="">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import RaitComponent from '../other/rate'
export default {
  name: 'TiketItem',
  components: {
      RaitComponent
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
		...mapActions({
			setRaitingAction: 'tikets/setRaiting',
			setVisitedAction: 'tikets/setVisited',
		}),
    setRaiting(raiting) {
      this.setRaitingAction({
        raiting,
        arhId: this.item.arhId
      })
      this.item.raiting = raiting
    },
    setVisited() {
      this.setVisitedAction({
        item: this.item
      })
    }
  }
}
</script>

<style>

</style>
