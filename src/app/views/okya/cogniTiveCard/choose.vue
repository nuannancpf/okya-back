<template>
    <el-dialog title="选择题配置" :visible.sync="chooseVisible" :before-close="onClose" width="950px">
        <el-tabs type="card" v-model="tabsPane" editable @tab-click="handleTabClick" @edit="handleTabsEdit">
            <el-tab-pane v-for="(item,index) in cardList" :key="index" :label="`问题${index+1}`" :name="item.mu">
                <el-main>
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="中文问题:" :required="true">
                            <el-input type="textarea" maxlength="50" show-word-limit v-model="item.question"></el-input>
                        </el-form-item>
                        <el-form-item label="英文问题:" :required="true">
                            <el-input type="textarea" maxlength="100" show-word-limit v-model="item.enQuestion"></el-input>
                        </el-form-item>
                        <el-form-item label="中文问题音频:" :required="true">
                            <el-radio-group v-model="item.audioType">
                                <div class="c-radio">
                                    <el-radio :label="0">语音合成</el-radio>
                                </div>
                                <div class="c-radio">
                                    <el-radio :label="1">上传文件</el-radio>
                                </div>
                            </el-radio-group>
                            <div @click="exteUpload(index)">
                                <el-upload action="#" :show-file-list="false" :http-request="audioUploadFile" v-show="item.audioType === 1">
                                    <el-input placeholder="请输入内容" v-model="item.audioUrl">
                                        <template slot="append">点击上传</template>
                                    </el-input>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="英文问题音频:" :required="true">
                            <el-radio-group v-model="item.enAudioType">
                                <div class="c-radio">
                                    <el-radio :label="0">语音合成</el-radio>
                                </div>
                                <div class="c-radio">
                                    <el-radio :label="1">上传文件</el-radio>
                                </div>
                            </el-radio-group>
                            <div @click="exteUpload(index)">
                                <el-upload action="#" :show-file-list="false" :http-request="enAudioUploadFile" v-show="item.enAudioType === 1">
                                    <el-input placeholder="请输入内容" v-model="item.enAudioUrl">
                                        <template slot="append">点击上传</template>
                                    </el-input>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="请选择答案:" :required="true">
                            <div class="the-answer">
                                <el-container class="answer-container" v-for="(val, opIndex) in cardList[index].list" :key="opIndex" :value="val.mu">
                                    <div class="answer-main">
                                        <el-form status-icon :model="formRef" :rules="rules" ref="formRef" label-width="100px" class="demo-orm" style="padding: 5px">
                                            <el-form-item :label="`正确答案${String.fromCharCode(65 + opIndex)}`" style="width: 180px;">
                                                <el-checkbox v-model="val.optionState" @change="radioSelect(index, opIndex, $event)" :true-label="1" false-label="0"></el-checkbox>
                                            </el-form-item>
                                            <el-form-item class="form-item" :required="true">
                                                <div @click="showData(opIndex)" style="width: 180px; height: 180px">
                                                    <el-upload class="avatar-uploader" action="#" accept=".jpg,.png" :show-file-list="false" :http-request="handleHttpCover" style="margin-left: 30px">
                                                        <el-image v-if="val.imageUrl" :src="val.imageUrl" fit="scale-down" class="avatar"></el-image>
                                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                    </el-upload>
                                                </div>
                                            </el-form-item>
                                            <el-form-item label="答案中文音频:" :required="true">
                                                <el-radio-group v-model="val.audioType">
                                                    <div class="c-radio">
                                                        <el-radio :label="0">语音合成</el-radio>
                                                    </div>
                                                    <div class="c-radio">
                                                        <el-radio :label="1">上传文件</el-radio>
                                                    </div>
                                                </el-radio-group>
                                                <div @click="showData(opIndex)">
                                                    <el-input type="textarea" v-model="val.title" v-if="val.audioType === 0" style="width: 190px" maxlength="20" placeholder="不超过20个字"></el-input>
                                                    <el-upload action="#" :show-file-list="false" :http-request="answerAudioUploadFile" v-if="val.audioType === 1">
                                                        <el-input placeholder="请输入内容" v-model="val.audioUrl">
                                                            <template slot="append">点击上传</template>
                                                        </el-input>
                                                    </el-upload>
                                                </div>
                                            </el-form-item>
                                            <el-form-item label="答案英文音频:" :required="true">
                                                <el-radio-group v-model="val.enAudioType">
                                                    <div class="c-radio">
                                                        <el-radio :label="0">语音合成</el-radio>
                                                    </div>
                                                    <div class="c-radio">
                                                        <el-radio :label="1">上传文件</el-radio>
                                                    </div>
                                                </el-radio-group>
                                                <div @click="showData(opIndex)">
                                                    <el-input type="textarea" v-model="val.enTitle" v-if="val.enAudioType === 0" style="width: 190px" maxlength="20" placeholder="不超过20个字"></el-input>
                                                    <el-upload action="#" :show-file-list="false" :http-request="answerEnAudioUploadFile" v-if="val.enAudioType === 1">
                                                        <el-input placeholder="请输入内容" v-model="val.enAudioUrl">
                                                            <template slot="append">点击上传</template>
                                                        </el-input>
                                                    </el-upload>
                                                </div>

                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </el-container>
                            </div>
                        </el-form-item>
                    </el-form>
                </el-main>
                <div class="footer-but">
                    <el-button @click="cancelEditQues(index)">取消</el-button>
                    <el-button @click="chooseSave">保存</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>
<script>
import Upload from '@/chaos/functions/common/Upload';
import { remove, update, add, list } from '@/chaos/functions/common/Data';
export default {
    props: {
        chooseVisible: {
            type: Boolean,
            default: false
        },
        chooseMu: {
            type: String
        }
    },
    data() {
        const rules = {};
        return {
            rules,
            tabsPane: '',
            cardList: [],

            ruleForm: {},
            formRef: {},

            labelTitle: '',
            cardData: [],
            cardTabList: [],
            exteIndex: '0',
            cardTabListIndex: 0,
            tabsIndex: '0',
            optionState: '',
            chockTabIndex: '',
            chockIndex: '',
            chockEvent: false
        };
    },
    methods: {
        async initChoose(cognitiveCardPackageUnique) {
            let res = await list('cognitive_card_question', {
                cognitiveCardPackageUnique
            });
            let data = res;
            this.cardList = data;
            this.cardTabList = JSON.parse(JSON.stringify(data));
            if (this.cardList.length) {
                this.tabsPane = this.cardList[this.tabsIndex].mu;
            }
            this.cardList.forEach(item => {
                item.list.forEach((answer, index) => {
                    answer.optionState = answer.optionState === 1;
                });
            });
        },
        handleTabClick(tab, event) {
            this.tabsIndex = tab.index;
        },
        exteUpload(index) {
            this.exteIndex = index;
        },
        audioUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'choose',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.cardList[this.exteIndex].audioUrl = result;
                    this.$set(
                        this.cardList,
                        this.exteIndex,
                        this.cardList[this.exteIndex]
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
                direname: 'choose',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.cardList[this.exteIndex].enAudioUrl = result;
                    this.$set(
                        this.cardList,
                        this.exteIndex,
                        this.cardList[this.exteIndex]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        async handleTabsEdit(targetName, action) {
            let cards = this.cardList;
            let len = this.cardList.length;
            let mu = targetName;
            switch (action) {
                case 'add':
                    if (!cards.length || cards[len - 1].mu) {
                        let list = [],
                            obj = {};
                        for (let i = 0; i < 4; i++) {
                            list.push({
                                // label: `正确答案${String.fromCharCode(65 + i)}`,
                                optionState: '',
                                coverUrl: '',
                                audioType: 0,
                                enAudioType: 0,
                                imageUrl: '',
                                enAudioUrl: '',
                                audioUrl: ''
                            });
                        }
                        obj = {
                            question: '', // 中文问题
                            enQuestion: '', // 英文问题
                            audioType: 0, // 中文音频
                            audioUrl: '',
                            enAudioType: 0, // 英文音频
                            enAudioUrl: '',
                            optionState: 1, // 正确答案
                            list
                        };
                        cards.push(obj);
                    } else {
                        this.$message.error('请先完善已新建问题信息');
                    }
                    break;
                case 'remove':
                    this.deleteTabs();
                    break;
            }
        },
        deleteTabs() {
            let cards = this.cardList;
            if (cards[Number(this.tabsIndex)].mu) {
                let mu = cards[Number(this.tabsIndex)].mu;
                remove('cognitive_card_question', mu, () => {
                    this.initChoose(this.chooseMu);
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
                        cards.splice(Number(this.tabsIndex), 1);
                        if (Number(this.tabsIndex) === cards.length) {
                            this.tabsIndex = String(cards.length - 1);
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
        showData(index) {
            this.cardTabListIndex = index;
        },
        handleHttpCover(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'choose'
            })
                .then(result => {
                    this.imageUrl = result;
                    this.cardList[this.tabsIndex].list[
                        this.cardTabListIndex
                    ].imageUrl = result;
                    this.$set(
                        this.cardList[this.tabsIndex].list,
                        this.cardTabListIndex,
                        this.cardList[this.tabsIndex].list[
                            this.cardTabListIndex
                        ]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        answerAudioUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'choose',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.imageUrl = result;
                    this.cardList[this.tabsIndex].list[
                        this.cardTabListIndex
                    ].audioUrl = result;
                    this.$set(
                        this.cardList[this.tabsIndex].list,
                        this.cardTabListIndex,
                        this.cardList[this.tabsIndex].list[
                            this.cardTabListIndex
                        ]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        answerEnAudioUploadFile(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'choose',
                extname: ['.mp3', '.m4a']
            })
                .then(result => {
                    this.imageUrl = result;
                    this.cardList[this.tabsIndex].list[
                        this.cardTabListIndex
                    ].enAudioUrl = result;
                    this.$set(
                        this.cardList[this.tabsIndex].list,
                        this.cardTabListIndex,
                        this.cardList[this.tabsIndex].list[
                            this.cardTabListIndex
                        ]
                    );
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        radioSelect(index, opIndex, event) {
            this.chockTabIndex = index;
            this.chockIndex = opIndex;
            this.chockEvent = event;
            this.cardList[index].list[opIndex].optionState = event;
            this.cardList[index].list.forEach((item, indexs) => {
                if (indexs === opIndex) {
                    item.optionState = event;
                } else {
                    if (event == 1) {
                        item.optionState = 0;
                    }
                }
            });
        },
        async chooseSave() {
            let cards = this.cardList;
            let { list } = cards[Number(this.tabsIndex)];
            let regEmoji = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
            let regCh = /^[\u4e00-\u9fa5]+(\s*[\u4e00-\u9fa5]+)*$/;
            let regEn = /^[a-zA-Z]+(\s*[a-zA-Z]+)*$/;
            if (!cards[this.tabsIndex].question) {
                this.$message.error('请输入中文问题');
                return false;
            } else if (regEmoji.test(cards[this.tabsIndex].question)) {
                this.$message.error('中文问题不能输入表情');
                return false;
            } else if (!cards[this.tabsIndex].enQuestion) {
                this.$message.error('请输入英文问题');
                return false;
            } else if (regEmoji.test(cards[this.tabsIndex].enQuestion)) {
                this.$message.error('英文问题不能输入表情');
                return false;
            } else if (
                cards[this.tabsIndex].audioType &&
                !cards[this.tabsIndex].audioUrl
            ) {
                this.$message.error('请上传中文问题音频');
                return false;
            } else if (
                cards[this.tabsIndex].enAudioType &&
                !cards[this.tabsIndex].enAudioUrl
            ) {
                this.$message.error('请上传英文问题音频');
                return false;
            }
            let option = list.reduce((pre, cur, index) => {
                return pre.optionState > cur.optionState ? pre : cur;
            });
            if (!option.optionState) {
                this.$message.error('请选择答案');
                return false;
            }
            for (let i = 0; i < list.length; i++) {
                if (!list[i].imageUrl) {
                    this.$message.error('请上传答案图片');
                    return false;
                }
                if (!list[i].audioType && list[i].title) {
                    if (!regCh.test(list[i].title)) {
                        this.$message.error('中文答案只能输入中文');
                        return false;
                    }
                }
                if (!list[i].audioType && list[i].enTitle) {
                    if (!regEn.test(list[i].enTitle)) {
                        this.$message.error('英文答案只能输入英文');
                        return false;
                    }
                }
            }
            let cognitiveCardPackageUnique = this.chooseMu;
            cards[this.tabsIndex].list.forEach((item, indexs) => {
                if (indexs === this.chockIndex) {
                    item.optionState = this.chockEvent;
                } else {
                    item.optionState = 0;
                }
            });
            let params = {};
            params = {
                question: cards[this.tabsIndex].question,
                enQuestion: cards[this.tabsIndex].enQuestion,
                audioType: cards[this.tabsIndex].audioType,
                audioUrl: cards[this.tabsIndex].audioUrl,
                enAudioType: cards[this.tabsIndex].enAudioType,
                enAudioUrl: cards[this.tabsIndex].enAudioUrl,
                list: cards[this.tabsIndex].list
            };
            let mu = cards[this.tabsIndex].mu;
            if (cards[this.tabsIndex].mu) {
                params = Object.assign(params, { mu });
                const res = await update('cognitive_card_question', mu, params);
                if (res) {
                    await this.initChoose(this.chooseMu);
                }
            } else {
                params = Object.assign(params, { cognitiveCardPackageUnique });
                const res = await add('cognitive_card_question', params);
                if (res) {
                    await this.initChoose(this.chooseMu);
                }
            }
        },
        cancelEditQues(index) {
            let cards = this.cardList;
            let cardTab = this.cardTabList;
            if (cards[Number(index)].mu) {
                cards[Number(index)] = JSON.parse(
                    JSON.stringify(cardTab[Number(index)])
                );
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
                        cards.splice(Number(index), 1);
                        if (Number(index) === cards.length) {
                            index = String(cards.length - 1);
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
        onClose() {
            this.$emit('close');
        }
    }
};
</script>
<style lang="less" scoped>
element.style {
    margin-left: 20px;
}
.el-form {
    width: auto;
}
.the-answer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .answer-container {
        width: 332px;
        border: 1px solid #dbdbdb;
        border-radius: 8px;
        margin-right: 10px;
        margin-bottom: 15px;
        display: inline-block;
    }
}
.el-main {
    padding: 5px;
}
.c-radio {
    height: 30px;
}
.demo-orm {
    .form-div {
        display: flex;
        flex-flow: row;
        .form-item {
            .el-form-item__content {
                margin-right: 100px;
            }
        }
    }
}
.el-form-item .el-form-item {
    margin-bottom: 10px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    border: 1px dashed #d9d9d9;
}
.avatar {
    width: 178px;
    height: 178px;
    background-size: contain;
    background-repeat: no-repeat;
    display: block;
}
.el-form-item__content {
    margin-left: 10px;
}
.footer-but {
    width: 100%;
    text-align: center;
}
</style>
