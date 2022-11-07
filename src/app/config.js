export function routers() {
    return [
        {
            path: '/okya-user',
            name: 'okya-user',
            hidden: true,
            meta: {
                title: '用户管理',
            },
            component: () => import('@/app/views/okya/okyaUser/index'),
        },
        {
            path: '/view-user-detail',
            name: 'view-user-detail',
            hidden: true,
            meta: {
                title: '用户信息',
            },
            component: () => import('@/app/views/okya/okyaUser/viewUserDetail/index'),
        },
        {
            path: '/activity-manage',
            name: 'activity-manage',
            hidden: true,
            meta: {
                title: '推荐活动位管理',
            },
            component: () => import('@/app/views/okya/actManage/index'),
        },
        {
            path: '/course-manage',
            hidden: true,
            name: 'course-manage',
            meta: {
                title: '首页课程管理',
            },
            component: () => import('@/app/views/okya/courseManage/index'),
        },
        {
            path: '/clock-data',
            name: 'clock-data', 
            hidden: true,
            meta: {
                title: '打卡数据',
            },
            component: () => import('@/app/views/okya/clockData/index'),
        },
        {
            path: '/cognitivecard',
            name: 'cognitivecard',
            hidden: true,
            meta: {
                title: '认知卡管理',
            },
            component: () => import('@/app/views/okya/cogniTiveCard/index'),
        },

        {
            path: '/order-sheet',
            name: 'order-sheet',
            hidden: true,
            meta: {
                title: '订单表',
            },
            component: () => import('@/app/views/okya/orderSheet/index'),
        },
        {
            path: '/have-goods',
            name: 'have-goods',
            hidden: true,
            meta: {
                title: '有赞商品管理',
            },
            component: () => import('@/app/views/okya/haveGoods/index'),
        },
        // {
        //     path: '/createOreditor',
        //     name: 'createOreditor',
        //     meta: {
        //         title: '创建',
        //     },
        //     component: () => import('@/app/views/okya/haveGoods/createOreditor'),
        // },
        {
            path: '/msgAlert',
            name: 'msgAlert',
            hidden: true,
            meta: {
                title: '预警短信',
            },
            component: () => import('@/app/views/okya/msgAlert/index'),
        },
        {
            path: '/msgPhone',
            name: 'msgPhone',
            meta: {
                title: '预警电话',
            },
            hidden: true,
            component: () => import('@/app/views/okya/msgPhone/index'),
        },
        {
            path: '/special-class-manage',
            name: 'special-class-manage',
            hidden: true,
            meta: {
                title: '专项课管理',
            },
            component: () => import('@/app/views/okya/specialClassManage/index'),
        },
        {
            path: '/youzanOrderRecord',
            name: 'youzanOrderRecord',
            hidden: true,
            meta: {
                title: '有赞订单',
            },
            component: () => import('@/app/views/okya/youzanOrderRecord/index'),
        },
    ];
}

export function baseUrl() {
    let baseUrl = '';
    switch (process.env.NODE_ENV) {
        case 'development':
            baseUrl = '';
            break;
        case 'production':
            baseUrl = '/manage-api';
            break;
    }
    return baseUrl;
}

export function appInfo() {
    return {
        headTitle: '七田真启蒙',
        platformMu: '2',
    };
}

export function SideMenuData() {
    let m = new Map();
    return m;
}

export function configs() {
    let m = new Map();
    m.set('fileHost', 'https://file.okyakid.com/');
    return m;
}
