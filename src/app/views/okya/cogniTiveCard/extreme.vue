<template>
    <el-dialog title="极速点击" :visible.sync="extremeeVisible" :before-close="comPlete" center width="1109px">
        <el-container style="width: 1050px" v-if="step === 0">
            <el-tabs type="card" editable v-model="tabMuIndex" :tabMuIndex="tabMuIndex" @edit="handleTabsEdit" @tab-click="handleTabClick">
                <el-tab-pane style="width: 1050px" v-for="(item, index) in extList" :key="index" :label="`训练${index+1}`">
                    <el-main>
                        <el-form ref="extremeForm" :model="extremeForm" :rules="rules" label-width="150px">
                            <el-form-item label="背景音乐: ">
                                <div class="card-append" style="width: 550px" @click="cardListTabIndex(index)">
                                    <el-upload action="#" :show-file-list="false" :http-request="MusicUploadFile">
                                        <el-input placeholder="请输入内容" v-model="item.backgroundMusicUrl">
                                            <template slot="append" class="append">点击上传</template>
                                        </el-input>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="中文进入引导语:">
                                <div class="card-append" @click="cardListTabIndex(index)">
                                    <el-upload action="#" :show-file-list="false" :http-request="guideUploadFile">
                                        <el-input placeholder="请输入内容" v-model="item.guideUrl">
                                            <template slot="append" class="append">点击上传</template>
                                        </el-input>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="英文进入引导语:">
                                <div @click="cardListTabIndex(index)">
                                    <el-upload action="#" :show-file-list="false" :http-request="enGuideUploadFile">
                                        <el-input placeholder="请输入内容" v-model="item.enGuideUrl">
                                            <template slot="append">点击上传</template>
                                        </el-input>
                                    </el-upload>
                                </div>

                            </el-form-item>
                            <el-form-item label="做题用时:" :required="true">
                                <el-input v-model="item.practiceTimes">
                                    <i slot="suffix" maxlength="10" style="width: 550px;font-style:normal;margin-right: 10px;">S</i>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="中文结束语:">
                                <div @click="cardListTabIndex(index)">
                                    <el-upload action="#" :show-file-list="false" :http-request="endUploadFile">
                                        <el-input placeholder="请输入内容" v-model="item.endUrl">
                                            <template slot="append">点击上传</template>
                                        </el-input>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="英文结束语:">
                                <div @click="cardListTabIndex(index)">
                                    <el-upload action="#" :show-file-list="false" :http-request="enEndUploadFile">
                                        <el-input placeholder="请输入内容" v-model="item.enEndUrl">
                                            <template slot="append">点击上传</template>
                                        </el-input>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item label="封面图片:" prop="coverUrl" :required="true">
                                <div @click="cardListTabIndex(index)">
                                    <el-upload action="#" :show-file-list="false" :http-request="coverUploadFile">
                                        <el-image v-if="item.coverUrl" :src="item.coverUrl" fit="scale-down" class="avatar avatar-uploader-icon">
                                            点击上传
                                        </el-image>
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>

                            </el-form-item>
                            <el-form-item label="背景图片:" prop="backgroundUrl" :required="true">
                                <div @click="cardListTabIndex(index)">
                                    <el-upload action="#" :show-file-list="false" :http-request="backgroundFile">
                                        <el-image v-if="item.backgroundUrl" :src="item.backgroundUrl" fit="scale-down" class="avatar avatar-uploader-icon">点击上传
                                        </el-image>
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="cancelEditClick(index)">取消</el-button>
                                <el-button @click="sureToSave(index)">确定</el-button>
                                <el-button @click="nextStep(1)">下一步</el-button>
                            </el-form-item>
                        </el-form>
                    </el-main>
                </el-tab-pane>
            </el-tabs>
        </el-container>
        <el-container v-if="step === 1">
            <NextStep :cardTypeList="cardTypeList" :step="step" :cardNum1="cardNum1" :extremeMu="extremeMu" :cardExtreList="cardExtres" @nextStep="nextStep" :previousStep="previousStep" :nextStep2="nextStep2" :nextTabMuIndex="tabMuIndex" ref="nextStepRef"></NextStep>
        </el-container>
        <el-container v-if="step === 2">
            <InterFe :cardTypeList="cardTypeList" :step="step" :cardNum1="cardNum1" :cardNum2="cardNum2" :extremeMu="extremeMu" :cardExtreList="cardExtres" :tabMuIndex="tabMuIndex" @nextStep="nextStep" :previousStep2="previousStep2" :comPlete="comPlete"></InterFe>
        </el-container>
        <div>
            <el-dialog title="提示" :visible.sync="centerDialogVisible" width="40%" :modal="false" center>
                <span>训练{{Number(tabMuIndex )+1}}可点击项与干扰项总数不为30，将无法上架，确认关闭极速点击配置？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="comPleteVisible">确 定</el-button>
                </span>
            </el-dialog>
        </div>

    </el-dialog>

</template>
<script>
import Upload from '@/chaos/functions/common/Upload';
import { update, list, remove, add } from '@/chaos/functions/common/Data';
import NextStep from '@/app/views/okya/cogniTiveCard/nextstep';
import InterFe from '@/app/views/okya/cogniTiveCard/interfe';
import { Loading } from 'element-ui';
export default {
    props: {
        extremeeVisible: {
            type: Boolean,
            default: false
        },
        extList: {
            type: Array
        },
        copyCardList: {
            type: Array
        },
        extMu: {
            type: String
        }
    },
    data() {
        const rules = {};
        return {
            rules,
            step: 0,
            extremeForm: {},
            extremeTab: '',
            cardTypeList: [],
            extremeMu: '',
            tabIndex: '',
            tabMuIndex: '0',
            clickPracticeUnique: '',
            tabsMu: '',
            cardExtres: [],
            cardNum1: 0,
            cardNum2: 0,
            mu: '',
            tabClickIndex: '', // 上传下标
            tabsExtreIndex: '',
            centerDialogVisible: false // 完成确认弹框
        };
    },
    watch: {},
    methods: {
        async handleTabsEdit(targetName, action) {
            let card = this.extList;
            let len = this.extList.length;
            this.mu = targetName;
            switch (action) {
                case 'add':
                    if (!card.length || card[len - 1].mu) {
                        this.extList.push({
                            backgroundMusicUrl: '',
                            guideUrl: '',
                            enGuideUrl: '',
                            practiceTimes: '',
                            endUrl: '',
                            enEndUrl: '',
                            coverUrl: '',
                            backgroundUrl: ''
                        });
                    } else {
                        this.$message.error('请先完善已新建训练信息');
                    }
                    this.tabMuIndex =
                        Number(this.tabIndex) < 0 ? '0' : this.tabIndex;
                    break;
                case 'remove':
                    await this.deleteRemove();
                    break;
                default:
                    break;
            }
        },
        handleTabClick(tabs, event) {
            this.tabMuIndex = tabs.index;
            this.tabsMu = tabs.name;
            let extrm = this.extList;
            let copyCard = this.copyCardList;
            if (extrm[this.tabMuIndex].mu) {
                extrm[this.tabMuIndex] = Object.assign(
                    {},
                    copyCard[this.tabMuIndex]
                );
            }
            this.cardNum1 = extrm[Number(this.tabMuIndex)].optionCount
                ? extrm[Number(this.tabMuIndex)].optionCount
                : 0;
            this.cardNum2 = extrm[Number(this.tabMuIndex)].distractorsCount
                ? extrm[Number(this.tabMuIndex)].distractorsCount
                : 0;
        },
        deleteRemove() {
            let card = this.extList;
            if (card[Number(this.tabMuIndex)].mu) {
                let mu = card[Number(this.tabMuIndex)].mu;
                remove('cognitive_click_practice', mu, () => {
                    this.$emit('extReme', this.extMu);
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
                        card.splice(Number(this.tabMuIndex), 1);
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

            if (this.tabMuIndex === card.length) {
                this.tabMuIndex = String(card.length - 1);
            }
            this.cardNum1 =
                card[Number(this.tabMuIndex)] &&
                card[Number(this.tabMuIndex)].optionCount
                    ? card[Number(this.tabMuIndex)].optionCount
                    : 0;
            this.cardNum2 =
                card[Number(this.tabMuIndex)] &&
                card[Number(this.tabMuIndex)].distractorsCount
                    ? card[Number(this.tabMuIndex)].distractorsCount
                    : 0;
        },

        cardListTabIndex(index) {
            this.tabClickIndex = index;
        },
        MusicUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.extList[
                        this.tabClickIndex
                    ].backgroundMusicUrl = result;
                    this.$set(
                        this.extList,
                        this.tabClickIndex,
                        this.extList[this.tabClickIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        guideUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.extList[this.tabClickIndex].guideUrl = result;
                    this.$set(
                        this.extList,
                        this.tabClickIndex,
                        this.extList[this.tabClickIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        enGuideUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.extList[this.tabClickIndex].enGuideUrl = result;
                    this.$set(
                        this.extList,
                        this.tabClickIndex,
                        this.extList[this.tabClickIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        endUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.extList[this.tabClickIndex].endUrl = result;
                    this.$set(
                        this.extList,
                        this.tabClickIndex,
                        this.extList[this.tabClickIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        enEndUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.extList[this.tabClickIndex].enEndUrl = result;
                    this.$set(
                        this.extList,
                        this.tabClickIndex,
                        this.extList[this.tabClickIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        coverUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme'
            })
                .then(result => {
                    this.extList[this.tabClickIndex].coverUrl = result;
                    this.$set(
                        this.extList,
                        this.tabClickIndex,
                        this.extList[this.tabClickIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        backgroundFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'extreme'
            })
                .then(result => {
                    this.extList[this.tabClickIndex].backgroundUrl = result;
                    this.$set(
                        this.extList,
                        this.tabClickIndex,
                        this.extList[this.tabClickIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        async sureToSave(index) {
            let card = this.extList,
                params = {};
            let Unique = this.extMu;
            if (!Number(card[index].practiceTimes)) {
                this.$message.error('请输入做题用时');
                return false;
            }
            if (!card[index].coverUrl) {
                this.$message.error('请上传封面图');
                return false;
            }
            if (!card[index].backgroundUrl) {
                this.$message.error('请上传背景图');
                return false;
            }
            let Obj = {
                backgroundMusicUrl: card[index].backgroundMusicUrl,
                guideUrl: card[index].guideUrl,
                enGuideUrl: card[index].enGuideUrl,
                practiceTimes: card[index].practiceTimes,
                endUrl: card[index].endUrl,
                enEndUrl: card[index].enEndUrl,
                coverUrl: card[index].coverUrl,
                backgroundUrl: card[index].backgroundUrl
            };
            let mu = card[index].mu;
            if (card[index].mu) {
                params = Object.assign({}, Obj, { mu: card[index].mu });
                const res = await update(
                    'cognitive_click_practice',
                    mu,
                    params
                );
                if (res.code !== 200) {
                    this.$emit('extReme', Unique, mu);
                }
            } else {
                params = Object.assign({}, Obj, {
                    cognitiveCardPackageUnique: this.extMu
                });
                const res = await add('cognitive_click_practice', params);
                if (res.code !== 200) {
                    this.$emit('extReme', Unique, mu);
                }
            }
        },
        async nextStep(cardType) {
            // 初始化 可点项 , 可干扰项
            this.step = cardType;
            let clickPracticeUnique = this.extList[Number(this.tabMuIndex)].mu;
            this.extremeMu = clickPracticeUnique;
            if (!this.extList[Number(this.tabMuIndex)].mu) {
                this.$message.error('请先保存');
                this.step = 0;
            } else {
                let loadingInstance = Loading.service();
                let res = await list('cognitive_click_option', {
                    cardType,
                    clickPracticeUnique
                });
                let data = res;
                let num1 = 0,
                    num2 = 0;
                this.cardTypeList = data;
                data.forEach(card => {
                    if (cardType === 1) {
                        num1 += card.times;
                    }
                    if (cardType === 2) {
                        num2 += card.times;
                    }
                });
                this.cardExtres = JSON.parse(JSON.stringify(data));
                this.cardNum1 = cardType === 1 ? num1 : this.cardNum1;
                this.cardNum2 = cardType === 2 ? num2 : this.cardNum2;
                loadingInstance.close();
            }
        },
        async previousStep() {
            this.step = 0;
        },
        async nextStep2() {
            await this.nextStep(2);
            this.step = 2;
        },
        async previousStep2() {
            this.step = 1;
            const clickPracticeUnique = this.extremeMu;
            let res = await list('cognitive_click_option', {
                cardType: 1,
                clickPracticeUnique
            });
            this.cardTypeList = res;
        },
        comPlete() {
            let extType = this.extList;
            let tabMuIndex = this.tabMuIndex;
            if (
                this.cardNum1 + this.cardNum2 === 30 ||
                !extType.length ||
                !extType[tabMuIndex].mu
            ) {
                this.tabMuIndex = '0';
                this.step = 0;
                this.cardNum1 = 0;
                this.cardNum2 = 0;
                this.$emit('extreVis');
            } else {
                this.centerDialogVisible = true;
            }
        },
        comPleteVisible() {
            this.tabMuIndex = '0';
            this.step = 0;
            this.cardNum1 = 0;
            this.cardNum2 = 0;
            this.centerDialogVisible = false;
            this.$emit('extreVis');
        },
        cancelEditClick(index) {
            let extrm = this.extList;
            let copyCard = this.copyCardList;
            if (extrm[index].mu) {
                extrm[index] = Object.assign({}, copyCard[index]);
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
                        extrm.splice(index, 1);
                        this.cardNum1 =
                            extrm[this.tabMuIndex] &&
                            extrm[this.tabMuIndex] &&
                            extrm[this.tabMuIndex].optionCount
                                ? extrm[this.tabMuIndex].optionCount
                                : 0;
                        this.cardNum2 =
                            extrm[this.tabMuIndex] &&
                            extrm[this.tabMuIndex] &&
                            extrm[this.tabMuIndex].distractorsCount
                                ? extrm[this.tabMuIndex].distractorsCount
                                : 0;
                        if (index === extrm.length) {
                            this.tabMuIndex = String(extrm.length - 1);
                        }
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
        handleDialogClose() {
            this.$emit('extreVis');
        }
    },
    components: {
        NextStep,
        InterFe
    }
};
</script>
<style lang="less" scoped>
.el-tabs.el-tabs--card.el-tabs--top {
    width: 1150px;
}
.el-form {
    width: auto;
}

.el-tabs el-tabs--card el-tabs--top {
    width: 1050px;
}
.el-tabs__header {
    width: 1050px;
}
.el-input {
    width: 550px;
}
.card-append {
    width: 550px;
}
.el-input-group {
    width: 550px;
}
.append {
    cursor: pointer;
}
.extremee {
    width: 700px;
    margin-left: 60px;
    display: flex;
    justify-content: center;
    background-color: #409eff;
    border-radius: 8px;
    position: relative;
    .icon-edit {
        position: absolute;
        top: 0;
        right: 10px;
    }
}
.extremee:hover {
    background-color: #888888;
}
.extremee:hover .next-step {
    display: block;
    position: absolute;
    bottom: 10px;
    left: 30%;
}
.next-step {
    display: none;
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
