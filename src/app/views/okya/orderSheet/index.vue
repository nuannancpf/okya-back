<template>
    <el-container>
        <el-header style="height: 120px">
            <el-container class="contain">
                <el-form label-width="80px" class="form-header">
                    <div class="form-div">
                        <div class="header-form">
                            <el-form-item label="商品类型: ">
                                <el-select width="80px" class="comm-type">
                                    <el-option>全部</el-option>
                                    <el-option>系统课</el-option>
                                    <el-option>专项课</el-option>
                                    <el-option>拓展课</el-option>
                                    <el-option>会员</el-option>
                                </el-select>
                                <el-select></el-select>
                                <el-select></el-select>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="生成时间: ">
                                <el-date-picker style="width: 280px" clearable type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="关键字: ">
                                <el-select class="el-select-three">
                                    <el-option v-for="(val,key) in searchMode" :key="key" :label="val.content" :value="key"></el-option>
                                </el-select>
                                <el-input width="100px" class="input-seach"></el-input>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="支付时间: ">
                                <el-date-picker style="width: 280px" clearable type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="订单状态: ">
                               <el-select>
                                   <el-option v-for="(item, index) in orderStatusNode" :key="index" :value="index" :label="item"></el-option>
                               </el-select>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="支付来源: ">
                                <el-input></el-input>
                            </el-form-item>
                        </div>
                        <div class="header-form form-but">
                            <el-form-item>
                                <el-button>搜索</el-button>
                                <!-- <el-button>同步有赞订单</el-button> -->
                                <el-button>导出</el-button>
                            </el-form-item>

                        </div>
                    </div>

                </el-form>
                <!--        <el-button text="增加" @click="showAdd">增加</el-button>-->
                <!--        <SearchInput placeholder="请输入MU"-->
                <!--                     :change="(value)=>handleChange(value,'mu')"/>-->
                <!--        <SearchButton :click="search"/>-->
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column type="index" label="序号" width="80" />
                <el-table-column prop="title" label="订单号" />
                <el-table-column prop="title" label="用户名" />
                <el-table-column prop="title" label="手机号" />
                <el-table-column prop="title" label="商品类型" />
                <el-table-column prop="title" label="商品名称" />
                <el-table-column prop="title" label="规格 (课包)" />
                <el-table-column prop="title" label="订单状态" />
                <el-table-column prop="title" label="原价" />
                <el-table-column prop="title" label="优惠后价格" />
                <el-table-column prop="title" label="支付方式" />
                <el-table-column prop="title" label="支付时间" />
                <el-table-column prop="title" label="订单生成时间" />
                <el-table-column prop="title" label="来源" />
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <PlainButton text="退款" :click="()=>showUpdate(scope.row.mu)" />
                        <PlainButton text="删除" :click="()=>doDelete(scope.row.mu)" />
                    </template>
                </el-table-column>
            </el-table>
            <!-- <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" /> -->
        </el-main>
        <el-footer>
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
        </el-footer>
    </el-container>
</template>
<script>
import {
    // pagemx,
    removemx,
    addmx,
    updatemx
} from '@/chaos/functions/mixin/CRUD';

export default {
    name: 'orderSheet',
    mixins: [removemx, addmx, updatemx],
    data() {
        const rules = {
            title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
        };
        return {
            domain: 'haveGoods',
            rules,
            searchMode: {
                1: {
                    content: '手机号',
                    key: 'phone'
                },
                2: {
                    content: '用户名',
                    key: 'userName'
                },
                3: {
                    content: '宝宝姓名',
                    key: 'childName'
                }
            },
            orderStatusNode: {
                0: '全部',
                1: '待发货',
                2: '已完成',
                3: '已退款',
                4: '已取消',
            }
        };
    },
    created() {
        // this.search();
    },
    methods: {
        showAdd() {
            console.log(1);
            this.$router.push({
                name: 'createOreditor'
            });
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
    .form-div {
        display: flex;
        flex-wrap: wrap;
        .input-seach {
            margin-left: 5px;
        }
    }
}
.comm-type{
    width: 100px;
}
.el-input {
    width: 200px;
}

.el-select-three {
    width: 110px;
}
// .el-form-item__content{
//     display: flex;
//     flex-direction: row;
// }
</style>
