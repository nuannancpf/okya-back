<template>
    <el-container>
        <el-main>
            <el-table style="width: 100%" :data="tableData">
                <el-table-column label="课程名称" prop="courseName"></el-table-column>
                <el-table-column label="课包" prop="coursePackageName"></el-table-column>
                <el-table-column label="开通课节" prop="count"></el-table-column>
                <el-table-column label="已上课节" prop="finishCount"></el-table-column>
                <el-table-column label="上课进度" prop="present">
                    <template slot-scope="scope">
                        <span>{{(scope.row.present*100).toFixed(2)}}{{'%'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开通时间" prop="createTime"></el-table-column>
                <el-table-column label="最近上课时间" prop="lastFinishDate">
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
    </el-container>
</template>

<script>
import { search } from '@/chaos/functions/common/Data';
import {
    removemx,
    addmx,
    updatemx
} from '@/chaos/functions/mixin/CRUD';
import formatStamp from '@/app/tools/dateTimeUtil';
export default {
    mixins: [removemx, addmx, updatemx],
    props: {
        mu: String
    },
    data() {
        return {
            tableData: [],
            currentPage: 1,
            limit: 20,
            total: 0,
        };
    },
    mounted() {
        this.courseTableList();
    },
    methods: {
        async courseTableList() {
            console.log('这是课程tab');
            let res = await search(
                'okya_course/getPage',
                this.currentPage,
                this.limit,
                { mu: this.$store.state.global.data.userDetailMu }
            );
            this.tableData = res.list;
            this.total = res.total;
            this.tableData.forEach(order => {
                order.createTime = formatStamp(order.createTime);
                order.lastFinishDate = formatStamp(order.lastFinishDate);
            });
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.courseTableList();
        },
        handleSizeChange(limit) {
            this.limit = limit;
            this.currentPage = 1;
            this.courseTableList();
        }
    }
};
</script>

<style lang="less" scoped></style>
