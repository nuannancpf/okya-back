const state = {
    data: {},
};

const mutations = {
    SetData(state, { ...rest }) {
        state.data = { ...state.data, ...rest };
    },
};

const actions = {
    setData({ commit }, data) {
        commit('SetData', data);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
