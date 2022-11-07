<template>
    <el-container>
        <el-header class="header">
            <el-container class="header-left">
                <div>
                    <span>活动状态: </span>
                    <el-select class="data-picker" placeholder="请选择活动区域" style="width: 300px" v-model="isPublish" @change="(value)=>this.handleChange(value,'isPublish')">
                        <el-option label="全部" :value="2">全部</el-option>
                        <el-option label="上架" :value="1">已上架</el-option>
                        <el-option label="下架" :value="0">已下架</el-option>
                    </el-select>
                    <SearchButton :click="search" />
                </div>
                <div class="header-button">
                    <el-button @click="showAddList">推荐位设置</el-button>
                    <el-button @click="updateAct" style="margin-right: 10px">新增活动</el-button>
                </div>
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column prop="mu" label="活动ID"></el-table-column>
                <el-table-column prop="activityTitle" label="活动名称" />
                <el-table-column label="封面图" prop="homeImg">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover" :content="scope.row.homeImg">
                            <el-image :src="scope.row.homeImg" fit="scale-down" style="width: 260px; height: auto"></el-image>
                            <div slot="reference" style="text-align: center">
                                <el-image :src="scope.row.homeImg" fit="scale-down" style="height: 62px;" />
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="patternType" label="跳转方式">
                    <template slot-scope="scope">
                        {{ Patter[scope.row.patternType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="adminName" label="创建人"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="isPublish" label="是否上架">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isPublish === 0">已下架</span>
                        <span v-if="scope.row.isPublish === 1">已上架</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showUpdate(scope.row.mu, 'modify')">编辑</el-button>
                        <el-button type="text" v-if="scope.row.isPublish === 0" :value="1" @click="standUpDown(scope.row.mu, 1)">上架</el-button>
                        <el-button type="text" v-if="scope.row.isPublish === 1" :value="0" @click="standUpDown(scope.row.mu, 0)">下架</el-button>
                        <el-button type="text" class="el-icon-top" :disabled="disabled(scope)" @click="moveUP(scope.row)" />
                        <el-button type="text" class="el-icon-bottom" :disabled="bdisabled(scope)" @click="moveDown(scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
        <el-dialog width="35%" title="添加" :visible.sync="showAddForm">
            <el-form ref="form" :rules="rules" :model="formRecom" label-width="100px">
                <el-form-item label="是否显示" prop="isOpen">
                    <el-radio-group v-model="formRecom.isOpen">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="推荐位标题" prop="title">
                    <el-input maxlength="5" v-model="formRecom.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item>
                    <el-button text="确定" @click="doAddslist">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <NewAct :newActivities="newActivitiesVisible" @close="newActivitiesVisible = false" @getData="getData" ref="newActMange" />
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
    query,
    validate,
    one,
    list,
    update,
    add
} from '@/chaos/functions/common/Data';
import NewAct from './newActManage';
import { Loading } from 'element-ui';

export default {
    name: 'actManage',
    mixins: [pagemx, removemx, addmx, updatemx],
    data() {
        const rules = {};
        return {
            domain: 'okyaActivity',
            rules,
            type: '',
            mu_showUpdate: {},
            MuShow: {},
            newActivitiesVisible: false,
            newActType: 'add', // 类型(add : 新增, modify : 编辑)
            isPublish: 2,
            isStand: 0,
            formRecom: {
                // 推荐位设置
                isOpen: 1, // 1 是, 0否
                title: ''
            },
            recomMu: '',
            operationType: '',
            loading: false,
            isPub: [
                { val: 2, lab: '全部' },
                { val: 0, lab: '上架' },
                { val: 1, lab: '下架' }
            ],
            Patter: {
                0: '跳转长图',
                1: '应用内跳转',
                2: '有赞商品',
                3: 'H5',
                4: '打卡'
            }
        };
    },
    methods: {
        getData() {
            this.search();
        },
        updateAct() {
            // 新增\
            
            this.$refs.newActMange.init({ newactType: 'add' });
            this.newActivitiesVisible = true;
        },
        async showUpdate(mu) {
            // 编辑
            let loadingInstance = Loading.service();
            this.newActivitiesVisible = true;
            let res;
            res = await one(this.domain, mu);
            this.$refs.newActMange.init({ newactType: 'modify' }, res);
            loadingInstance.close();
        },
        async standUpDown(mu, type) {
            const isPublish = type;
            const res = await query('okyaActivity/push', {
                mu,
                data: { isPublish }
            });
            if (res) {
                this.search();
            }
        },
        async showAddList() {
            // 推荐位设置
            this.showAddForm = true;
            let res;
            res = await list(
                'okyaActivitySetting',
                this.isOpen,
                this.title,
                this.data
            );
            this.recomMu = res.mu;
            if (this.recomMu) {
                this.formRecom.isOpen = res.isOpen;
                this.formRecom.title = res.title;
            } else {
                this.formRecom.isOpen = 1;
            }
        },
        doAddslist() {
            validate(this, 'form', async () => {
                if (this.recomMu) {
                    const mu = this.recomMu;
                    await update('okyaActivitySetting', mu, this.formRecom);
                    this.showAddList();
                } else {
                    await add('okyaActivitySetting', this.formRecom);
                    this.showAddList();
                }
                this.showAddForm = false;
            });
        },
        disabled({ $index }) {
            // 控制 置顶，上移 是否可操作
            return this.currentPage === 1 && $index === 0;
        },
        bdisabled({ $index }) {
            // 控制 下移 是否可操作
            return (
                $index + 1 === this.tableData.length &&
                Math.ceil(this.total / this.limit) === this.currentPage
            );
        },
        async PlacedTop({ mu }) {
            let operationType = 0;
            const res = await query('okyaActivity/upperAndLower', {
                mu,
                operationType
            });
            if (res) {
                this.search();
            }
        },
        async moveUP({ mu }) {
            let operationType = 1;
            const res = await query('okyaActivity/upperAndLower', {
                mu,
                operationType
            });
            if (res) {
                this.search();
            }
        },
        async moveDown({ mu }) {
            let operationType = 2;
            const res = await query('okyaActivity/upperAndLower', {
                mu,
                operationType
            });
            if (res) {
                this.search();
            }
        }
    },
    components: { NewAct },
};
</script>

<style lang="less" scoped>
element.style {
    width: auto;
}
.el-form {
    width: 500px;
}

.search-button {
    margin-left: 10px;
}

.header-left {
    display: flex;
}

.header-button {
    flex: 1;
    display: flex;
    flex-flow: row-reverse;
}

.el-icon-top,
.el-icon-bottom {
    font-size: 18px;
}
</style>
