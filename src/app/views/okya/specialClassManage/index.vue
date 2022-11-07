<template>
    <el-container>
        <el-header>
            <el-container>
                <PrimaryButton text="增加" :click="showAdd" />
                <SearchInput placeholder="请输入MU" :change="(value)=>handleChange(value,'mu')" />
                <SearchButton :click="search" />
            </el-container>
        </el-header>
        <el-main>
            <el-button @click="showTagsModal">选择标签</el-button>
            <div>

            </div>
            <!--      <el-table stripe :data="tableData"-->
            <!--                element-loading-text="拼命加载中"-->
            <!--                element-loading-spinner="el-icon-loading"-->
            <!--                element-loading-background="rgba(0, 0, 0, 0.8)"-->
            <!--                v-loading.fullscreen.lock="loading">-->
            <!--        <el-table-column prop="mu" label="编号" width="80"/>-->
            <!--        <el-table-column prop="title" label="标题"/>-->
            <!--        <el-table-column label="操作" width="200">-->
            <!--          <template slot-scope="scope">-->
            <!--            <PlainButton text="编辑"-->
            <!--                         :click="()=>showUpdate(scope.row.mu)"/>-->
            <!--            <PlainButton text="删除"-->
            <!--                         :click="()=>doDelete(scope.row.mu)"/>-->
            <!--          </template>-->
            <!--        </el-table-column>-->
            <!--      </el-table>-->
            <!--      <SearchPagination :currentPage="currentPage" :total="total" :limit="limit"-->
            <!--                        @handleCurrentChange="handleCurrentChange"-->
            <!--                        @handleSizeChange="handleSizeChange"/>-->
        </el-main>
        <el-footer>
            <el-dialog width="35%" title="添加" :visible.sync="showAddFormvisible">
                <div>
                    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                        <el-form-item label="标题" prop="title">
                            <div>
                                <el-input placeholder="请输入内容" v-model="input2">
                                    <template slot="append" @change="inptChange">.com</template>
                                </el-input>
                            </div>
                            <!--              {{tagsAllData}}-->
                            <!--              <el-checkbox-group v-model="checkList">-->
                            <el-checkbox v-model="checkList" v-for="item in tagsAllData" :key="item.id" :value="item.mu" :label="item.mu">
                                <div v-if="!editcheckbox">
                                    <spna>{{ item.labelName }}</spna>-->
                                </div>
                                <div v-if="editcheckbox">

                                    <el-input :value="item.labelName" v-model="item.labelName" @change="labelInput(item)"></el-input>
                                </div>
                                <i class="el-icon-edit" @click="editIcon(item)"></i>
                            </el-checkbox>

                            <!--              </el-checkbox-group>-->
                        </el-form-item>
                        <el-form-item>
                            <PrimaryButton text="确定" :click="doAdd" />
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
            <el-dialog width="35%" title="修改" :visible.sync="showUpdateForm">
                <el-form ref="updateForm" :rules="rules" :model="updateForm" label-width="100px">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="updateForm.title" placeholder="请输入标题" />
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
import {
    pagemx,
    removemx,
    addmx,
    updatemx
} from '@/chaos/functions/mixin/CRUD';

export default {
    name: 'specialClassManage',
    mixins: [pagemx, removemx, addmx, updatemx],
    data() {
        const rules = {
            // title: [
            //     {required: true, message: '请输入标题', trigger: 'blur'},
            // ]
        };
        return {
            domain: 'specialClassManage',
            rules,
            goodsTagsData1: [],
            goodsTagsData2: [],
            tagsData1: [],
            tagsData2: [],
            showAddFormvisible: false,
            input2: '',
            tagsAllData: [
                {
                    createTime: '2021/05/19 15:36:10',
                    id: 9,
                    isDelete: 0,
                    labelName: '体验课',
                    labelType: 0,
                    modifyTime: '2021/05/19 15:36:10',
                    mu: '41fc4a57727e4dce8f1b0af73086ea93',
                    version: 1
                },
                {
                    createTime: '2021/05/18 15:36:10',
                    id: 10,
                    isDelete: 0,
                    labelName: '系统课',
                    labelType: 0,
                    modifyTime: '2021/05/18 15:36:10',
                    mu: 'fcf168add2544468bfd7992595782f47',
                    version: 1
                },
                {
                    createTime: '2021/06/19 15:36:10',
                    id: 11,
                    isDelete: 0,
                    labelName: '德玛西亚',
                    labelType: 0,
                    modifyTime: '2021/06/19 15:36:10',
                    mu: '677ae2fb108e4ee0ba017bdc29126343',
                    version: 1
                },
                {
                    createTime: '2021/04/19 15:36:10',
                    id: 12,
                    isDelete: 0,
                    labelName: '劲夫',
                    labelType: 0,
                    modifyTime: '2021/04/19 15:36:10',
                    mu: '677ae2fb108e4dce8f1b0af73086ea93',
                    version: 1
                },
                {
                    createTime: '2021/06/18 15:36:10',
                    id: 13,
                    isDelete: 0,
                    labelName: '包邮',
                    labelType: 0,
                    modifyTime: '2021/06/18 15:36:10',
                    mu: '41fc4a57727e4ee0ba017bdc29126343',
                    version: 1
                }
            ],
            checkList: [],
            editcheckbox: false
        };
    },
    created() {
        // this.search();
    },
    methods: {
        showTagsModal() {
            this.showAddFormvisible = true;
        },
        inptChange() {
            console.log('搜索');
        },
        checkGroup(event) {
            console.log(event, '123');
        },
        labelInput(item, event) {
            console.log('item => ', item, 'event =>', event);
        },
        editIcon(val, event) {
            // this.tagsAllData = val;
            console.log('val => ', val, 'event =>', event);
            this.editcheckbox = true;
            console.log(this.tagsAllData);
        }
    }
};
</script>
<style lang="less" scoped>
.el-form {
    width: 500px;
}
</style>
