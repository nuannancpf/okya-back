<template>
    <el-main>
        <div class="header-main">
            <div class="header-h2">
                <h2>训练{{Number(tabMuIndex)+1}}-上传干扰项</h2>
            </div>
            <p style="color: red">当前干扰项总数{{cardNum2}}，可点项与干扰项之和需为30！</p>
            <el-container class="dialog-container">
                <div class="dialog-main" v-for="(item, index) in cardTypeList" :key="index" :value="item.mu">
                    <el-container class="dialog-main-one">
                        <div class="deleteIcon" @click="deleteIcon(index)">
                            <i class="el-icon-close"></i>
                        </div>
                        <div class="main-heaer">
                            干扰项{{ index + 1 }}
                        </div>
                        <div>
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
                                <el-form-item label="出现次数:" :required="true">
                                    <el-input v-model="item.times"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button @click="cancelCard(index)">取消</el-button>
                                    <el-button @click="disTracTions(index)">确定</el-button>
                                </el-form-item>

                            </el-form>
                        </div>
                    </el-container>
                </div>
                <div class="icon-plus" @click="iconPlus">
                    <i class="el-icon-plus"></i>
                </div>
            </el-container>
            <div class="footer-but">
                <el-button @click="previousStep2">上一步</el-button>
                <el-button @click="comPlete">完成</el-button>
            </div>
        </div>
    </el-main>

</template>
<script>
import Upload from '@/chaos/functions/common/Upload';
import { remove, update, add } from '@/chaos/functions/common/Data';

export default {
    props: {
        cardTypeList: {
            type: Array
        },
        cardExtreList: Array,
        step: {
            type: Number
        },
        cardNum2: {
            type: Number
        },
        cardNum1: {
            type: Number
        },
        extremeMu: {
            type: String
        },
        tabMuIndex: String,
        comPlete: Function,
        previousStep2: Function
    },
    data() {
        return {
            activeKey: '0',
            dialogForm: {
                backgroundUrl: ''
            },
            interIndex: '0'
        };
    },
    methods: {
        imageCardIndex(index) {
            this.inteIndex = index;
        },
        imageUrlUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme'
            })
                .then(result => {
                    this.cardTypeList[this.inteIndex].imageUrl = result;
                    this.$set(
                        this.cardTypeList,
                        this.inteIndex,
                        this.cardTypeList[this.inteIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
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
        },
        iconPlus(type) {
            let cardTypes = this.cardTypeList;
            let step = this.step;
            let len = this.cardTypeList.length;
            let cardTypeObj = {};
            if (!len || (len > 0 && cardTypes[len - 1].mu)) {
                switch (step) {
                    case 2:
                        cardTypeObj = {
                            imageUrl: '',
                            audioType: 0,
                            audioUrl: '',
                            enAudioType: 0,
                            enAudioUrl: '',
                            times: '',
                            cardType: 2
                        };
                        break;
                }
                cardTypes.push(cardTypeObj);
            } else {
                this.$message.error('请先完善前一张图片信息');
            }
        },
        async disTracTions(index) {
            this.interIndex = index;
            let cardTypes = this.cardTypeList;
            if (!cardTypes[index].imageUrl) {
                this.$message.error('请上传递图片');
                return false;
            }
            if (!cardTypes[index].times) {
                this.$message.error('请输入图片出现次数');
                return false;
            }
            let params = {};
            let obj = {
                imageUrl: cardTypes[index].imageUrl,
                audioType: cardTypes[index].audioType,
                audioUrl: cardTypes[index].audioUrl,
                enAudioType: cardTypes[index].enAudioType,
                enAudioUrl: cardTypes[index].enAudioUrl,
                times: Number(cardTypes[index].times),
                cardType: cardTypes[index].cardType
            };
            let mu = cardTypes[index].mu;
            if (cardTypes[index].mu) {
                params = Object.assign({}, obj, mu);
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
        cancelCard(index) {
            let cardTypes = this.cardTypeList;
            let cardExtre = this.cardExtreList;
            if (cardTypes[index].mu) {
                cardTypes[index] = Object.assign({}, cardExtre[index]);
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
            this.cardTypeList = cardTypes;
        }
    }
};
</script>
<style lang="less" scoped>
.el-form {
    width: auto;
    padding-left: 8px;
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
            display: inline-block;
            margin-bottom: 20px;
            .dialog-main-one {
                width: 325px;
                height: 402px;
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
                .deleteIcon {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    font-size: 22px;
                }
            }
        }
    }
    .icon-plus {
        width: 325px;
        height: 400px;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
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
    height: 178px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    display: block;
}
</style>
