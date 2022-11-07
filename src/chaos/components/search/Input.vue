<template>
    <el-input v-model.trim="value" prefix-icon="el-icon-search" clearable :placeholder="placeholder" @keyenter="change" @change="change"></el-input>
</template>
<script>
export default {
    name: 'SearchInput',
    data() {
        return {
            value: ''
        };
    },
    props: {
        placeholder: {
            required: false,
            default: ''
        },
        change: Function
    }
};
</script>

<style lang="less" scoped>
.el-input {
    width: 280px;
    margin: 0 10px;
}
</style>
