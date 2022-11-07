import Vue from 'vue';
import Vuex from 'vuex';
import VueXAlong from 'vuex-along';
import getters from './getters';
import app from './modules/app';
import admin from './modules/admin';
import global from './modules/global';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        admin,
        global,
    },
    getters,
    plugins: [VueXAlong()],
});

export default store;
