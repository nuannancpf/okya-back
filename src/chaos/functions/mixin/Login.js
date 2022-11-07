import {
    Message
} from 'element-ui';
import {
    appInfo
} from '@/app/config';
import {
    query
} from '@/chaos/functions/common/Data';

export const login = {
    data() {
        return {
            username: '123456',
            password: '123456',
            headTitle: appInfo().headTitle,
        };
    },
    methods: {
        async login() {
            if (this.username && this.password) {
                // const res = await query('login', {
                //     username: this.username,
                //     password: this.password,
                //     platformMu: appInfo().platformMu,
                // });
                const res = {
                    token: '123456789',
                    mu: '大灰狼',
                    username: '大灰狼',
                    indexLink: 'okya-user',
                    roleInfo: 'dev',
                    roleName: 'dev',
                    menus: [{
                        path: '/okya-user',
                        name: 'okya-user',
                        meta: {
                            title: '用户管理',
                        },
                        component: () => import('@/app/views/okya/okyaUser/index'),
                    },
                    {
                        path: '/view-user-detail',
                        name: 'view-user-detail',
                        meta: {
                            title: '用户信息',
                        },
                        component: () => import('@/app/views/okya/okyaUser/viewUserDetail/index'),
                    },
                    {
                        path: '/activity-manage',
                        name: 'activity-manage',
                        meta: {
                            title: '推荐活动位管理',
                        },
                        component: () => import('@/app/views/okya/actManage/index'),
                    },
                    {
                        path: '/course-manage',
                        name: 'course-manage',
                        meta: {
                            title: '首页课程管理',
                        },
                        component: () => import('@/app/views/okya/courseManage/index'),
                    },
                    {
                        path: '/clock-data',
                        name: 'clock-data',
                        meta: {
                            title: '打卡数据',
                        },
                        component: () => import('@/app/views/okya/clockData/index'),
                    },
                    {
                        path: '/cognitivecard',
                        name: 'cognitivecard',
                        meta: {
                            title: '认知卡管理',
                        },
                        component: () => import('@/app/views/okya/cogniTiveCard/index'),
                    },
                    {
                        path: '/new-cognitive',
                        name: 'new-cognitive',
                        meta: {
                            title: '认知卡管理',
                        },
                        component: () => import('@/app/views/okya/cogniTiveCard/pacKage'),
                    },
                    {
                        path: '/order-sheet',
                        name: 'order-sheet',
                        meta: {
                            title: '订单表',
                        },
                        component: () => import('@/app/views/okya/orderSheet/index'),
                    },
                    {
                        path: '/have-goods',
                        name: 'have-goods',
                        meta: {
                            title: '有赞商品管理',
                        },
                        component: () => import('@/app/views/okya/haveGoods/index'),
                    },
                    {
                        path: '/createOreditor',
                        name: 'createOreditor',
                        meta: {
                            title: '创建',
                        },
                        component: () => import('@/app/views/okya/haveGoods/createOreditor'),
                    },
                    {
                        path: '/msgAlert',
                        name: 'msgAlert',
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
                        component: () => import('@/app/views/okya/msgPhone/index'),
                    },
                    {
                        path: '/special-class-manage',
                        name: 'special-class-manage',
                        meta: {
                            title: '专项课管理',
                        },
                        component: () => import('@/app/views/okya/specialClassManage/index'),
                    },
                    {
                        path: '/youzanOrderRecord',
                        name: 'youzanOrderRecord',
                        meta: {
                            title: '有赞订单',
                        },
                        component: () => import('@/app/views/okya/youzanOrderRecord/index'),
                    },
                    ]
                };
                await this.$store.dispatch('admin/setUserinfo', res);
                await this.$store.dispatch('admin/setMenus', res.menus);
                await this.$router.push('okya-user');
            } else {
                Message({
                    type: 'warning',
                    message: '请输入用户名和密码'
                });
            }
        },
    },
};
