<template>
    <el-container>
        <el-header>
            <el-container class="header-back">
                <div class="el-icon-arrow-left" @click="returnBack"></div>
                <span class="userinfo">用户信息</span>
            </el-container>
        </el-header>
        <el-main>
            <el-tabs type="border-card" style="width: 100%" v-model="tabNmae" @tab-click="handleClick">
                <el-tab-pane label="基础信息" name="1">
                    <Basic :basicForm="basicForm" :userMu="userMu"></Basic>
                </el-tab-pane>
                <el-tab-pane label="订单" name="2">
                    <Order ref="orderRef" :mu="userMu"></Order>
                </el-tab-pane>
                <el-tab-pane label="课程" name="3">
                    <Course ref="courseRef" :mu="userMu"></Course>
                </el-tab-pane>
                <el-tab-pane label="操作日志" name="4">
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>
<script>
import { submit } from '@/chaos/functions/common/Data';
import {
    removemx,
    addmx,
    updatemx
} from '@/chaos/functions/mixin/CRUD';
import Basic from './basicInfo';
import Order from './orderInfo';
import Course from './courseInfo';

export default {
    props: {},
    mixins: [ removemx, addmx, updatemx],
    data() {
        return {
            domain: 'okya_user',
            tabNmae: this.$store.state.global.data.userDetailNmae,
            userMu: this.$route.params.mu,
            basicForm: {}
        };
    },
    mounted() {
        this.detailInform();
        console.log(this.$store.state.global.data.userDetailNmae, '987');
    },
    methods: {
        async detailInform() {
            let res = await submit('okya_user/detail', {
                mu: this.$store.state.global.data.userDetailMu
            });
            this.basicForm = res;
        },
        handleClick(tab, event) {
            this.tabNmae = tab.name;
            console.log(this.tabNmae, '用户信息', event);
            switch (this.tabNmae) {
                case '1':
                    this.detailInform();
                    break;
                case '2':
                    this.$refs.orderRef.orderInform();
                    break;
                case '3':
                    console.log(123);
                    this.$refs.courseRef.courseTableList();
                    break;
                default:
                    break;
            }
            this.$store.dispatch('global/setData', {userDetailNmae: this.tabNmae});
        },
        returnBack() {
            this.$router.push({
                name: 'okya-user'
            });
        }
    },
    components: {
        Basic,
        Order,
        Course
    }
};
</script>
<style lang="less" scoped>
.header-back {
    .el-icon-arrow-left {
        font-size: 28px;
        display: flex;
        line-height: 55px;
        cursor: pointer;
    }
    .userinfo {
        font-weight: 400;
        color: #606266;
        cursor: text;
        font-size: 22px;
        display: flex; /*Flex布局*/
        display: -webkit-flex; /* Safari */
        align-items: center; /*指定垂直居中*/
    }
}
</style>
