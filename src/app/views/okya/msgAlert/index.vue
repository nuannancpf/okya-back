<template>
    <el-container>
        <el-header>
            <el-container>
                <SearchInput placeholder="请输入编号" :change="(value)=>handleChange(value,'mu')" />
                <SearchButton :click="search" />
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column prop="mu" label="编号" width="80" />
                <el-table-column prop="courseId" label="课程ID" />
                <el-table-column prop="courseTitle" label="课程名称" />
                <el-table-column prop="startTime" label="开始时间" />
                <el-table-column prop="alertIncrement" label="增量" />
                <el-table-column prop="alertCount" label="累计增量" />
                <el-table-column prop="lastCount" label="最近总量" />
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <PlainButton text="编辑" :click="()=>showUpdate(scope.row.mu)" />
                        <PlainButton text="删除" :click="()=>doDelete(scope.row.mu)" />
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
        <el-footer>
            <el-dialog width="35%" title="修改" :visible.sync="showUpdateForm">
                <el-form ref="updateForm" :rules="rules" :model="updateForm" label-width="100px">
                    <el-form-item prop="alertIncrement" label="增量">
                        <el-input v-model.number="updateForm.alertIncrement" placeholder="请输入增量" />
                    </el-form-item>
                    <el-form-item>
                        <PrimaryButton text="确定" :click="doUpdate" />
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-footer>
    </el-container>
</template>
<script>
import { pagemx, removemx, updatemx } from '@/chaos/functions/mixin/CRUD';

export default {
    name: 'okyaMsgAlert',
    mixins: [pagemx, removemx, updatemx],
    data() {
        const rules = {
            alertIncrement: [
                { required: true, message: '请输入增量', trigger: 'blur' }
            ]
        };
        return { domain: 'okyaMsgAlert', rules };
    }
};
</script>
<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
