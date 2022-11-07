<template>
    <el-dialog title="卡片配置" :visible.sync="cardDetaVisible" :before-close="onClose" center width="1150px">
        <el-main>
            <el-container class="container">
                <div class="dialog-div" v-for="(item, index) in cardList" :key="index">
                    <el-form label-width="auto" class="dialog-main" :model="cardForm" style="border: 1px solid #dbdbdb; border-radius: 6px">
                        <div class="delectIcon" @click="deleteIcon(index)">
                            <i class="el-icon-close"></i>
                        </div>
                        <div class="header-h">
                            <h2>卡片名称{{index+1}}</h2>
                        </div>
                        <el-form-item label="卡片中文名称:" :required="true">
                            <el-input maxlength="8" v-model="item.title"></el-input>
                        </el-form-item>
                        <el-form-item label="卡片英文名称:" :required="true">
                            <el-input maxlength="26" v-model="item.enTitle"></el-input>
                        </el-form-item>
                        <el-form-item label="卡片中文音频:" class="caudio" :required="true">
                            <el-radio-group v-model="item.audioType">
                                <div class="c-radio">
                                    <el-radio :label="0">语音合成</el-radio>
                                </div>
                                <div class="c-radio">
                                    <el-radio :label="1">上传文件</el-radio>
                                </div>
                            </el-radio-group>
                            <div @click="cardAudioUrl(index)">
                                <el-upload action="#" :show-file-list="false" :http-request="audioUploadFile" v-if="item.audioType===1">
                                    <el-input placeholder="请输入内容" v-model="item.audioUrl">
                                        <template slot="append" class="append">点击上传</template>
                                    </el-input>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="卡片英文音频：" class="caudio" style="margin-left: 10px" :required="true">
                            <el-radio-group v-model="item.enAudioType">
                                <div class="c-radio">
                                    <el-radio :label="0">语音合成</el-radio>
                                </div>
                                <div class="c-radio">
                                    <el-radio :label="1">上传文件</el-radio>
                                </div>
                            </el-radio-group>
                            <div @click="cardAudioUrl(index)">
                                <el-upload action="#" :show-file-list="false" :http-request="enAudioUploadFile" v-if="item.enAudioType===1">
                                    <el-input placeholder="请输入内容" v-model="item.enAudioUrl">
                                        <template slot="append" class="append">点击上传</template>
                                    </el-input>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="上传图片: " :required="true">
                            <div @click="cardAudioUrl(index)">
                                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handleCover">
                                    <el-image v-if="item.imageUrl" :src="item.imageUrl" fit="scale-down" class="avatar avatar-uploader-icon"></el-image>
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <div class="form-but">
                            <el-button @click="cancelCard(index)">取消</el-button>
                            <el-button @click="cardSave(index)">确定</el-button>
                        </div>
                    </el-form>
                </div>
                <div class="icon-plus" @click="iconPlus">
                    <i class="el-icon-plus"></i>
                </div>
            </el-container>
        </el-main>

    </el-dialog>
</template>
<script>
import Upload from '@/chaos/functions/common/Upload';
import { update, add, remove } from '@/chaos/functions/common/Data';
import antiShake from '@/app/views/okya/cogniTiveCard/util';
export default {
    props: {
        cardDetaVisible: {
            type: Boolean,
            default: false
        },
        cardList: {
            type: Array
        },
        copyCards: {
            type: Array
        },
        cardMu: {
            type: String
        }
    },
    data() {
        return {
            cardIndex: '',
            cardForm: {}
        };
    },
    methods: {
        iconPlus(type) {
            let cards = this.cardList;
            let len = this.cardList.length;
            if (!len || (len > 0 && cards[len - 1].mu)) {
                cards.push({
                    title: '',
                    enTitle: '',
                    audioType: 0,
                    audioUrl: '',
                    enAudioType: 0,
                    enAudioUrl: '',
                    imageUrl: ''
                });
            } else {
                this.$message.error('请先完善前一张卡片信息');
            }
        },
        cardAudioUrl(index) {
            this.cardIndex = index;
        },
        audioUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'activitymanage',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.cardList[this.cardIndex].audioUrl = result;
                    this.$set(
                        this.cardList,
                        this.cardIndex,
                        this.cardList[this.cardIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        enAudioUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'activitymanage',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.cardList[this.cardIndex].enAudioUrl = result;
                    this.$set(
                        this.cardList,
                        this.cardIndex,
                        this.cardList[this.cardIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        handleCover(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'card'
            })
                .then(result => {
                    this.cardList[this.cardIndex].imageUrl = result;
                    this.$set(
                        this.cardList,
                        this.cardIndex,
                        this.cardList[this.cardIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        cardSave: antiShake(async function(index) {
            let cards = this.cardList;
            let params = {};
            let cognitiveCardPackageUnique = this.cardMu;
            let regEn = /^[a-zA-Z]+(\s*[a-zA-Z]+)*$/,
                regCh = /^[\u4e00-\u9fa5]+(\s*[\u4e00-\u9fa5]+)*$/;
            if (!cards[index].title) {
                this.$message.error('请输入卡片中文名称');
                return false;
            }
            if (!regCh.test(cards[index].title)) {
                this.$message.error('卡片中文名称只能输入中文');
                return false;
            }
            if (!cards[index].enTitle) {
                this.$message.error('请输入卡片英文名称');
                return false;
            }
            if (!regEn.test(cards[index].enTitle)) {
                this.$message.error('卡片英文名称只能输入英文');
                return false;
            }
            if (cards[index].audioType && !cards[index].audioUrl) {
                this.$message.error('请上传卡片中文音频');
                return false;
            }
            if (cards[index].enAudioType && !cards[index].enAudioUrl) {
                this.$message.error('请上传卡片英文音频');
                return false;
            }
            if (!cards[index].imageUrl) {
                this.$message.error('请上传卡片图片');
                return false;
            }
            let obj = {
                title: cards[index].title,
                enTitle: cards[index].enTitle,
                audioType: cards[index].audioType,
                audioUrl: cards[index].audioUrl,
                enAudioType: cards[index].enAudioType,
                enAudioUrl: cards[index].enAudioUrl,
                imageUrl: cards[index].imageUrl
            };
            let mu = cards[index].mu;
            if (cards[index].mu) {
                params = Object.assign({}, obj);
                const res = await update('cognitive_card', mu, params);
                if (res) {
                    this.$emit('cardDeta', this.cardMu);
                }
            } else {
                params = Object.assign({}, obj, { cognitiveCardPackageUnique });
                this.loading = true;
                const res = await add('cognitive_card', params);
                if (res) {
                    this.$emit('cardDeta', this.cardMu);
                    this.loading = false;
                }
            }
        }),

        cancelCard(index) {
            let cards = this.cardList;
            let copyCard = this.copyCards;
            if (cards[index].mu) {
                cards[index] = Object.assign({}, copyCard[index]);
            } else {
                this.$confirm(
                    '问题删除后所有内容不做保持，确定删除此问题吗?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }
                )
                    .then(() => {
                        cards.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            }
        },
        deleteIcon(index) {
            let cards = this.cardList;
            let mu = cards[index].mu;
            if (cards[index].mu) {
                remove('cognitive_card', mu, () => {
                    this.$emit('cardDeta', this.cardMu);
                });
            } else {
                this.$confirm(
                    '问题删除后所有内容不做保持，确定删除此问题吗?',
                    '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }
                )
                    .then(() => {
                        cards.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
            }
        },
        onClose() {
            this.$emit('close');
        }
    }
};
</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .dialog-div {
        width: 335px;
        height: 675px;
        margin-bottom: 15px;
        display: inline-block;
        .dialog-main {
            width: 335px;
            height: 675px;
            border: 1px solid #dbdbdb;
            border-radius: 8px;
            margin-right: 10px;
            position: relative;
            .header-h {
                width: 100%;
                text-align: center;
                margin: 10px 0 10px 0;
            }
            .delectIcon {
                position: absolute;
                top: 5px;
                right: 5px;
                font-size: 22px;
            }
        }
        .form-but {
            text-align: center;
            margin-bottom: 10px;
        }
    }
    .el-dialog--center .el-dialog__body {
        padding: 5px;
    }
    .icon-plus {
        width: 345px;
        height: 675px;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-icon-plus {
            font-size: 40px;
        }
    }
    .el-form {
        width: 100%;
        padding: 0 5px 0 5px;
    }
}
.container:after {
    content: "";
    width: 30%;
    height: 0px;
    background-color: #15bb33;
    visibility: hidden;
}
.caudio {
    .c-radio {
        height: 30px;
    }
    .caudio > .el-form-item__content {
        line-height: 30px;
    }
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
