import { mapGetters, mapMutations } from 'vuex'
export default {
	computed: {
		...mapGetters({
			historyBuyTitle: 'history/historyBuyTitle',
			subscribe: 'user/subscribe'
		})
	},
	methods: {
		...mapMutations({
			setHistory: "history/SET_HISTORY",
			setPlayList: "audioplayer/SET_PLAYLIST"
		}),
		generatePlaylist(index) {
			if (this.subscribe) {
				const items = this.audio[index].audiosCollection.map(item => {
					const findHistory = this.historyBuyTitle(item.title)
					return {
						...item,
						active: false,
						currentTime: findHistory ? findHistory.currentTime : 0.1,
						progress: findHistory ? findHistory.progress : 0.1,
						type: 'AudioLectures'
					}
				})
				items[0].active = true
				this.setHistory(items)
				this.setPlayList({
					items,
					index
				})
				return items
			}
			return false
		}
	}
}