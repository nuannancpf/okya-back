<template>
    <el-container>
        <el-header>
            <el-container>
                <el-form :model="clockHeaderForm" label-width="80px" class="header-form">
                    <div class="form-header">
                        <div class="div-el-form">
                            <el-form-item label="开始时间: ">
                                <el-date-picker v-model="startTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="getTime"></el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="div-el-form">
                            <el-form-item label="状态: ">
                                <el-select v-model="clockHeaderForm.status" clearable placeholder="请选择状态" @change="(value)=>this.handleChange(value,'clockHeaderForm.status')">
                                    <el-option label="挑战中" :value="1">挑战中</el-option>
                                    <el-option label="未开始" :value="3">未开始</el-option>
                                    <el-option label="挑战失败" :value="0">挑战失败</el-option>
                                    <el-option label="挑战成功" :value="2">挑战成功</el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="div-el-form">
                            <el-form-item label="关键词: ">
                                <el-input v-model="clockHeaderForm.phone" placeholder="请输入手机号" clearable @change="(value)=>this.handleChange(value,'clockHeaderForm.phone')"></el-input>
                            </el-form-item>
                        </div>
                        <div class="div-el-form form-but">
                            <div>
                                <el-button type="primary" @click="listGetPage">查询</el-button>
                                <el-button type="primary" @click="exportExcelList">导出</el-button>
                            </div>

                        </div>
                    </div>
                </el-form>
            </el-container>
        </el-header>
        <el-main style="overflow: visible">
            <el-table stripe :data="tableData" style="overflow: visible" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column prop="userName" label="用户名" />
                <el-table-column prop="phone" label="手机号" />
                <el-table-column prop="participateDate" label="参与时间" />
                <el-table-column prop="startDate" label="开始时间" />
                <el-table-column prop="count" label="打卡进度" />
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.status ===0">{{ Status[scope.row.status] }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.status ===1">{{ Status[scope.row.status] }}</el-tag>
                        <el-tag type="success" v-if="scope.row.status ===2">{{ Status[scope.row.status] }}</el-tag>
                        <el-tag type="info" v-if="scope.row.status ===3">{{ Status[scope.row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="courseList" label="开通课程">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.courseList" :key="index">{{ item.courseName }} - {{ item.categoryTitle }} ({{item.count}}){{ index !== scope.row.courseList.length - 1 ? '/' : '' }} </span>
                    </template>
                </el-table-column>
                <el-table-column width="100" prop="received" label="领取奖励">
                    <template slot-scope="scope">
                        {{Received[scope.row.received]}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="deTails(scope.row.userId)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
        <el-dialog width="35%" title="添加" :visible.sync="showAddForm">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item>
                    <PrimaryButton text="确定" :click="doAdd" />
                </el-form-item>
            </el-form>
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
        <DeTail :deTailVisible="deTailClockVisible" @close="deTailClockVisible = false" ref="clockDetails" />
    </el-container>
</template>

<script>
import {
    pagemx,
    removemx,
    addmx,
    updatemx
} from '@/chaos/functions/mixin/CRUD';
import { search, searchExport } from '@/chaos/functions/common/Data';
import DeTail from './details';
import { Loading } from 'element-ui';

export default {
    name: 'clockData',
    mixins: [pagemx, removemx, addmx, updatemx],
    props: {},
    data() {
        const rules = {
            title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
        };
        return {
            domain: 'okyaClock',
            rules,
            startTime: '', // 查询时间

            clockHeaderForm: {
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                status: '', // 状态
                phone: '' //手机号
            },
            tableData: [],
            courseList: [],

            deTailClockVisible: false, // 详情弹框
            updateTime: '',
            userMu: '',
            Status: {
                0: '挑战失败',
                1: '挑战中',
                2: '挑战成功',
                3: '未开始'
            },
            Received: {
                0: '否',
                1: '是'
            }
        };
    },
    created() {
        this.listGetPage();
    },
    methods: {
        async listGetPage() {
            // let loadingInstance = Loading.service({ background: 'rgba(0, 0, 0, 0.7)'});
            const data = this.clockHeaderForm;
            const currentPage = this.currentPage || '';
            let res = await search(
                'okyaClock/getPage',
                currentPage,
                this.limit,
                data
            );
            this.tableData = res.list ||[];
            this.total = res.total;
            // loadingInstance.close();
        },
        getTime() {
            if (this.startTime !== null) {
                this.clockHeaderForm.startDate = `${this.startTime[0]} 00:00:00`;
                this.clockHeaderForm.endDate = `${this.startTime[1]} 23:59:59`;
            } else {
                this.clockHeaderForm.startDate = '';
                this.clockHeaderForm.endDate = '';
            }
            this.currentPage = 1;
            this.listGetPage();
        },
        async exportExcelList() {
            const header = [
                { title: '用户名', key: 'userName' },
                { title: '手机号', key: 'phone' },
                {
                    title: '参与时间',
                    key: 'participateDate'
                },
                { title: '开始时间', key: 'startDate' },
                { title: '打卡进度', key: 'count' },
                { title: '状态', key: 'status' },
                { title: '开通课程', key: 'courseList' },
                { title: '领取奖励', key: 'received' }
            ];
            const data = this.clockHeaderForm;
            const nowDate = new Date();
            const date = {
                year: nowDate.getFullYear(),
                month: nowDate.getMonth() + 1,
                date: nowDate.getDate()
            };
            const newmonth = date.month > 10 ? date.month : '0' + date.month;
            const day = date.date > 10 ? date.date : '0' + date.date;
            this.updateTime = date.year + '-' + newmonth + '-' + day;
            await searchExport(
                'okyaClock/PageExport',
                header,
                `打卡数据 ${this.updateTime} `,
                data
            );
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.listGetPage();
        },
        handleSizeChange(limit) {
            this.limit = limit;
            this.currentPage = 1;
            this.listGetPage();
        },
        handleChange(value, key) {
            this.currentPage = 1;
            this.data[key] = value;
            this.listGetPage();
        },
        async deTails(userId) {
            // 详情弹框
            this.userMu = userId;
            this.deTailClockVisible = true;
            this.$refs.clockDetails.getDetails(userId);
        }
    },
    components: {
        DeTail
    }
};
</script>

<style lang="less" scoped>
.el-form {
    width: auto;
}

.header-form {
    width: auto;
    .form-header {
        display: flex;
        flex-flow: row;
        flex: 1;
        .el-form-item {
            .el-input {
                width: auto;
            }
        }
        .data-picker {
            margin-left: 10px;
            margin-right: 20px;
        }
    }
    .form-but {
        flex: 1;
        margin-left: 10px;
    }
}
</style>
