/**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require('fs');

const dirName = process.argv[2];

if (!dirName) {
    console.log('文件夹名称不能为空！');
    console.log('示例：npm run tep test');
    process.exit(0);
}

// 页面模版
const indexTep = `<template>
    <el-container>
        <el-header>
            <el-container>
                <PrimaryButton text="增加" :click="showAdd" />
                <SearchInput placeholder="请输入MU" :change="(value)=>handleChange(value,'mu')" />
                <SearchButton :click="search" />
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column prop="mu" label="编号" width="280" />
                <el-table-column prop="phone" label="电话" />
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <PlainButton text="编辑" :click="()=>showUpdate(scope.row.mu)" />
                        <PlainButton text="删除" :click="()=>doDelete(scope.row.mu)" />
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
            <el-dialog width="35%" title="添加" :visible.sync="showAddForm">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                    <el-form-item prop="phone" label="电话">
                        <el-input v-model="form.phone" placeholder="请输入电话" />
                    </el-form-item>
                    <el-form-item>
                        <PrimaryButton text="确定" :click="doAdd" />
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog width="35%" title="修改" :visible.sync="showUpdateForm">
                <el-form ref="updateForm" :rules="rules" :model="updateForm" label-width="100px">
                    <el-form-item prop="phone" label="电话">
                        <el-input v-model="updateForm.phone" placeholder="请输入电话" />
                    </el-form-item>
                    <el-form-item>
                        <PrimaryButton text="确定" :click="doUpdate" />
                    </el-form-item>
                </el-form>
            </el-dialog>
    </el-container>
</template>
<script>
import { pagemx, removemx, addmx, updatemx } from '@/chaos/functions/mixin/CRUD';

export default {
    name: 'ChaosUser',
    mixins: [pagemx, removemx, addmx, updatemx],
    data() {
        const rules = {
            phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
        };
        return {
            domain: 'chaosUser',
            rules
        };
    },
};
</script>
<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
`;
fs.mkdirSync(`./src/app/views/${dirName}`); // mkdir $1
process.chdir(`./src/app/views/${dirName}`); // cd $1

fs.writeFileSync('index.vue', indexTep);

console.log(`模版${dirName}已创建,请手动增加route`);

process.exit(0);
