import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: '#111111',
                secondary: '#A60000',
                accent: '#8c9eff',
                error: '#b71c1c',
            },
        },
    },
});
