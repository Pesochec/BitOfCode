<template>
  <div class="tiket-item__raiting">
    <div class="tiket-item__raiting-text">
			Спасибо за посещение! Будем рады Вашей оценке!
    </div>
    <div ref="raiting" class="raiting flex">
		<template v-for="item in 10">
			<button :key="item" @click="$emit('setRaiting', item)" @mouseleave="outRaiting(item)" @mouseover="hoveredRaiting(item)" class="raiting__item">
				<svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M10.1667 0.852697C10.3407 0.502593 10.8401 0.502593 11.0141 0.852697L13.9004 6.66194C13.9693 6.80058 14.1017 6.89675 14.2548 6.91942L20.6716 7.86934C21.0584 7.92659 21.2127 8.40157 20.9335 8.6752L16.3005 13.2154C16.1899 13.3238 16.1394 13.4794 16.1651 13.632L17.2446 20.0284C17.3097 20.4138 16.9056 20.7074 16.5591 20.5264L10.8094 17.5232C10.6722 17.4515 10.5086 17.4515 10.3714 17.5232L4.62169 20.5264C4.27518 20.7074 3.87113 20.4138 3.93618 20.0284L5.01567 13.632C5.04143 13.4794 4.99088 13.3238 4.88031 13.2154L0.247319 8.6752C-0.0318965 8.40157 0.122435 7.92659 0.509157 7.86934L6.926 6.91942C7.07915 6.89675 7.21151 6.80058 7.28039 6.66194L10.1667 0.852697Z" />
				</svg>
			</button>
		</template>
    </div>
	</div>
</template>

<script>
export default {
	props: {
		raiting: {
			type: Number,
			default: 0
		}
	},
	watch: {
		raiting: function (val) {
      this.changeRaiting()
    }
	},
	mounted() {
		this.changeRaiting()
	},
	methods: {
		changeRaiting() {
			if (!this.raiting) {
				for (let index = 0; index < this.item.raiting; index++) {
					this.$refs.raiting.querySelectorAll('.raiting__item')[index].classList.add('active')
				}
			}
		},
    outRaiting() {
      this.$refs.raiting.querySelectorAll('.raiting__item').forEach((element) => {
        element.classList.remove('hovered')
        element.classList.remove('nothovered')
      })
    },
    hoveredRaiting(index) {
      this.$refs.raiting.querySelectorAll('.raiting__item').forEach((element) => {
        element.classList.add('nothovered')
      })
      for (let indexIter = 0; indexIter < index + 1; indexIter++) {
        this.$refs.raiting.querySelectorAll('.raiting__item')[indexIter].classList.add('hovered')
        this.$refs.raiting.querySelectorAll('.raiting__item')[indexIter].classList.remove('nothovered')
      }
    }
	}
}
</script>

<style>

</style>