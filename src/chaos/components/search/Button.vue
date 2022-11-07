<template>
    <el-button type="primary" icon="el-icon-search" @click="click">搜索</el-button>
</template>

<script>
export default {
    name: 'SearchButton',
    data() {
        return {};
    },
    props: {
        click: Function
    }
};
</script>
<style scoped>
.el-button {
    margin: 0 10px;
}
</style>