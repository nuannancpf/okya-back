<template>
    <el-button plain @click="click">{{ text }}</el-button>
</template>

<script>
export default {
    name: 'PlainButton',
    data() {
        return {};
    },
    props: {
        click: Function,
        text: String
    }
};
</script>

<style lang="less" scoped>
.el-button {
    margin: 0 0 6px 0;
}
</style>
