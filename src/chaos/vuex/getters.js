const getters = {
    user: (state) => state.admin.user,
    menus: (state) => state.admin.menus,
    lastPost: (state) => state.app.lastPost,
    baseUrl: (state) => state.app.baseUrl,
    isCollapse: (state) => state.app.isCollapse,
    asideWidth: (state) => state.app.asideWidth,
    data: (state) => state.global.data,
};

export default getters;
