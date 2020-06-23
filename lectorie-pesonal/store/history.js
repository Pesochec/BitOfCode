export const state = () => ({
	history: []
})

export const mutations = {
	SET_HISTORY(state, payload) {
		payload.forEach((element) => {
			const find = state.history.find(item => item.title === element.title)
			if (!find) {
				state.history.push(element)
			}
		})
		localStorage.setItem('history', JSON.stringify(payload))
	},
	ADD_HISTORY(state, payload) {
		const find = state.history.find(item => item.title === payload.title)
		if (!find) {
			state.history.push(payload)
			localStorage.setItem('history', JSON.stringify(state.history))
		}
	},
	UPDATE_HISTORY(state, {
		title,
		field,
		value
	}) {
		const findIndex = state.history.findIndex(item => item.title === title)
		if (findIndex !== -1) {
			state.history[findIndex][field] = value
			localStorage.setItem('history', JSON.stringify(state.history))
		}
	}
}
//? Синхронизаировать с мобильными приложениями
export const actions = {}

export const getters = {
	history: state => state.history,
	historyBuyCatalog: state => catalog => state.history.find(item => item.catalog === catalog),
	historyBuyTitle: state => title => state.history.find(item => item.title === title)
}