<template>
    <el-container>
        <el-main>
            <el-menu :default-active="defaultActive" :collapse="isCollapse" router class="side-menu" background-color="#fff" text-color="#545c64" active-text-color="#438eb9">
                <!-- <el-submenu v-for="(menu,i) in menus" :key=i :index="i+''">
                    <template slot="title">
                        <i :class="menu.icon" />
                        <span>{{menu.meta.title}}</span>
                    </template>
                    <template></template>
                    <el-menu-item v-for="(item,j) in menu.submenus" :key="i+'-'+j" :index=item.link>
                        <template slot="title">
                            <span>{{item.meta.title}}</span>
                            <DataBadge v-if="item.link" :link="item.link" />
                        </template>
                    </el-menu-item>
                </el-submenu> -->
                <el-menu-item v-for="item in menus" :key="item.path" :index=item.path>
                        <template slot="title">
                            <span>{{item.meta.title}}</span>
                            <DataBadge v-if="item.path" :link="item.path" />
                        </template>
                    </el-menu-item>
            </el-menu>
        </el-main>
    </el-container>
</template>
<script>
import DataBadge from '@/chaos/components/DataBadge';

export default {
    name: 'SideMenu',
    components: { DataBadge },
    data() {
        return {
            asideWidth: 300,
            menus: [],
            defaultActive: '/'
        };
    },
    computed: {
        isCollapse() {
            return this.$store.getters.isCollapse;
        }
    },
    created() {
        this.menus = this.$store.getters.menus;
        console.log(this.menus, '这是');
        this.defaultActive = this.$route.path;
    },
    watch: {
        $route() {
            this.defaultActive = this.$route.path;
        }
    }
};
</script>

<style lang="less" scoped>
.el-header {
    padding: 0;
}

.el-main {
    padding: 0;
}

.side-menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>
