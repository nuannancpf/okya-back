<template>
    <el-main>
        <div class="header-main">
            <div class="header-h2">
                <h2>训练{{Number (nextTabMuIndex) + 1}}-上传可点击项</h2>
            </div>
            <p style="color: red">当前可点项总数{{cardNum1}}，可点项与干扰项之和需为30！</p>
            <el-container class="dialog-container">
                <div class="dialog-main" v-for="(item, index) in cardTypeList" :key="index" :value="item.mu">
                    <el-container class="dialog-main-one">
                        <div class="delectIcon" @click="deleteIcon(index)">
                            <i class="el-icon-close"></i>
                        </div>
                        <div class="main-heaer">
                            可点击项{{ index + 1 }}
                        </div>
                        <el-form :model="dialogForm" ref="dialogForm" label-width="auto">
                            <el-form-item label="图片: " :required="true">
                                <div @click="imageCardIndex(index)">

                                    <el-upload action="#" :show-file-list="false" :http-request="imageUrlUploadFile">
                                        <el-image v-if="item.imageUrl" :src="item.imageUrl" fit="scale-down" class="avatar avatar-uploader-icon">点击上传
                                        </el-image>
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="中文音频:" :required="true">
                                <el-radio-group v-model="item.audioType">
                                    <div class="c-radio">
                                        <el-radio :label="0">语音合成</el-radio>
                                    </div>
                                    <div class="c-radio">
                                        <el-radio :label="1">上传文件</el-radio>
                                    </div>
                                </el-radio-group>
                                <div @click="imageCardIndex(index)">
                                    <el-input type="textarea" v-model="item.title" v-if="item.audioType === 0" style="width: 190px" maxlength="20" placeholder="不超过20个字"></el-input>
                                    <el-upload action="#" :show-file-list="false" :http-request="audioUploadFile" v-if="item.audioType === 1">
                                        <el-input placeholder="请输入内容" v-model="item.audioUrl">
                                            <template slot="append">点击上传</template>
                                        </el-input>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="英文音频:" :required="true">
                                <el-radio-group v-model="item.enAudioType">
                                    <div class="c-radio">
                                        <el-radio :label="0">语音合成</el-radio>
                                    </div>
                                    <div class="c-radio">
                                        <el-radio :label="1">上传文件</el-radio>
                                    </div>
                                </el-radio-group>
                                <div @click="imageCardIndex(index)">
                                    <el-input type="textarea" v-model="item.enTitle" v-if="item.enAudioType === 0" style="width: 190px" maxlength="20" placeholder="不超过20个字"></el-input>
                                    <el-upload action="#" :show-file-list="false" :http-request="enAudioUploadFile" v-if="item.enAudioType === 1">
                                        <el-input placeholder="请输入内容" v-model="item.enAudioUrl">
                                            <template slot="append">点击上传</template>
                                        </el-input>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="出现次数:" :required="true">
                                <el-input v-model="item.times"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="cancelCard(index)">取消</el-button>
                                <el-button @click="clickAble(index)">确定</el-button>
                            </el-form-item>
                        </el-form>
                    </el-container>
                </div>
                <div class="icon-plus" @click="iconPlus">
                    <i class="el-icon-plus"></i>
                </div>
            </el-container>
            <div class="footer-but">
                <el-button @click="previousStep">上一步</el-button>
                <el-button @click="nextStep2">下一步</el-button>
            </div>
        </div>
    </el-main>

</template>
<script>
import Upload from '@/chaos/functions/common/Upload';
import { update, add, remove } from '@/chaos/functions/common/Data';
import { Loading } from 'element-ui';
export default {
    props: {
        cardTypeList: {
            type: Array
        },
        nextTabMuIndex: String,
        cardNum1: {
            type: Number
        },

        extremeMu: {
            type: String
        },
        cardExtreList: {
            type: Array
        },
        nextStep2: Function,
        previousStep: Function
    },
    data() {
        return {
            step: 1,
            activeKey: '0',
            dialogForm: {
                backgroundUrl: ''
            },
            cardTypeIndex: '',
            nextClick: ''
        };
    },
    methods: {
        imageCardIndex(index) {
            this.cardTypeIndex = index;
        },
        imageUrlUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme'
            })
                .then(result => {
                    this.cardTypeList[this.cardTypeIndex].imageUrl = result;
                    this.$set(
                        this.cardTypeList,
                        this.cardTypeIndex,
                        this.cardTypeList[this.cardTypeIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        audioUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.cardTypeList[this.cardTypeIndex].audioUrl = result;
                    this.$set(
                        this.cardTypeList,
                        this.cardTypeIndex,
                        this.cardTypeList[this.cardTypeIndex]
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
                direname: 'extreme',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.cardTypeList[this.cardTypeIndex].enAudioUrl = result;
                    this.$set(
                        this.cardTypeList,
                        this.cardTypeIndex,
                        this.cardTypeList[this.cardTypeIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        iconPlus(type) {
            let cardType = this.cardTypeList;
            let step = this.step;
            let len = this.cardTypeList.length;
            let cardTypeObj = {};
            if (!len || (len > 0 && cardType[len - 1].mu)) {
                switch (step) {
                    case 1:
                        cardTypeObj = {
                            imageUrl: '',
                            audioType: 0,
                            audioUrl: '',
                            enAudioType: 0,
                            enAudioUrl: '',
                            times: '',
                            cardType: 1,
                            title: '',
                            enTitle: ''
                        };
                        break;
                }
                cardType.push(cardTypeObj);
            } else {
                this.$message.error('请先完善前一张图片信息');
            }
        },
        cancelCard(index) {
            let cardTypes = this.cardTypeList;
            let copyCard = this.cardExtreList;
            if (cardTypes[index].mu) {
                cardTypes[index] = Object.assign({}, copyCard[index]);
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
                        cardTypes.splice(index, 1);
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
        async clickAble(index) {
            this.nextClick = index;
            let cardTypes = this.cardTypeList;
            let params = {};
            let regCh = /^[\u4e00-\u9fa5]+(\s*[\u4e00-\u9fa5]+)*$/,
                regEn = /^[a-zA-Z]+(\s*[a-zA-Z]+)*$/;
            if (!cardTypes[index].imageUrl) {
                this.$message.error('请上传图片');
                return false;
            }
            if (
                !cardTypes[index].audioType &&
                cardTypes[index].title &&
                !regCh.test(cardTypes[index].title)
            ) {
                this.$message.error('中文名称只能输入中文');
                return false;
            }
            if (
                !cardTypes[index].enAudioType &&
                cardTypes[index].enTitle &&
                !regEn.test(cardTypes[index].enTitle)
            ) {
                this.$message.error('中文名称只能输入中文');
                return false;
            }
            if (!cardTypes[index].times) {
                this.$message.error('请输入图片出现次数');
                return false;
            }
            let obj = {
                imageUrl: cardTypes[index].imageUrl,
                audioType: cardTypes[index].audioType,
                audioUrl: cardTypes[index].audioUrl,
                enAudioType: cardTypes[index].enAudioType,
                enAudioUrl: cardTypes[index].enAudioUrl,
                times: Number(cardTypes[index].times),
                title: cardTypes[index].title,
                enTitle: cardTypes[index].enTitle,
                cardType: cardTypes[index].cardType
            };
            let mu = cardTypes[index].mu;
            if (cardTypes[index].mu) {
                params = Object.assign({}, obj, { mu: cardTypes[index].mu });
                const res = await update('cognitive_click_option', mu, params);
                if (res) {
                    this.$emit('nextStep', cardTypes[index].cardType);
                }
            } else {
                params = Object.assign({}, obj, {
                    clickPracticeUnique: this.extremeMu
                });
                const res = await add('cognitive_click_option', params);
                if (res) {
                    this.$emit('nextStep', cardTypes[index].cardType);
                }
            }
        },
        deleteIcon(index) {
            let cardTypes = this.cardTypeList;
            let mu = cardTypes[index].mu;
            if (cardTypes[index].mu) {
                remove('cognitive_click_option', mu, () => {
                    this.$emit('nextStep', cardTypes[index].cardType);
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
                        cardTypes.splice(index, 1);
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
        }
    }
};
</script>
<style lang="less" scoped>
.el-form {
    width: auto;
}
.el-main {
    padding: 1px;
}
.header-main {
    .header-h2 {
        text-align: center;
        margin-bottom: 20px;
    }
    .dialog-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .dialog-main {
            width: 325px;
            height: 647px;
            display: inline-block;
            margin-bottom: 20px;
            .dialog-main-one {
                width: 325px;
                height: 647px;
                border: 1px solid #dbdbdb;
                border-radius: 8px;
                display: flex;
                flex-flow: column;
                position: relative;

                .main-heaer {
                    width: 100%;
                    font-size: 22px;
                    text-align: center;
                    margin: 10px 0 20px 0;
                }
                .div-form {
                    padding: 8px;
                }
                .delectIcon {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                }
            }
        }
    }
    .icon-plus {
        width: 325px;
        height: 647px;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        //margin-top: 20px;
        .el-icon-plus {
            font-size: 40px;
        }
    }
    .dialog-container:after {
        content: "";
        width: 325px;
        visibility: hidden;
    }
    .footer-but {
        width: 100%;
        margin-top: 30px;
        text-align: center;
    }
}
.el-input {
    width: auto;
}
.c-radio {
    height: 30px;
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
    height: 150px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    display: block;
}
</style>
