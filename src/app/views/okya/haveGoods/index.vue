<template>
    <el-container>
        <el-header>
            <el-form class="header-form" :model="haveForm">
                <div class="div-form">
                    <el-form-item label="商品状态: ">
                        <el-select placeholder="请选择商品状态" v-model="data.status" @change="(value) => this.handleChange(value, 'data.status')">
                            <el-option label="全部" :value="-1">全部</el-option>
                            <el-option label="上架" :value="1">上架</el-option>
                            <el-option label="下架" :value="0">下架</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间: ">
                        <el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" v-model="youzanTime" @change="userTime"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="关键词: ">
                        <el-select v-model="search_mode" @change="searChMode($event)">
                            <el-option v-for="(item,index) in searchMode" :key="index" :label="item.content" :value="index"></el-option>
                        </el-select>
                        <el-input v-model="data[searchMode[search_mode].key]" clearable class="search_input" style="width:245px" placeholder="请输入关键词" @change="(value) => this.handleChange(value, 'data[searchMode[search_mode].key]')" />
                    </el-form-item>
                </div>
                <div>
                    <PrimaryButton text="搜索" :click="search" />
                    <PrimaryButton text="创建" :click="youzanGoodsIncrease" />
                </div>
            </el-form>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column prop="youzanGoodsId" label="有赞商品ID" />
                <el-table-column prop="title" label="商品名称" />
                <el-table-column prop="courseNum" label="关联课包（规格）">
                    <template slot-scope="scope">
                        <el-button type="text" @click="()=>relatedCoursePackage(scope.row)">{{scope.row.courseNum}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="createPeoplePhone" label="创建人" />
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column prop="modifyTime" label="更新时间" />
                <el-table-column prop="status" label="状态" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">上架</span>
                        <span v-if="scope.row.status === 0">下架</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <PlainButton text="编辑" :click="()=>youzanGoodsEditor(scope.row.youzanGoodsId)" />
                        <PlainButton v-if="scope.row.status === 1" text="下架" :click="()=>standUpAndDown(scope.row.mu,scope.row.youzanGoodsId , 0)" />
                        <PlainButton v-if="scope.row.status === 0" text="上架" :click="()=>standUpAndDown(scope.row.mu,scope.row.youzanGoodsId, 1)" />
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
        <el-dialog width="35%" title="课包详情" :visible.sync="showUpdateForm">
            <el-table :data="coursePackageDetailList">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="lessonName" label="课程名称"></el-table-column>
                <el-table-column prop="coursePackageName" label="课包"></el-table-column>
                <el-table-column prop="lessonNum" label="开通节数"></el-table-column>
                <el-table-column prop="lessonType" label="课程类型"></el-table-column>
                <el-table-column prop="originalPrice" label="原价"></el-table-column>
            </el-table>
        </el-dialog>
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
    update,
    submit
} from '@/chaos/functions/common/Data';
export default {
    name: 'haveGoods',
    mixins: [pagemx, removemx, addmx, updatemx],
    props: {},
    data() {
        const rules = {
            title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
        };
        return {
            domain: 'youzanGoodsResouce',
            searchMethod: 'pageYouzanGoods',
            rules,
            showUpdateForm: false,
            coursePackageDetailList: [],
            youzanTime: '',
            data: {
                youzanGoodsId: '',
                title: '',
                createStartTime: '',
                createEndTime: '',
                status: -1,
            },
            search_mode: '1',
            searchMode: {
                1: {
                    content: '有赞商品ID',
                    key: 'youzanGoodsId'
                },
                2: {
                    content: '商品名称',
                    key: 'title'
                }
            },
            haveForm: {
                setTime: ''
            }
        };
    },
    methods: {
        relatedCoursePackage(res) {
            console.log(res);
            this.coursePackageDetailList = res.coursePackageDetailList;
            this.showUpdateForm = true;
        },
        userTime() {
            if (this.youzanTime !== null) {
                this.data.createStartTime = `${this.youzanTime[0]} 00:00:00`;
                this.data.createEndTime = `${this.youzanTime[1]} 23:59:59`;
            } else {
                this.data.createStartTime = '';
                this.data.createEndTime = '';
            }
            this.currentPage = 1;
            this.search();
        },
        searChMode(val) {
            this.data.youzanGoodsId = '';
            this.data.title = '';
        },
        youzanGoodsIncrease() {
            let type = 1;
            this.$router.push({
                name: 'createOreditor',
                params: { type: 1 }
            });
            this.$store.dispatch('global/setData', { youzanType: type });
        },
        youzanGoodsEditor(youzanGoodsId) {
            console.log(youzanGoodsId, '有赞商品管理 mu');
            let type = 2;
            this.$router.push({
                name: 'createOreditor',
                params: { youzanGoodsId, type: 2 }
            });
            this.$store.dispatch('global/setData', { youzanGoodsId: youzanGoodsId, youzanType: type });
        },


        async standUpAndDown(mu, youzanGoodsId,status) {
            let res = await submit('youzanGoodsResouce/upDownShelf', {mu, data: {status,youzanGoodsId}});
            if( res) {
                this.search();
            }
            console.log(res);
        }
    },
};
</script>
<style lang="less" scoped>
.el-form {
    width: auto;
}
.header-form {
    width: auto;
    display: flex;
    flex-flow: row;
    .div-form {
        display: flex;
        flex-flow: row;
        flex: 1;
        .el-form-item {
            display: flex;
            flex-flow: row;
            margin-right: 20px;
        }
    }
}
</style>
