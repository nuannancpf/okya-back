<template>
    <el-container>
        <el-header>
            <div class="el-icon-arrow-left" @click="iconArrow">
                <span>{{this.satue === 1 ? '编辑卡包' : '新建卡包'}}</span>
            </div>
        </el-header>
        <el-main>
            <el-form ref="form" :model="form" label-width="auto">
                <el-form-item label="卡包中文名称:" :required="true">
                    <el-input maxlength="8" v-model="form.title" />
                </el-form-item>
                <el-form-item label="卡包英文名称: " :required="true">
                    <el-input maxlength="26" v-model="form.enTitle" />
                </el-form-item>
                <el-form-item label="是否上架: " :required="true">
                    <el-radio-group v-model="form.isPublish" :show-file-list="false">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="首页封面:" :required="true">
                    <el-upload class="avatar-uploader" action="#" accept=".jpg,.png" :show-file-list="false" :http-request="handleHttpHome">
                        <el-image v-if="form.homeImg" :src="form.homeImg" fit="scale-down" class="avatar avatar-uploader-icon"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="上传封面: " :required="true">
                    <el-upload class="avatar-uploader" action="#" accept=".jpg,.png" :show-file-list="false" :http-request="handleHttpCover">
                        <el-image v-if="form.coverUrl" :src="form.coverUrl" fit="scale-down" class="avatar avatar-uploader-icon"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="上传卡片背景: ">
                    <el-upload class="avatar-uploader" action="#" accept=".jpg,.png" :show-file-list="false" :http-request="handleHttpBackGroun">
                        <el-image v-if="form.backgroundUrl" :src="form.backgroundUrl" fit="scale-down" class="avatar avatar-uploader-icon"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <div v-if="satue === 1">
                    <el-form-item label="卡片配置:" :required="true">
                        <el-tag effect="plain" @click="cardDeta(mu)">详情</el-tag>
                    </el-form-item>
                    <el-form-item label="选择题配置:" :required="true">
                        <el-tag effect="plain" @click="chooseTop(mu)">详情</el-tag>
                    </el-form-item>
                    <el-form-item label="极速点击配置:" :required="true">
                        <el-tag effect="plain" @click="extReme(mu, '')">详情</el-tag>
                    </el-form-item>
                </div>

                <el-form-item>
                    <el-button text="确定" @click="doAdds">确定</el-button>

                </el-form-item>
            </el-form>
        </el-main>
        <Card :cardDetaVisible="cardDetaVisible" @close="cardDetaVisible = false" @cardDeta="cardDeta" :cardList="cardList" :copyCards="copyCards" :cardMu="mu" ref="cardListForm"></Card>
        <Choose :chooseVisible="chooseVisible" @close="chooseVisible = false" :chooseMu="mu" ref="chooseRef"></Choose>
        <Extreme ref="extremeRef" :extremeeVisible="extremeeVisible" @close="extremeeVisible = false" @extReme="extReme" :extList="extList" :copyCardList="copyCards" @extreVis="extreVis" :extMu="extMu"></Extreme>
    </el-container>
</template>
<script>
import Upload from '@/chaos/functions/common/Upload';
import { one, list, add, update } from '@/chaos/functions/common/Data';
// import {
//     addmx,
//     updatemx
// } from '@/chaos/functions/mixin/CRUD';
import Card from '@/app/views/okya/cogniTiveCard/card';
import Choose from '@/app/views/okya/cogniTiveCard/choose';
import Extreme from '@/app/views/okya/cogniTiveCard/extreme';
import { Loading } from 'element-ui';
export default {
    props: {
        cognitVisible: {
            type: Boolean,
            default: false
        }
    },
    // mixins: [ addmx, updatemx],
    data() {
        return {
            domain: 'cognitive_card_package',
            form: {
                enTitle: '',
                isPublish: 0,
                title: '',
                homeImg: '',
                coverUrl: '',
                backgroundUrl: ''
            },
            mu: this.$route.params.mu,
            satue: this.$route.params.satue,
            extMu: '',
            cardList: [],
            extList: [],
            clickList: [],
            cardPackList: [],
            copyCards: [],
            cardDetaVisible: false,
            chooseVisible: false,
            extremeeVisible: false,
            cardNum1: 0, // 可点项之和
            cardNum2: 0, // 干扰项之和
            extremeTab: ''
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            if (this.satue == 1) {
                let mu = this.mu;
                let res = await one('cognitive_card_package', mu);
                this.form.enTitle = res.enTitle;
                this.form.isPublish = res.isPublish;
                this.form.title = res.title;
                this.form.homeImg = res.homeImg;
                this.form.coverUrl = res.coverUrl;
                this.form.backgroundUrl = res.backgroundUrl;
            } else {
                this.form.enTitle = '';
                this.form.isPublish = 0;
                this.form.title = '';
                this.form.homeImg = '';
                this.form.coverUrl = '';
                this.form.backgroundUrl = '';
            }
        },
        handleHttpHome(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'cognitivecard'
            })
                .then(result => {
                    this.form.homeImg = result;
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        handleHttpCover(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'cognitivecard'
            })
                .then(result => {
                    this.form.coverUrl = result;
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        handleHttpBackGroun(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'cognitivecard'
            })
                .then(result => {
                    this.form.backgroundUrl = result;
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        async cardDeta(cognitiveCardPackageUnique) {
            // 卡片配置
            let loadingInstance = Loading.service();
            let res = await list('cognitive_card', {
                cognitiveCardPackageUnique
            });
            let data = res;
            this.copyCards = JSON.parse(JSON.stringify(data));
            this.cardList = data;
            loadingInstance.close();
            this.cardDetaVisible = true;
        },
        async chooseTop(cognitiveCardPackageUnique) {
            // 选择题配置
            this.$refs.chooseRef.initChoose(cognitiveCardPackageUnique);
            this.chooseVisible = true;
        },
        async extReme(cognitiveCardPackageUnique) {
            let loadingInstance = Loading.service();
            let res = await list('cognitive_click_practice', {
                cognitiveCardPackageUnique
            });
            let data = res;
            this.copyCards = JSON.parse(JSON.stringify(data));
            this.extList = data;
            this.extMu = cognitiveCardPackageUnique;
            this.extremeeVisible = true;
            loadingInstance.close();
        },
        extreVis() {
            this.extremeeVisible = false;
        },
        onClose() {
            this.$emit('close');
        },
        doAdds() {
            const obj = this.form;
            if (!obj.title) {
                this.$message.error('请输入卡包中文名称');
                return false;
            }
            if (!/^[\u4e00-\u9fa5]+(\s*[\u4e00-\u9fa5]+)*$/.test(obj.title)) {
                this.$message.error('卡包中文名称只能输入中文');
                return false;
            }
            if (!obj.enTitle) {
                this.$message.error('请输入卡包英文名称');
                return false;
            }
            if (!/^[a-zA-Z]+(\s*[a-zA-Z]+)*$/.test(obj.enTitle)) {
                this.$message.error('卡包英文名称只能输入英文');
                return false;
            }
            if (!obj.homeImg) {
                this.$message.error('请上传首页封面');
                return false;
            }
            if (!obj.coverUrl) {
                this.$message.error('请上传封面');
                return false;
            }
            if (this.satue === 0) {
                const res = add(this.domain, obj);
                if (res) {
                    this.$router.go(-1);
                }
            } else if (this.satue === 1) {
                const res = update(this.domain, this.mu, obj);
                if (res) {
                    this.$router.go(-1);
                }
            }
        },
        iconArrow() {
            this.$router.push({
                name: 'cognitivecard'
            });
        }
    },
    components: {
        Card,
        Choose,
        Extreme
    }
};
</script>

<style lang="less" scoped>
.el-icon-arrow-left {
    font-size: 22px;
    cursor: pointer;
}
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
</style>
