<template>
    <el-container>
        <el-header>
            <el-container>
                <div class="form-item">
                    <el-select class="el-select-three" v-model="search_mode" @change="searChMode($event)">
                        <el-option v-for="(val,key) in searchModeEum" :key="key" :label="val.content" :value="key"></el-option>
                    </el-select>
                    <el-input class="input-seach" clearable :placeholder="`请输入${searchModeEum[search_mode].content}`" v-model="data[searchModeEum[search_mode].key]" @change="(value)=>handleChange(value,'data[searchModeEum[search_mode].key]')" />
                    <SearchButton :click="search" />
                </div>
                <div class="hander-time">
                    <el-date-picker style="width: 280px" clearable type="daterange" v-model="okyaTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="userTime"></el-date-picker>
                    <el-button type="primary" @click="offlineExport">导出</el-button>
                </div>
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column prop="tpiOrderId" label="线下订单号" />
                <el-table-column prop="setMealTitle" label="订单商品名称" />
                <el-table-column prop="phone" label="手机号" />
                <el-table-column prop="tpiOfflineResourceList" label="开通课程">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.tpiOfflineResourceList" :key="index">{{item.courseTitle}}{{ index !== scope.row.tpiOfflineResourceList.length - 1 ? '/' : '' }} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="payTime" label="支付时间" />
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
    </el-container>
</template>
<script>
import { pagemx } from '@/chaos/functions/mixin/CRUD';
import { searchExport } from '@/chaos/functions/common/Data';

export default {
    name: 'offlineOrderRecord',
    mixins: [pagemx],
    data() {
        const rules = {
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' },
            ]
        };
        return {
            domain: 'tpiOfflineOrder',
            searchMethod: 'getPage',
            rules,
            okyaTime: '',
            data: {
                phone: '',
                tpiOrderId: '',
                setMealTitle: '',

            },
            form: {
                endDate: '',
                startDate: ''
            },
            search_mode: '1',
            searchModeEum: {
                3: {
                    content: '手机号',
                    key: 'phone'
                },
                1: {
                    content: '有赞订单号',
                    key: 'tpiOrderId'
                },
                2: {
                    content: '订单商品名称',
                    key: 'setMealTitle'
                }
            }
        };
    },
    created() {
        this.search();
    },
    methods: {
        handleChange(value, key) {
            this.currentPage = 1;
            this.data[key] = value;
            this.search();
        },
        searChMode(val) {
            console.log(val);
            this.data.phone = '';
            this.data.tpiOrderId = '';
            this.data.setMealTitle = '';
        },
        userTime() {
            if (this.okyaTime !== null) {
                this.form.startDate = `${this.okyaTime[0]} 00:00:00`;
                this.form.endDate = `${this.okyaTime[1]} 23:59:59`;
            } else {
                this.form.startDate = '';
                this.form.endDate = '';
            }
        },
        async offlineExport() {
            const header = [
                { title: '线下订单号', key: 'tpiOrderId' },
                { title: '订单商品名称', key: 'setMealTitle' },
                { title: '手机号', key: 'phone' },
                { title: '开通课程', key: 'tpiOfflineResource' },
                { title: '支付时间', key: 'payTime' },
            ];
            const data = this.form;
            await searchExport('tpiOfflineOrder/PageExport', header, '线下订单记录', data);
            console.log('导出excel');
        }
    }
};
</script>
<style lang="less" scoped>
.el-form {
    width: 500px;
}
.form-item {
    display: flex;
    flex-flow: row;
    margin-right: 20px;
    .el-select-three {
        width: 180px;
    }
    .input-seach {
        width: 220px;
    }
}
.hander-time {
    display: flex;
    flex-flow: row;
}
</style>
