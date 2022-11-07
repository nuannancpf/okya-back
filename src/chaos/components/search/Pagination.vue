<template>
    <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100, 500]" :current-page="currentPage" :page-size="limit" :total="total" />
    </div>
</template>

<script>
export default {
    name: 'SearchPagination',
    data() {
        return {};
    },
    props: {
        total: {
            required: false,
            default: 0
        },
        limit: {
            required: false,
            default: 20
        },
        currentPage: {
            required: false,
            default: 1
        }
    },
    methods: {
        handleCurrentChange(value) {
            this.$emit('handleCurrentChange', value);
            this.$EventBus.$emit('scrollChange',0);
        },
        handleSizeChange(value) {
            this.currentPage = 1000;
            this.$emit('handleSizeChange', value);
        }
    }
};
</script>

<style lang="less" scoped>
.pagination {
    margin: auto 0px;
    text-align: right;
}
</style>
