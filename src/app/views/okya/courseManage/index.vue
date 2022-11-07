<template>
    <el-container>
        <el-header>
            <el-container class="prim-button">
                <PrimaryButton text="新增TAB" :click="showAddUp" />
            </el-container>
        </el-header>
        <el-main>
            <el-tabs type="border-card" v-show="this.editableTabs.length ? true : false" closable v-model="editableTabsValue" @tab-remove="removeTab">
                <el-tab-pane v-for="(item, index) in editableTabs" :key="index" :label="item.tabName" :value="item.mu" :name="item.mu">
                    <div style="margin-bottom: 15px; display: flex; flex-direction: row-reverse;">
                        <el-button @click="newClassUp(item.mu)">新增课程</el-button>
                        <el-button style="margin-right: 10px" @click="showUpdateTab(item.mu)">编辑TAB</el-button>
                    </div>
                    <el-table stripe :data="item.homeCourse">
                        <el-table-column type="index" label="序号" width="50"></el-table-column>
                        <el-table-column prop="tabName" label="封面图" width="80">
                            <template slot-scope="scope">
                                <el-popover placement="top-start" trigger="hover" :content="scope.row.detailUrl">
                                    <el-image :src="scope.row.detailUrl" fit="scale-down" style="width: 220px; height: 200px"></el-image>
                                    <div slot="reference">
                                        <el-image :src="scope.row.detailUrl" fit="scale-down"></el-image>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="courseName" label="课程名称" />
                        <el-table-column prop="courseLabels" label="课程类别标签">
                            <template slot-scope="scope">
                                <div v-for="(item, index) in scope.row.courseLabels" :key="index">{{ item.labelName }} {{index !== scope.row.courseLabels.length -1 ? '、' : ''}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="abilityList" label="能力标签">
                            <template slot-scope="scope">
                                <span v-for="(item, index) in scope.row.abilityList" :key="index">{{ item.labelName }}{{index !== scope.row.abilityList.length - 1 ? '、' : ''}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="courseType" label="课程类型">
                            <template slot-scope="scope">
                                <span v-if="scope.row.courseType === 4">AI课</span>
                                <span v-if="scope.row.courseType === 1">核心课</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="price" label="价格">
                            <template slot-scope="scope">
                                <span>{{ scope.row.maxPrice/100 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button type="text" text="编辑" @click="showUpdateClass(scope.row.mu, item.mu)">编辑</el-button>
                                <el-button type="text" @click="doDelete(scope.row.mu)">删除</el-button>
                                <el-button type="text" :disabled="disabled(scope.$index)" @click="PlacedTop(scope.row,0)">置顶</el-button>
                                <el-button type="text" class="el-icon-top" :disabled="disabled(scope.$index)" @click="PlacedTop(scope.row, 1)" />
                                <el-button type="text" class="el-icon-bottom" :disabled="scope.$index === item.homeCourse.length - 1" @click="PlacedTop(scope.row, 2)" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-main>
        <el-dialog width="35%" title="新增TAB" :visible.sync="showAddForm" >
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="名称" prop="tabName"  :required="true">
                    <el-input maxlength="4" clearable v-model="form.tabName" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item>
                    <PrimaryButton text="确定" :click="doAdd" />
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog width="35%" title="编辑TAB" :visible.sync="showUpdateTabForm"  >
            <el-form ref="updateForm" :rules="rules" :model="updateForm" label-width="100px">
                <el-form-item label="名称" prop="tabName" :required="true">
                    <el-input maxlength="4" clearable v-model="updateForm.tabName" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item>
                    <PrimaryButton text="确定" :click="doUpdateTab" />
                </el-form-item>
            </el-form>
        </el-dialog>
        <CourseTable :updateClass="updateClassVisible" @close="updateClassVisible = false" @tabsList="tabsList" ref="newClassRef" />
    </el-container>
</template>

<script>
import {
    pagemx,
    removemx,
    addmx,
    updatemx
} from '@/chaos/functions/mixin/CRUD';
import {
    list,
    add,
    one,
    update,
    remove,
    submit
} from '@/chaos/functions/common/Data';
import CourseTable from './courseTable';
import { Loading } from 'element-ui';

export default {
    name: 'courseManage',
    mixins: [pagemx, removemx, addmx, updatemx],
    data() {
        const rules = {};
        return {
            domain: 'okyaHomeTab',
            rules,
            showAddForm: false,
            showUpdateTabForm: false,
            updateClassVisible: false,
            courseBut: 'add',
            editableTabs: [],
            editableTabList: [],
            tableData: [],
            Mu: '',
            TabName: '',
            editableTabsValue: '',
            isShow: true
        };
    },
    created() {
        this.tabsList();
    },
    methods: {
        async tabsList(index) {
            let loadingInstance = Loading.service({ background: 'rgba(0, 0, 0, 0.7)'});
            const tabName = this.TabName;
            const mu = this.Mu;
            let res = await list(this.domain, { tabName, mu });
            this.editableTabs = res; // 后台传递的数据, 放到 editableTabs []中
            if (this.editableTabs.length) {
                this.editableTabsValue = index || this.editableTabs[0].mu;
            }
            loadingInstance.close();
        },
        showAddUp() {
            // 新增TAB
            this.showAddForm = true;
            if (this.form.tabName) {
                this.form.tabName = '';
            }
        },
        async doAdd() {
            // 新增TAB确认按钮
            if (!this.form.tabName) {
                this.$message.error('请输入名称');
                return false;
            }
            // Data.validate(this, 'form', async () => {
            await add(this.domain, this.form);
            this.editableTabsValue = this.form.tabName;
            this.showAddForm = false;
            this.tabsList();
            // });
        },
        async showUpdateTab(mu) {
            // 编辑TAB
            let loadingInstance = Loading.service();
            this.showUpdateTabForm = true;
            this.updateForm = await one(this.domain, mu);
            loadingInstance.close();
        },
        async doUpdateTab() {
            // 修改编辑TAB确认按钮
            if (!this.form.tabName) {
                this.$message.error('请输入名称');
                return false;
            }
            const typeMu = this.editableTabsValue;
            await update(this.domain, this.updateForm.mu, this.updateForm);
            this.showUpdateTabForm = false;
            this.tabsList(typeMu);
        },
        newClassUp(typeid) {
            // 新增课程
            this.updateClassVisible = true;
            this.$refs.newClassRef.init({ newClassType: 'add' }, '', typeid);
        },
        async showUpdateClass(mu, typeid) {
            // 课程编辑
            // console.log(typeid, 'tab的ID');
            this.updateClassVisible = true;
            let res = await one('okyaHomeCourse', mu);
            this.$refs.newClassRef.init(
                { newClassType: 'modify' },
                res,
                typeid
            );
        },
        async doDelete(mu) {
            // table 删除
            const typeMu = this.editableTabsValue;
            await remove('okyaHomeCourse', mu, () => {
                this.tabsList(typeMu);
            });
        },
        async removeTab(mu) {
            await remove(this.domain, mu, () => {
                this.tabsList();
            });
        },
        disabled(index) {
            // 控制 置顶，上移 是否可操作
            return this.currentPage === 1 && index === 0;
        },
        async PlacedTop(info, operationType) {
            const mu = info.mu;
            const typeMu = this.editableTabsValue;
            const param = {
                mu,
                operationType,
                typeMu
            };
            let res = await submit('okyaHomeCourse/upperAndLower', param);
            if (res) {
                this.tabsList(typeMu);
            }
        }
    },
    components: {
        CourseTable
    }
};
</script>

<style lang="less" scoped>
.el-form {
    width: 500px;
}

.prim-button {
    display: flex;
    flex-flow: row-reverse;
}

.main-header {
    display: flex;
    flex-flow: row;
    margin-bottom: 10px;

    .main-span {
        width: 150px;
        font-size: 16px;
        font-weight: 600;
        position: relative;

        .c-span {
            position: absolute;
            bottom: 0px;
            padding: 0px;
            margin: 0px;
        }
    }

    .main-cont {
        display: flex;
        flex-direction: column;
    }

    .main_button {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;
        margin-bottom: 15px;
    }
}
</style>
