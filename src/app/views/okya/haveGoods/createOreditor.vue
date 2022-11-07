<template>
    <el-container>
        <el-header>
            <el-page-header @back="iconArrow" :content="youzanType === 1 ? '创建有赞商品' : '编辑有赞商品'">
            </el-page-header>
        </el-header>
        <el-main>
            <el-form label-width="auto" width="auto" ref="haveForm" :model="data" :rules="rules">
                <el-form-item label="商品名称:" :required="true">
                    <el-input class="form-input" placeholder="请输入商品名称" v-model="data.title"></el-input>
                </el-form-item>
                <el-form-item label="有赞商品ID:" :required="true">
                    <el-input class="form-input" maxlength="30" placeholder="请输入有赞商品ID" v-model="data.youzanGoodsId"></el-input>
                </el-form-item>
                <el-form-item label="关联课程 (会员):" class="class-package" v-if="youzanType === 1" :required="true">
                    <div v-for="(item, index) in greatList" :key="index" class="course-package">
                        <span >商品{{Number(index)+1}}</span>
                        <el-select v-model="item.itemType" :disabled='disabled' class="package-select" @change="youzanLessonName($event,index)">
                            <el-option v-for="(item, key) in greatData" :key="key" :value="key" :label="item.name"></el-option>
                        </el-select>
                        <!-- 成长频道/ 会员(vip) -->
                        <el-select v-if="Number(greatData[item.itemType])  !== 3  && Object.keys(greatData[Number(3)].child).length || Number(greatData[item.itemType]) !== 2  && Object.keys(greatData[Number(2)].child).length" v-model="item.itemId" class="package-select  packe" @change="youzanCoursePackageName(index)">
                            <el-option v-for="(item, key) in greatData[item.itemType].child" :key="key" :value="key" :label="item.name"></el-option>
                        </el-select>

                        <el-select v-else-if="Number(greatData[item.itemType])  !== 1  && Object.keys(greatData[Number(1)].child).length || Number(greatData[item.itemType]) !== 4  && Object.keys(greatData[Number(4)].child).length" v-model="item.lessonName" class="package-select" @change="youzanCoursePackageName(index)">
                            <el-option v-for="(item, key) in greatData[item.itemType].child" :key="key" :value="key" :label="item.name"></el-option>
                        </el-select>
                        
                        <el-select v-if="greatData[item.itemType] && greatData[item.itemType].child[item.lessonName] && Object.keys(greatData[item.itemType].child[item.lessonName].child).length" v-model="item.itemId" class="package-select">
                            <el-option v-for="(item, key) in greatData[item.itemType].child[item.lessonName].child" :key="key" :value="key" :label="item.name"></el-option>
                        </el-select>
                        <el-button @click="deleteGreat(index)" class="package-select">删除</el-button>
                    </div>
                    <el-button @click="createIcr" class="package-but-ceart">增加</el-button>
                </el-form-item>
                <el-form-item label="是否上架:">
                    <el-radio-group v-model="data.status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品备注:">
                    <el-input class="form-input" placeholder="请输入内容" v-model="data.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <!-- @click="saveYouzan" -->
                    <el-button @click="dialogVisible = true">保存</el-button>
                    <el-button @click="iconArrow">取消</el-button>
                </el-form-item>
            </el-form>
        </el-main>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="onClose">
            <div class="dialog-title">
                <span>创建后关联课包不可更改，是否确认?</span>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveYouzan">确 定</el-button>
            </span>
        </el-dialog>
    </el-container>

</template>
<script>
import {
    updatemx
} from '@/chaos/functions/mixin/CRUD';
import { submit, query } from '@/chaos/functions/common/Data';
export default {
    props: {
        haveVisible: {
            type: Boolean,
            default: false
        }
    },
    mixins: [updatemx],

    data() {
        return {
            domain: 'youzanGoodsResouce',
            youzanGoodsId: this.$store.state.global.data.youzanGoodsId,
            youzanType: this.$store.state.global.data.youzanType,
            greatData: {},
            dialogVisible: false,
            greatList: [{
                itemType: '',
                lessonName: '',
                itemId: '',

                itemTypeBlo: true,

                lessonNameBlo: false,
                itemIdBlo: false,
            }],
            alType: '',
            enType: '',
            chType: '',
            itemType: '',
            lessonName: '',
            itemId: '',
            data: {
                title: '',
                youzanGoodsId: '',
                status: 1,
                remark: '',
                coursePackageList: [],
            },
            disabled: false,
            indexId: '',
            youzanMu: '',
            eventType: '',
        };
    },
    mounted() {
        this.youzanGoodsResouceEditor();
        console.log(this.greatData, '这是关联课包');
    },
    methods: {
        async youzanGoodsResouceEditor() {
            let youzanGoodsId = this.youzanGoodsId;
            if (this.youzanType === 2) {
                let res = await query('youzanGoodsResouce/one', { youzanGoodsId });
                this.data.title = res.title;
                this.data.youzanGoodsId = res.youzanGoodsId;
                this.data.status = res.status;
                this.data.remark = res.remark;
                this.youzanMu = res.mu;
            } else {
                this.youzanCourse();
            }
        },
        async youzanCourse() {
            (await query('youzanGoodsResouce/courseTypeInfo')).forEach(item => {
                this.$set(this.greatData, item.id, {});
                this.greatData[item.id].name = item.name;
                this.$set(this.greatData[item.id], 'child', {});
            });

        },
        async youzanLessonName(event, index) {
            console.log(index, '只是?', event);
            this.greatList[index].lessonName = '';
            this.greatList[index].itemId = '';
            this.greatList[index].itemTypeBlo = true;
            this.greatList[index].lessonNameBlo = false;
            this.greatList[index].itemIdBlo = false;
            let objItem = this.greatData[this.greatList[index].itemType].child;
            if (Object.keys(objItem).length === 0) {
                // (await query('youzanGoodsResouce/packageInfo', { id: this.greatList[index].itemType })).forEach(item => {
                //     console.log(item, '课程信息');
                //     this.$set(objItem, item.id, {});
                //     objItem[item.id].name = item.name;
                //     this.$set(objItem[item.id], 'child', {});
                // });
                if (Number(this.greatList[index].itemType)  === 3 || Number(this.greatList[index].itemType)  === 2) {
                    console.log('123');
                    (await query('youzanGoodsResouce/courseInfo', { id: this.greatList[index].itemType })).forEach(item => {
                        this.$set(objItem, item.id, {});
                        objItem[item.id].name = item.name;
                        this.$set(objItem[item.id], 'child', {});
                    });
                } else {
                    (await query('youzanGoodsResouce/courseInfo', { id: this.greatList[index].itemType })).forEach(item => {
                        this.$set(objItem, item.id, {});
                        objItem[item.id].name = item.name;
                        this.$set(objItem[item.id], 'child', {});
                    });
                }
            }
            if (Object.keys(objItem).length !== 0) {
                this.greatList[index].lessonNameBlo = true;
            }
        },
        async youzanCoursePackageName(index) {
            console.log(index, '这是?',this.greatList[index].itemType);
            this.greatList[index].itemId = '';
            this.greatList[index].itemTypeBlo = true;
            this.greatList[index].lessonNameBlo = true;
            this.greatList[index].itemIdBlo = false;
            let objitem = this.greatData[this.greatList[index].itemType].child[this.greatList[index].lessonName].child;
            if (Object.keys(objitem).length === 0) {
                (await query('youzanGoodsResouce/packageInfo', { id: this.greatList[index].lessonName })).forEach(item => {
                    this.$set(objitem, item.id, {});
                    objitem[item.id].name = item.name;
                    this.$set(objitem[item.id], 'child', {});
                });
            }
            if (Object.keys(objitem).length !== 0) {
                this.greatList[index].itemIdBlo = true;
            }
        },
        createIcr() {
            let great = this.greatList;
            let greatObj = {};
            greatObj = {
                itemType: '',
                lessonName: '',
                itemId: '',
                itemIdBlo: false,
                lessonNameBlo: false,
                itemTypeBlo: true,
            };
            great.push(greatObj);
        },
        deleteGreat(index) {
            let great = this.greatList;
            if (great[index].mu) {
                console.log('删除');
            } else {
                great.splice(index, 1);
            }
        },
        async saveYouzan() {   // 保存

            let great = this.greatList;
            let paramsData = this.data;
            let params = {};
            if (!paramsData.title) {
                this.$message.error('请输入商品名称');
                return false;
            }
            if (!paramsData.youzanGoodsId) {
                this.$message.error('请输入有赞商品id');
                return false;
            }
            if (!/^[A-Za-z0-9]*$/.test(paramsData.youzanGoodsId)) {
                this.$message.error('有赞商品id只能输入数字和英文');
                return false;
            }
            for (let i = 0; i < great.length; i++) {
                console.log(i, '这是什么?');
                if (this.youzanType === 1 && great[i].itemTypeBlo === true) {
                    if (!great[i].itemType) {
                        this.$message.error('请选择课程类型');
                        return false;
                    }

                }
                if (this.youzanType === 1 && great[i].lessonNameBlo === true) {
                    if (!great[i].lessonName) {
                        this.$message.error('请选择课程');
                        return false;
                    }
                }
                if (this.youzanType === 1 && great[i].itemIdBlo === true) {
                    if (!great[i].itemId) {
                        this.$message.error('请选择课包');
                        return false;
                    }
                }
            }
            paramsData.coursePackageList = great;
            params = Object.assign(paramsData);
            console.log(params);
            this.dialogVisible = true;
            if (this.youzanType === 1) {
                let data = await submit('youzanGoodsResouce/create', params);
                console.log(data);
            } else if (this.youzanType === 2) {
                let res = await submit('youzanGoodsResouce/update', { mu: this.youzanMu, data: params });
                console.log(res);
            }
            this.$router.go(-1);
        },
        iconArrow() {
            this.$router.push({
                name: 'have-goods'
            });
        },
        onClose() {
            this.dialogVisible = false;
        }
    }
};
</script>
<style lang="less" scoped>
.el-icon-arrow-left {
    font-size: 22px;
    cursor: pointer;
}
.el-form {
    width: auto;
}
.form-input {
    width: 800px;
}
.class-package {
    overflow: hidden;
    .course-package {
        margin-bottom: 10px;
    }
    .package-select {
        margin-left: 10px;
    }
    .package-but-ceart {
        margin-top: 15px;
    }
}
// .el-dialog__body{
//     text-align: center;
// }
.dialog-title {
    text-align: center;
    font-size: 18px;
}
</style>
