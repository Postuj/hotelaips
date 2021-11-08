import axios from 'axios';

const state = {
    cities: [],
}

const getters = {
    getCities: state => state.cities,
}

const actions = {
    async fetchCities({ commit }) {
        try {
            let res = await axios.get('http://localhost:3000/hotels/allcities')
            let cities = []
            res.data.forEach((city, i) => cities.push({ name: city, id: i + 1 }))
            commit('SET_CITIES', cities)
        } catch (error) {
            console.error(error)
        }
    },
}

const mutations = {
    SET_CITIES: (state, data) => state.cities = data,
}

export default {
    state,
    getters,
    actions,
    mutations,
}