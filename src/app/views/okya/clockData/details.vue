<template>
    <el-dialog :visible.sync="deTailVisible" title="打卡详情" center width="60%" :before-close="onClose">
        <el-form ref="detaForm" :model="detaForm" label-width="auto">
            <el-form-item label="用户名:" prop="userName">
                {{ this.detaForm.userName }}
            </el-form-item>
            <el-form-item label="状态:" prop="status">
                {{Status [this.detaForm.status] }}
            </el-form-item>
            <el-form-item label="是否领取奖励:" prop="received">
                {{Received[this.detaForm.received]}}
            </el-form-item>
            <el-form-item label="打卡数据 : " style="width: auto">
                <el-table stripe :data="detailData" style="overflow: visible">
                    <el-table-column prop="createTime" label="打卡时间" width="250"></el-table-column>
                    <el-table-column prop="categoryTitle" label="类目名称"></el-table-column>
                    <el-table-column prop="courseTitle" label="课程名称"></el-table-column>
                    <el-table-column prop="courseType" label="课程类型">
                        <template slot-scope="scope">
                            {{courseList[scope.row.courseType]}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="lessonTitle" label="课节名称"></el-table-column>
                </el-table>
                <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {
    removemx,
    addmx,
} from '@/chaos/functions/mixin/CRUD';
import { query } from '@/chaos/functions/common/Data';
import { Loading } from 'element-ui';

export default {
    mixins: [ removemx, addmx],
    props: {
        deTailVisible: {
            type: Boolean,
            default: false
        },
        clockD: {
            type: Object
        }
    },
    data() {
        return {
            domain: 'okyaUserClockRecord',
            currentPage: 1,
            limit: 5,
            total: 0,
            detaForm: {
                userName: '',
                status: '',
                received: ''
            },
            userOneId: '',
            detailData: [],
            tableList: [],
            Status: {
                0: '挑战失败',
                1: '挑战中',
                2: '挑战成功',
                3: '未开始'
            },
            Received: {
                0: '否',
                1: '是'
            },
            courseList: {
                1: '核心课',
                4: 'AI课'
            }
        };
    },
    methods: {
        async getDetails(userId) {
            this.userOneId = userId;
            let pageNum = this.currentPage;
            let pageSize = this.limit;
            let data = { userId };
            let param = {
                pageNum,
                pageSize,
                data
            };

            let res;
            res = await query('okyaUserClockRecord/page', param);
            (this.detaForm = {
                userName: res.userName,
                status: res.status,
                received: res.received
            }),
            (this.detailData = res.list);
            this.total = res.total;
        },
        handleCurrentChange(currentPage) {
            let user = this.userOneId;
            this.currentPage = currentPage;
            this.getDetails(user);
        },
        handleSizeChange(limit) {
            let user = this.userOneId;
            this.limit = limit;
            this.currentPage = 1;
            this.getDetails(user);
        },
        onClose() {
            this.$emit('close');
        }
    }
};
</script>
<style lang="less" scoped>
.el-form {
    width: auto;
}
</style>
