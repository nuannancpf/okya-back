<template>
    <el-container>
        <el-header style="height:130px">
            <el-container>
                <el-form label-width="auto" class="form-header" :model="data">
                    <el-form-item label="支付时间:">
                        <el-date-picker style="width: 280px" clearable type="daterange" v-model="youzanTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="userTime" />
                    </el-form-item>

                    <el-form-item label="订单来源:" >
                        <el-select v-model="data.shopType" @change="(value)=>this.handleChange(value,'data.shopType')">
                            <el-option :value="-1" label="全部">全部</el-option>
                            <el-option :value="1" label="七田真优选">七田真优选</el-option>
                            <el-option :value="2" label="七田真启蒙">七田真启蒙</el-option>
                            <el-option :value="3" label="线下增课">线下赠课</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键词:">
                        <el-input v-model="data[searchMode[search_mode].key]" clearable class="search_input input-with-select" style="width:auto"  placeholder="请输入关键词" @change="(value) => this.handleChange(value, 'data[searchMode[search_mode].key]')">
                            <el-select slot="prepend" v-model="search_mode" @change="searChMode($event)">
                                <el-option v-for="(item,index) in searchMode" :key="index" :label="item.content" :value="index"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="线下分销员:" style=" margin-left: 8px;">
                        <el-select v-model="data.ifOffLineRetail" @change="(value)=>this.handleChange(value,'data.ifOffLineRetail')">
                            <el-option :value="-1" label="全部">全部</el-option>
                            <el-option :value="1" label="是">是</el-option>
                            <el-option :value="0" label="否">否</el-option>
                        </el-select>
                        <el-input placeholder="请输入关键词" v-model="data[disTrMode[searchdis_mode].key]" clearable class="input-with-select" style="width:auto" @change="(value) => this.handleChange(value,'data[disTrMode[searchdis_mode].key]')">
                            <el-select slot="prepend" v-model="searchdis_mode" @change="searDisChMode($event)">
                                <el-option v-for="(val,key) in disTrMode" :key="key" :value="key" :label="val.content"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <div class="header-but">
                        <el-form-item>
                            <SearchButton :click="search" />
                            <el-button>导出</el-button>
                            <el-button>同步有赞订单</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column prop="mu" label="编号" />
                <el-table-column prop="phone" label="电话" />
                <el-table-column prop="youzanGoodsId" label="有赞商品id号" width="120" />
                <el-table-column prop="youzanOrderId" label="有赞订单号" width="120" />
                <el-table-column prop="title" label="订单商品名称" width="120" />
                <el-table-column prop="releaseState" label="发放状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.releaseState === 1">已发放</span>
                        <span v-if="scope.row.releaseState === 0">未发放</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payTime" label="支付时间" />
                <el-table-column prop="totalFee" label="实收金额" />
                <el-table-column prop="shopType" label="订单来源">
                    <template slot-scope="scope">
                        <span>{{shopTypeNode[scope.row.shopType]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ifOffLineVip" label="线下会员">
                    <template slot-scope="scope">
                        <span v-if="scope.row.ifOffLineVip === 1">是</span>
                        <span v-if="scope.row.ifOffLineVip === 0">否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ifOffLineRetail" label="线下分销员" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.ifOffLineRetail === 1">是</span>
                        <span v-if="scope.row.ifOffLineRetail === 0">否</span>
                    </template>
                </el-table-column>
                <el-table-column prop="belongTo" label="归属中心" />
                <el-table-column prop="distributorPhone" label="分销员手机" width="120" />
                <el-table-column prop="distributorNumber" label="工号" />
                <el-table-column prop="refundTime" label="退款时间" />
                <el-table-column prop="refundFee" label="退款金额" />
                <el-table-column label="操作" width="auto">
                    <template slot-scope="scope">
                        <el-button type="text" @click="()=>showUpdate(scope.row.mu)">编辑</el-button>
                        <!-- <PlainButton text="编辑" :click="()=>showUpdate(scope.row.mu)"/> -->
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
        <el-dialog width="35%" title="修改" :visible.sync="showUpdateForm">
            <el-form ref="updateForm" :rules="rules" :model="updateForm" label-width="100px">
                <el-form-item prop="refundTime" label="退款时间">
                    <el-date-picker v-model="updateForm.refundTime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择退款时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="refundFee" label="退款金额">
                    <el-input v-model="updateForm.refundFee" placeholder="请输入退款金额" />
                </el-form-item>
                <el-form-item>
                    <PrimaryButton text="确定" :click="doUpdate" />
                </el-form-item>
            </el-form>
        </el-dialog>
    </el-container>
</template>
<script>
import { pagemx, updatemx } from '@/chaos/functions/mixin/CRUD';
import { page, search, searchExport, submit } from '@/chaos/functions/common/Data';

export default {
    name: 'youzanOrderRecord',
    mixins: [pagemx, updatemx],
    data() {
        const rules = {
            refundTime: [
                { required: true, message: '请输入退款时间', trigger: 'blur' }
            ],
            refundFee: [
                { required: true, message: '请输入退款金额', trigger: 'blur' }
            ]
        };
        return {
            domain: 'youzanOrderRecord',
            rules,

            data: {
                youzanOrderId: '',
                title: '',
                phone: '',

                ifOffLineRetail: -1,
                distributorPhone: '',
                distributorNumber: '',

                startPayTime: '',
                endPayTime: '',
                shopType: -1,
            },
            youzanTime: '',
            search_mode: '1',
            searchMode: {
                1: {
                    content: '有赞订单号',
                    key: 'youzanOrderId'
                },
                2: {
                    content: '订单商品名称',
                    key: 'title'
                },
                3: {
                    content: '手机号',
                    key: 'phone'
                }
            },
            searchdis_mode: '1',
            disTrMode: {
                1: {
                    content: '分销员手机',
                    key: 'distributorPhone'
                },
                2: {
                    content: '分销员工号',
                    key: 'distributorNumber'
                },
            },
            shopTypeNode: {
                1: '七田真优选',
                2: '七田真启蒙',
                3: '线下增课'
            }
        };
    },
    methods: {
        userTime() {
            if (this.youzanTime !== null) {
                this.data.startPayTime = `${this.youzanTime[0]} 00:00:00`;
                this.data.endPayTime = `${this.youzanTime[1]} 23:59:59`;
            } else {
                this.data.startPayTime = '';
                this.data.endPayTime = '';
            }
            this.currentPage = 1;
            this.search();
        },
        searChMode(val) {
            this.data.youzanOrderId = '';
            this.data.title = '';
            this.data.phone = '';
        },
        searDisChMode(val) {
            this.data.distributorPhone = '';
            this.data.distributorNumber = '';
        }
    }
};
</script>
<style lang="less" scoped>
.el-form {
    width: auto;
}
.form-header {
    display: flex;
    flex-flow: row;
    flex: 1;
    flex-wrap: wrap;
    .el-input {
        width: 210px;
    }
    input.el-input__inne {
        width: 240px;
    }
    .header-but {
        display: flex;
        flex: 1;
        flex-flow: row-reverse;
    }
}
.el-select {
    width: 130px;
}
// .search_input{
//     width: ;
// }
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>
