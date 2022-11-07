<template>
    <el-container>
        <el-header>
            <el-container>
                <PrimaryButton text="新建卡包" :click="showAdds" />
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column type="index" label="顺序" />
                <el-table-column prop="title" label="卡包名称" />
                <el-table-column prop="cardCount" label="卡片数量" />
                <el-table-column prop="isPublish" label="上架情况">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isPublish === 0">已下架</span>
                        <span v-if="scope.row.isPublish === 1">已上架</span>
                    </template>
                </el-table-column>
                <el-table-column prop="zipStatus" label="打包状态">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.zipStatus ===0">{{ ZipStatus[scope.row.zipStatus] }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.zipStatus ===1">{{ ZipStatus[scope.row.zipStatus] }}</el-tag>
                        <el-tag type="success" v-if="scope.row.zipStatus ===2">{{ ZipStatus[scope.row.zipStatus] }}</el-tag>
                        <el-tag type="info" v-if="scope.row.zipStatus ===3">{{ ZipStatus[scope.row.zipStatus] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showUpdates(scope.row.mu)">编辑</el-button>
                        <el-button type="text" v-if="scope.row.recommend === 0" @click="recomMended(scope.row.mu, 1)">推荐</el-button>
                        <el-button type="text" v-if="scope.row.recommend === 1" @click="recomMended(scope.row.mu, 0)">取消推荐</el-button>
                        <el-button type="text" v-if="scope.row.isPublish === 0" :value="1" @click="standUpDown(scope.row.mu,1)">上架</el-button>
                        <el-button type="text" v-if="scope.row.isPublish === 1" :disabled="scope.row.zipStatus == 0" :value="0" @click="standUpDown(scope.row.mu,0)">下架</el-button>
                        <el-button type="text" @click="packagIng(scope.row.mu)">打包</el-button>
                        <el-button type="text" class="el-icon-top" :disabled="disabled(scope.$index)" @click="moveOnDown(scope.row.mu, 1)"></el-button>
                        <el-button type="text" class="el-icon-bottom" :disabled="bdisabled(scope)" @click="moveOnDown(scope.row.mu, 2)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>
    </el-container>
</template>
<script>
import {
    pagemx,
} from '@/chaos/functions/mixin/CRUD';
import { rainBowPage, query } from '@/chaos/functions/common/Data';

export default {
    name: 'cogniTiveCard',
    mixins: [pagemx],
    data() {
        const rules = {
            title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
        };
        return {
            domain: 'cognitive_card_package',
            rules,
            tableData: [],
            cognitVisible: false,
            form: {
                enTitle: '',
                isPublish: 1,
                title: '',
                coverUrl: '',
                backgroundUrl: ''
            },
            ZipStatus: {
                0: '未打包',
                1: '打包中',
                2: '打包成功',
                3: '打包失败'
            }
        };
    },
    created() {
        this.cogniList();
    },
    activated() {
        this.cogniList();
    },
    methods: {
        async cogniList(index) {
            let param = {};
            let res;
            res = await rainBowPage(
                'cognitive_card_package/page',
                (this.currentPage = index),
                this.limit,
                param
            );
            this.tableData = res.list;
            this.total = res.total;
        },
        showAdds() {
            this.$router.push({
                name: 'new-cognitive',
                params: { satue: 0 }
            });
        },
        showUpdates(mu) {
            this.$router.push({
                name: 'new-cognitive',
                params: { mu, satue: 1 }
            });
        },
        async packagIng(mu) {
            // 打包
            let checkRes = await query('cognitive_card_package/checkResource', {
                mu
            });
            if (checkRes != true) {
                return false;
            } else {
                await this.updatePackageZipFileUrl(mu);
            }
        },
        async updatePackageZipFileUrl(mu) {
            // 更新打包状态为，打包中
            let staRes = await query(
                'cognitive_card_package/updateManagePackageZipFileUrl',
                { cognitiveCardPackageId: mu, zipStatus: 1 }
            );
            if (staRes != true) {
                return false;
            } else {
                this.cogniList(this.currentPage);
                await this.baleCognitiveCard(mu);
            }
        },
        async baleCognitiveCard(mu) {
            const res = await query(
                'cognitive_card_package/baleCognitiveCardPackageResourceFilesFromUrl',
                { courseLessonId: mu }
            );
            if (res) {
                this.cogniList(this.currentPage);
            }
        },
        async recomMended(mu, pushType) {
            const res = await query('cognitive_card_package/recommend', {
                mu,
                pushType
            });
            if (res) {
                this.cogniList();
            }
        },
        disabled(index) {
            return this.currentPage === 1 && index === 0;
        },
        bdisabled({ $index }) {
            return (
                $index + 1 === this.tableData.length &&
                Math.ceil(this.total / this.limit) === this.currentPage
            );
        },
        async moveOnDown(mu, type) {
            // 上下移
            const res = await query('cognitive_card_package/upperAndLower', {
                mu,
                operationType: type
            });
            if (res) {
                this.cogniList();
            }
        },
        async standUpDown(mu, type) {
            // 上下架
            let isPublish = type;
            const res = await query('cognitive_card_package/updatePublish', {
                mu,
                isPublish
            });
            if (res) {
                this.cogniList();
            }
        }
    },
};
</script>
<style lang="less" scoped>
.el-form {
    width: 500px;
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
        border: 1px dashed #d9d9d9;
    }
    .avatar {
        width: 178px;
        height: 178px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        display: block;
    }
}
</style>
