<template>
    <el-container>
        <el-header>
            <el-container>
                <PrimaryButton text="体验课设置" :click="showAdd" />
                <PrimaryButton text="新建课程" :click="showAdd" />
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column prop="mu" label="编号" width="80" />
                <el-table-column prop="title" label="标题" />
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <PlainButton text="编辑" :click="()=>showUpdate(scope.row.mu)" />
                        <PlainButton text="删除" :click="()=>doDelete(scope.row.mu)" />
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
            <SetTingForm :setTingVisible="showAddForm" @close="showAddForm = false"></SetTingForm>
            

    </el-container>
</template>
<script>
import { page, remove, create, update } from '@/chaos/functions/mixin/crud';
import SetTingForm from './setTingForm.vue';

export default {
    name: 'experienceClass',
    mixins: [page, remove, create, update],
    data() {
        const rules = {
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' },
            ]
        };
        return {
            domain: 'experienceClass',
            rules,
            showAddForm: false,
        };
    },
    created() {
        // this.search();
    },
    components: {
        SetTingForm,
    }
};
</script>
<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
