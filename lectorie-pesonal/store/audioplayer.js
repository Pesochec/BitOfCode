export const state = () => ({
	playlist: [],
	playIndex: 0
})

export const mutations = {
	SET_PLAYLIST(state, {
		items,
		index
	}) {
		state.playIndex = index
		state.playlist = items
		localStorage.setItem('lastPlaylist', JSON.stringify({
			items: state.playlist,
			index: state.playIndex
		}))
	},
	NEXT_AUDIO(state) {
		const index = state.playlist.findIndex(item => item.active)
		if (index !== (state.playlist.length - 1)) {
			state.playlist[index].active = false
			state.playlist[index + 1].active = true
			state.playIndex = index + 1
			localStorage.setItem('lastPlaylist', JSON.stringify({
				items: state.playlist,
				index: state.playIndex
			}))
		}
	},
	PREV_AUDIO(state) {
		const index = state.playlist.findIndex(item => item.active)
		if (index !== 0) {
			state.playlist[index].active = false
			state.playlist[index - 1].active = true
			state.playIndex = index - 1
			localStorage.setItem('lastPlaylist', JSON.stringify({
				items: state.playlist,
				index: state.playIndex
			}))
		}
	}
}
//? Синхронизировать с мобильными приложением
export const actions = {
}

export const getters = {
	playlist: state => state.playlist,
	playIndex: state => state.playIndex,
	activeAudio: state => state.playlist.find(item => item.active)
}