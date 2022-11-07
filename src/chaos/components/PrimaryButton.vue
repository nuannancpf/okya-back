<template>
    <el-button type="primary" @click="click">{{ text }}</el-button>
</template>

<script>
export default {
    name: 'PrimaryButton',
    data() {
        return {};
    },
    props: {
        click: Function,
        text: String
    }
};
</script>
