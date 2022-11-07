<template>
    <el-dialog :title="newActType === 'add' ? '新增推荐活动' : '编辑推荐活动'" :visible.sync="newActivities" :before-close="onClose" center width="800px">
        <el-form ref="newForm" :model="newForm" :rules="rules" style="width: 650px" label-width="auto">
            <el-form-item label="活动名称:" :required="true">
                <el-input maxlength="20" clearable v-model="newForm.activityTitle"></el-input>
            </el-form-item>
            <el-form-item label="首页封面:" :required="true">
                <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="handleCover">
                    <el-image v-if="newForm.homeImg" :src="newForm.homeImg" fit="scale-down" class="avatar avatar-uploader-icon"></el-image>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="模式:">
                <el-radio-group size="medium" v-model="newForm.patternType">
                    <el-radio-button :label="0">跳转长图</el-radio-button>
                    <el-radio-button :label="1">应用内跳转</el-radio-button>
                    <el-radio-button :label="2">有赞商品</el-radio-button>
                    <el-radio-button :label="3">H5</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <!-- 跳转长图 -->
            <div v-if="newForm.patternType == 0">
                <el-form-item label="页面名称:" :required="true">
                    <el-input maxlength="20" clearable v-model="newForm.jumpName"></el-input>
                </el-form-item>
                <el-form-item label="详情长图:" :required="true">
                    <el-upload class="avatar-uploader" action="#" accept=".jpg,.png" :show-file-list="false" :http-request="handleHttp">
                        <el-image v-if="newForm.imageUrl" :src="newForm.imageUrl" fit="scale-down" class="avatar avatar-uploader-icon"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <!-- 运用内跳转 -->
            <div v-if="newForm.patternType == 1">
                <el-form-item label="跳转位置:" :required="true">
                    <div class="within-select">
                        <el-select v-model="newForm.itemType" @change="handleSelect($event)" >
                            <el-option label="AI课" :value="4">AI课</el-option>
                            <el-option label="练习" :value="3">练习</el-option>
                            <el-option label="拓展" :value="2">拓展</el-option>
                            <el-option label="核心课" :value="1">核心课</el-option>
                            <el-option label="学习打卡" :value="5">学习打卡</el-option>
                        </el-select>
                        <div v-if="newForm.itemType == 4 || newForm.itemType == 1 || newForm.itemType == 2" class="ai-select">
                            <div style="margin: 0 5px 0 5px">
                                <span class="el-icon-right"></span>
                            </div>
                            <!-- 核心课 -->
                            <el-select placeholder="请选择核心课" v-model="newForm.coreClass" clearable v-if="newForm.itemType == 1" @change="coreClass($event)">
                                <el-option v-for="(item, index) in classList" :key="index" :label="item.title" :value="item.courseUnique"></el-option>
                            </el-select>
                            <!-- AI 课 -->
                            <el-select placeholder="请选择AI课" v-model="newForm.aiClass" clearable v-if="newForm.itemType == 4" @change="aIclassGet($event)">
                                <el-option v-for="(val, key) in classList" :key="key" :label="val.title" :value="val.mu"></el-option>
                            </el-select>
                            <el-select placeholder="请选择拓展" v-model="newForm.expand" clearable v-if="newForm.itemType == 2" @change="expandList($event)">
                                <el-option v-for="(val, key) in classList" :key="key" :label="val.title" :value="val.lectureUnique"></el-option>
                            </el-select>
                            <div style="margin: 0 5px 0 5px">
                                <span class="el-icon-right"></span>
                            </div>
                            <el-select v-model="newForm.gotoType" clearable placeholder="请选择">
                                <el-option label="课程列表页" :value="1">课程列表页</el-option>
                                <el-option label="课程详情页" :value="2">课程详情页</el-option>
                                <el-option label="体验课详情页" :value="3" v-if="this.hasExperienceCourse == 1 && newForm.itemType == 1">体验课详情页</el-option>
                            </el-select>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <!-- 有赞商品 -->
            <div v-if="newForm.patternType == 2">
                <el-form-item label="商品链接:"  :required="true">
                    <el-input v-model="newForm.shop" clearable placeholder="请输入商品链接"></el-input>
                </el-form-item>
            </div>
            <!-- H5 -->
            <div v-if="newForm.patternType == 3">
                <el-form-item label="页面名称:"  :required="true">
                    <el-input maxlength="20" v-model="newForm.H5Name" clearable placeholder="请输入页面名称"></el-input>
                </el-form-item>
                <el-form-item label="H5链接"  :required="true">
                    <el-input v-model="newForm.h5" clearable placeholder="请输入H5链接"></el-input>
                </el-form-item>
            </div>
            <el-form-item label="是否上架:">
                <el-radio-group v-model="newForm.isPublish" >
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="newActSubmit('newForm')">确 定</el-button>
            <el-button @click="onClose">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { pagemx } from '@/chaos/functions/mixin/CRUD';
import { list, add, update } from '@/chaos/functions/common/Data';
import Upload from '@/chaos/functions/common/Upload';
import { Loading } from 'element-ui';

export default {
    props: {
        newActivities: {
            // 对话框是否可见
            type: Boolean,
            default: false
        },
        mu_showUpdate: {
            // 修改接收的数据
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    mixins: [pagemx],
    data() {
        return {
            domain: 'okyaActivity',
            Mu: '',
            newForm: {
                activityTitle: '', // 活动名称
                patternType: 0, // 模式
                homeImg: '', // 封面图
                itemType: '', // 对应专辑 跳转位置
                aiType: '', // AI课类型
                gotoType: '', // 跳转位置
                isPublish: 1, // 是否上架
                jumpName: '', // 页面名称（跳转长图）
                H5Name: '', // 页面名称（H5）
                imageUrl: '', // 详情长图
                h5: '', // H5链接
                shop: '', // 商品链接
                coreClass: '', // 应用内专辑跳转 ID
                aiClass: '',
                expand: ''
            },
            classList: [],
            hasExperienceCourse: 0,
            newActType: 'add',
            Gototype: [
                { label: '课程列表', value: 1 },
                { label: '课程详情图', value: 2 }
            ],
            rules: {}
        };
    },
    methods: {
        async init(options, item) {
            if (options.newactType == 'add') {
                this.newActType = options.newactType;
                this.newForm = {
                    activityTitle: '', // 活动名称
                    patternType: 0, // 模式
                    homeImg: '', // 封面图
                    aiType: '', // AI课类型
                    gotoType: '', // 跳转位置
                    isPublish: 1, // 是否上架
                    jumpName: '', // 页面名称（跳转长图）
                    H5Name: '', // 页面名称（H5）
                    imageUrl: '', // 详情长图
                    h5: '', // H5链接
                    shop: '', // 商品链接
                    itemType: '' // 对应专辑 跳转位置
                };
            } else if (options.newactType == 'modify') {
                let loadingInstance = Loading.service();
                this.Mu = item.mu;
                this.newActType = options.newactType;
                this.newForm.activityTitle = item.activityTitle;
                this.newForm.homeImg = item.homeImg;
                this.newForm.patternType = item.patternType;
                this.newForm.itemType = item.itemType;
                this.newForm.aiType = item.aiType;
                this.newForm.isPublish = item.isPublish;
                switch (this.newForm.patternType) {
                    case 0:
                        this.newForm.jumpName = item.pageName || '';
                        this.newForm.imageUrl = item.itemContent || '';
                        break;
                    case 1:
                        if (this.newForm.itemType == 4) {
                            this.newForm.aiClass = item.itemContent || '';
                            this.newForm.gotoType = item.gotoType || '';
                            await this.aIClass();
                            await this.aIclassGet();
                        } else if (this.newForm.itemType == 1) {
                            this.newForm.coreClass = item.itemContent || '';
                            this.newForm.gotoType = item.gotoType || '';
                            await this.coreCourses();
                            await this.coreClass(this.newForm.coreClass);
                        } else if (this.newForm.itemType == 2) {
                            this.newForm.expand = item.itemContent || '';
                            this.newForm.gotoType = item.gotoType || '';
                            await this.expandList();
                        } else {
                            this.newForm.gotoType = '';
                        }
                        break;
                    case 2:
                        this.newForm.shop = item.itemContent || '';
                        break;
                    case 3:
                        this.newForm.H5Name = item.pageName || '';
                        this.newForm.h5 = item.itemContent || '';
                        break;
                    case 4:
                        break;
                }
                loadingInstance.close();
            }
        },
        handleSelect(val) {
            switch (val) {
                case 1:
                    this.coreCourses();
                    this.newForm.aiType = '';
                    this.newForm.gotoType = '';
                    break;
                case 4:
                    this.aIClass();
                    this.newForm.aiType = '';
                    this.newForm.gotoType = '';
                    break;
                case 2:
                    this.expandList();
                    break;
            }
        },
        async coreCourses() {
            // 核心课课程列表
            const data = { isPublish: 1 };
            let res = await list('okya_course', data);
            this.classList = res;
        },
        async aIClass() {
            // AI课程列表
            const data = { isPublish: 1 };
            let res = await list('okyaAiCourseSetting', data);
            this.classList = res;
        },
        async expandList() {
            // 拓展列表
            const data = { isPublish: 1 };
            let res = await list('okya_lecture', data);
            this.classList = res;
        },
        aIclassGet(e) {
            const AIclassList = this.classList;
            let courseType;
            try {
                AIclassList.forEach(item => {
                    if (item.mu === e) {
                        courseType = item.courseType;
                        throw new Error('AI-EndIterative');
                    }
                });
            } catch (e) {
                console.log(e);
            }
            this.newForm.aiType = courseType === 1 ? 4 : 5;
        },
        coreClass(e) {
            const CoreList = this.classList;
            let coreExp;
            try {
                CoreList.forEach(item => {
                    if (item.courseUnique === e) {
                        coreExp = item.hasExperienceCourse;
                        throw new Error('CORE-EndIterative');
                    }
                });
            } catch (e) {
                console.log(e);
            }
            this.hasExperienceCourse = coreExp;
        },
        async newActSubmit(formName) {
            // 提交按钮
            if (!this.newForm.activityTitle) {
                this.$message.error('请输入活动名称');
                return false;
            }
            if (!this.newForm.homeImg) {
                this.$message.error('请上传首页封面图');
                return false;
            }
            if (this.newForm.patternType == 0 && !this.newForm.jumpName) {
                this.$message.error('请输入跳转长图的页面名称');
                return false;
            }
            if (this.newForm.patternType == 0 && !this.newForm.imageUrl) {
                this.$message.error('请上传详情长图');
                return false;
            }
            if (this.newForm.patternType == 1 && !this.newForm.itemType) {
                this.$message.error('请选择跳转位置');
                return false;
            }
            if (
                this.newForm.patternType == 1 &&
                this.newForm.itemType == 1 &&
                !this.newForm.coreClass
            ) {
                this.$message.error('请选择专辑');
                return false;
            }
            if (
                this.newForm.patternType == 1 &&
                this.newForm.itemType == 4 &&
                !this.newForm.aiClass
            ) {
                this.$message.error('请选择专辑');
                return false;
            }
            if (
                this.newForm.patternType == 1 &&
                this.newForm.itemType == 2 &&
                !this.newForm.expand
            ) {
                this.$message.error('请选择专辑');
                return false;
            }
            if (this.newForm.patternType == 1 && !this.newForm.gotoType) {
                this.$message.error(
                    '请选择请选择课程列表页或课程详情页或体验课详情页'
                );
                return false;
            }
            if (this.newForm.patternType == 2 && !this.newForm.shop) {
                this.$message.error('请输入商品链接');
                return false;
            }
            if (this.newForm.patternType == 3 && !this.newForm.H5Name) {
                this.$message.error('请输入H5的页面名称');
                return false;
            }
            if (this.newForm.patternType == 3 && !this.newForm.h5) {
                this.$message.error('请输入H5链接');
                return false;
            }
            const mu = this.Mu;
            let {
                activityTitle,
                homeImg,
                patternType,
                itemType,
                aiType,
                isPublish
            } = this.newForm;
            const obj = {
                activityTitle,
                homeImg,
                patternType,
                isPublish
            };
            switch (patternType) {
                case 0:
                    Object.assign(obj, {
                        pageName: this.newForm.jumpName,
                        itemContent: this.newForm.imageUrl
                    });
                    break;
                case 1:
                    if (Number(itemType) === 4) {
                        Object.assign(obj, {
                            itemType: this.newForm.itemType,
                            itemContent: this.newForm.aiClass,
                            gotoType: this.newForm.gotoType,
                            aiType
                        });
                    } else if (Number(itemType) === 1) {
                        Object.assign(obj, {
                            itemType: this.newForm.itemType,
                            itemContent: this.newForm.coreClass,
                            gotoType: this.newForm.gotoType
                        });
                    } else if (Number(itemType) === 2) {
                        Object.assign(obj, {
                            itemType: this.newForm.itemType,
                            itemContent: this.newForm.expand,
                            gotoType: this.newForm.gotoType
                        });
                    } else if (
                        Number(itemType) === 5 ||
                        Number(itemType) === 3
                    ) {
                        Object.assign(obj, {
                            itemType: this.newForm.itemType,
                            gotoType: 0
                        });
                    }
                    break;
                case 2:
                    Object.assign(obj, {
                        itemContent: this.newForm.shop
                    });
                    break;
                case 3:
                    Object.assign(obj, {
                        pageName: this.newForm.H5Name,
                        itemContent: this.newForm.h5
                    });
            }
            if (this.newActType == 'add') {
                const res = await add(this.domain, obj);
                if (res) {
                    this.newActivitiesVisible = false;
                    this.$emit('getData');
                    this.onClose();
                }
            } else if (this.newActType == 'modify') {
                const res = await update(this.domain, mu, obj);
                if (res) {
                    this.newActivitiesVisible = false;
                    this.$emit('getData');
                    this.onClose();
                }
            }
        },

        handleCover(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'activitymanage'
                // extname: ['.mp3']
            })
                .then(result => {
                    this.newForm.homeImg = result;
                    // console.log('Upload上传图片地址', this.newForm.homeImg);
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },

        handleHttp(fileData) {
            Upload({
                filedata: fileData.file,
                direname: 'activitymanage'
            })
                .then(result => {
                    this.newForm.imageUrl = result;
                    // console.log('Upload上传图片地址', this.newForm.imageUrl);
                })
                .catch(() => {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    });
                });
        },
        onClose() {
            this.$emit('close');
        }
    }
};
</script>

<style lang="less" scoped>
.home-img {
    border: 1px dashed #d9d9d9;
    background: #fafafa;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    cursor: pointer;
}

.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px dashed #d9d9d9;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
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
