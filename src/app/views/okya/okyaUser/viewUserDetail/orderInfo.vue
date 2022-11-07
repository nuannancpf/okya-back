<template>
    <el-container>
        <el-main>
            <el-tabs type="card" v-model="orderTabNmae" @tab-click="heandleClick">
                <el-tab-pane label="订单" name="1">
                    <el-table :data="tableData">
                        <el-table-column label="订单号" prop="orderCode"></el-table-column>
                        <el-table-column label="商品类型" prop="itemType">
                            <template slot-scope="scope">
                                <span>{{ItemType[scope.row.itemType]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品名称" prop="itemTitle"></el-table-column>
                        <el-table-column label="商品规格(课包)"></el-table-column>
                        <el-table-column label="订单状态" prop="state">
                            <template slot-scope="scope">
                                <span>{{StateOrder[scope.row.state]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="原价" prop="originalPrice">
                            <template slot-scope="scope">
                                <span>{{scope.row.originalPrice/100}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="优惠后价格" prop="cost">
                            <template slot-scope="scope">
                                {{scope.row.cost / 100}}
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式" prop="payWay">
                            <template slot-scope="scope">
                                <span>{{Payway[scope.row.payWay]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付时间" prop="payTime"></el-table-column>
                        <el-table-column label="订单生成时间" prop="createDate"></el-table-column>
                        <el-table-column label="来源" prop="platformType">
                            <template slot-scope="scope">
                                <span>{{PlatFormType[scope.row.platformType]}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
                </el-tab-pane>
                <el-tab-pane label="积分商城订单" name="2">
                    <el-table :data="IntegralData">
                        <el-table-column label="订单编号" prop="orderCode"></el-table-column>
                        <el-table-column label="商品名称" prop="shopName"></el-table-column>
                        <el-table-column label="消耗积分" prop="totalIntegral">
                            <template slot-scope="scope">
                                {{scope.row.totalIntegral / 100}}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单总额" prop="cost">
                            <template slot-scope="scope">
                                {{scope.row.cost / 100}}
                            </template>
                        </el-table-column>
                        <el-table-column label="订单时间" prop="createTime"></el-table-column>
                        <el-table-column label="订单状态" prop="state">
                            <template slot-scope="scope">
                                <span>{{StateInter[scope.row.state]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="用戶名称" prop="name"></el-table-column>
                        <el-table-column label="联系方式" prop="phone"></el-table-column>
                        <el-table-column label="收货地址" prop="receiverAddress"></el-table-column>
                    </el-table>
                    <SearchPagination :currentPage="IntegralcurrentPage" :total="Integraltotal" :limit="Integrallimit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
                </el-tab-pane>
                <el-tab-pane label="兑换码订单" name="3">
                    <el-table :data="MarketingData">
                        <el-table-column label="兑换码包ID" prop="codeId"></el-table-column>
                        <el-table-column label="兑换码包名称" prop="codePackageName"></el-table-column>
                        <el-table-column label="内容" prop="content"></el-table-column>
                        <el-table-column label="商品类型" prop="exchangeType">
                            <template slot-scope="scope">
                                <span>{{ExchangeType[scope.row.exchangeType]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="兑换码号" prop="codeName"></el-table-column>
                        <el-table-column label="兑换时间" prop="exchangeTime"></el-table-column>
                        <el-table-column label="发放渠道" prop="sendChannel">
                            <template slot-scope="scope">
                                <span>{{SendChannel[scope.row.sendChannel] || '其他'}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <SearchPagination :currentPage="MarketingcurrentPage" :total="Marketingtotal" :limit="Marketinglimit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>
</template>

<script>
import { page, search } from '@/chaos/functions/common/Data';
import {
    removemx,
    addmx,
    updatemx
} from '@/chaos/functions/mixin/CRUD';
import formatStamp from '@/app/tools/dateTimeUtil';
export default {
    props: {
        mu: String,
    },
    mixins: [removemx, addmx, updatemx],
    data() {
        return {
            tableData: [], // 订单
            IntegralData: [], // 积分商城订单
            MarketingData: [], // 兑换码订单
            orderTabNmae: '1',
            Integraltotal: 0,
            Integrallimit: 20,
            IntegralcurrentPage: 1,
            Marketingtotal: 0,
            Marketinglimit: 20,
            MarketingcurrentPage: 1,
            currentPage: 1,
            limit: 20,
            total: 0,
            ItemType: {
                1: 'Okya核心课',
                2: 'Okya成长频道',
                3: '七田真vip购买',
                4: 'Okya ai体验课',
                5: 'AI系统课'
            },
            PlatFormType: {
                0: 'okya',
                1: '七田真',
                8: '各种渠道'
            },
            ExchangeType: {
                1: '核心课',
                2: '拓展',
                4: 'AI体验课',
                5: 'AI系统课'
            },
            StateOrder: {
                0: '未支付',
                1: '已支付',
                2: '已发货',
                3: '已完成',
                4: '申请退款',
                5: '退款中',
                6: '已退款',
                7: '已失效'
            },
            StateInter: {
                0: '未支付',
                1: '已支付',
                2: '部分发货',
                3: '已发货',
                4: '部分退款',
                5: '已退款',
                7: '已失效'
            },
            StateList: {
                0: '未支付',
                1: '已支付',
                2: '已发货',
                3: '已完成',
                4: '申请退款',
                5: '退款中',
                6: '已退款',
                7: '已失效'
            },
            Payway: {
                0: '0元付',
                1: '微信',
                2: '支付宝',
                3: '苹果支付',
                4: '华为支付'
            },
            SendChannel: {
                10: '天猫',
                11: '京东',
                12: '淘宝',
                13: '有赞',
                14: '公众号',
                15: '七田真',
                16: '微商',
                17: '优选',
                18: '其他'
            }
        };
    },
    mounted() {
        this.orderInform();
    },
    methods: {
        async orderInform() {
            let res = await page('okya_order', this.currentPage, this.limit, {
                userUnique: this.$store.state.global.data.userDetailMu
            });
            
            this.tableData = res.list;
            this.total = res.total;
        },
        async heandleClick(tab, event) {
            this.orderTabNmae = tab.name;
            switch (this.orderTabNmae) {
                case '1':
                    await this.orderInform();
                    break;
                case '2':
                    await this.IntegralOrder();
                    break;
                case '3':
                    await this.MarketingOrder();
                    break;
                default:
                    break;
            }
        },
        async IntegralOrder() {
            // 积分商城订单
            let res = await search(
                'okyaIntegralOrder/getPage',
                this.IntegralcurrentPage,
                this.Integrallimit,
                { userId: this.$store.state.global.data.userDetailMu }
            );
            this.IntegralData = res.list;
            this.Integraltotal = res.total;
        },
        async MarketingOrder() {
            let res = await search(
                'okyaMarketingCode/getPage',
                this.MarketingcurrentPage,
                this.Marketinglimit,
                { userId: this.$store.state.global.data.userDetailMu }
            );
            this.MarketingData = res.list;
            this.MarketingData.forEach(order => {
                order.exchangeTime = formatStamp(order.exchangeTime);
            });
            this.Marketingtotal = res.total;
        },
        handleCurrentChange(currentPage) {
            switch (this.orderTabNmae) {
                case '1':
                    this.currentPage = currentPage;
                    this.orderInform();
                    break;
                case '2':
                    this.IntegralcurrentPage = currentPage;
                    this.IntegralOrder();
                    break;
                case '3':
                    this.MarketingcurrentPage = currentPage;
                    this.MarketingOrder();
                    break;
                default:
                    break;
            }
        },
        handleSizeChange(limit) {
            this.limit = limit;
            switch (this.orderTabNmae) {
                case '1':
                    this.limit = limit;
                    this.currentPage = 1;
                    this.orderInform();
                    break;
                case '2':
                    this.Integrallimit = limit;
                    this.IntegralcurrentPage = 1;
                    this.IntegralOrder();
                    break;
                case '3':
                    this.Marketinglimit = limit;
                    this.MarketingcurrentPage = 1;
                    this.MarketingOrder();
                    break;
                default:
                    break;
            }
        }
    }
};
</script>

<style lang="less" scoped></style>
