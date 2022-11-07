<template>
    <el-container style='height:100%;'>
        <el-scrollbar ref="scroll" style="width:100vw; height: 100vh;">
            <el-header height="80px">
                <Heads />
            </el-header>
            <el-container>
                <el-aside :width="{ asideWidth } + 'px'">
                    <SideMenu />
                </el-aside>
                <el-main>
                    <CenterHead />
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive" />
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive" />
                </el-main>
            </el-container>
        </el-scrollbar>
    </el-container>
</template>

<script>
import Heads from '@/chaos/components/layout/Head';
import SideMenu from '@/chaos/components/layout/SideMenu';
import CenterHead from '@/chaos/components/layout/CenterHead';

export default {
    name: 'Main',
    components: { Heads, SideMenu, CenterHead },
    data() {
        return {
            asideWidth: 300
        };
    },
    created() {
        if (!this.$store.getters.user.username) {
            this.$router.push('/');
            return;
        }
        this.asideWidth = this.$store.getters.asideWidth;
    },
    mounted() {
        this.$EventBus.$on('scrollChange', msg => {
            this.$refs.scroll.wrap.scrollTop = msg;
        });
    }
};
</script>

<style lang="less" scoped>
* {
    margin: 0;
    padding: 0;
    border: 0;
}
/deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>
