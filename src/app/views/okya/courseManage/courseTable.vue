<template>
    <el-dialog width="420px" center :title="newClassType === 'add' ? '新增课程' : '编辑课程'" :visible.sync="updateClass" :before-close="onClose">
        <el-form :model="updateClassForm" ref="updateForm" :rules="rules" label-width="100px" class="el-form-up">
            <el-form-item label="选择课程" :required="true">
                <div class="update-class">
                    <el-select v-model="updateClassForm.courseType" clearable @change="handleSelect($event)">
                        <el-option label="AI课" :value="4">AI课</el-option>
                        <el-option label="核心课" :value="1">核心课</el-option>
                    </el-select>
                    <div class="type-select" v-if="updateClassForm.courseType == 1 || updateClassForm.courseType == 4">
                        <div style="margin: 0 5px 0 5px">
                            <span class="el-icon-right"></span>
                        </div>
                        <el-select v-if="updateClassForm.courseType == 1" clearable v-model="updateClassForm.courseId" placeholder="请选择核心课" @change="CoreClass($event)">
                            <el-option v-for="(item, index) in classList" :key="index" :label="item.title" :value="item.courseUnique"></el-option>
                        </el-select>
                        <el-select v-if="updateClassForm.courseType == 4" clearable v-model="updateClassForm.courseId" placeholder="请选择AI课" @change="AIclassGet($event)">
                            <el-option v-for="(item, index) in classList" :key="index" :label="item.title" :value="item.mu"></el-option>
                        </el-select>
                        <div style="margin: 0 5px 0 5px">
                            <span class="el-icon-right"></span>
                        </div>
                        <el-select v-model="updateClassForm.gotoType" clearable placeholder="请选择">
                            <el-option label="课程列表页" :value="1">课程列表页</el-option>
                            <el-option label="课程详情页" :value="2">课程详情页</el-option>
                            <el-option label="体验课详情页" :value="3" v-if="this.hasExperienceCourse == 1 && updateClassForm.courseType == 1">体验课详情页</el-option>
                        </el-select>
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateNewClass">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { list, add, update } from '@/chaos/functions/common/Data';
import { Loading } from 'element-ui';

export default {
    props: {
        updateClass: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const rules = {
            courseType: [
                { required: true, message: '请选择', trigger: 'blur' }
            ],
            courseId: [{ required: true, message: '请选择', trigger: 'blur' }],
            gotoType: [{ required: true, message: '请选择', trigger: 'blur' }]
        };
        return {
            rules,
            updateClassForm: {
                courseType: '',
                courseId: '',
                gotoType: '',
                aiType: '' // 4 是体验课, 5是系统课
            },
            classList: [],
            newClassType: 'add',
            classMu: '',
            typeId: '',
            hasExperienceCourse: 0
        };
    },
    methods: {
        async init(type, res, typeid) {
            this.typeId = typeid;
            if (type.newClassType == 'add') {
                this.newClassType = type.newClassType;
                this.updateClassForm = {
                    courseType: '',
                    courseId: '',
                    gotoType: '',
                    aiType: ''
                };
            } else if (type.newClassType == 'modify') {
                let loadingInstance = Loading.service();
                this.newClassType = type.newClassType;
                this.classMu = res.mu;
                this.updateClassForm.courseType = res.courseType;
                this.updateClassForm.courseId = res.courseId;
                this.updateClassForm.gotoType = res.gotoType;
                this.updateClassForm.aiType = res.aiType;
                switch (this.updateClassForm.courseType) {
                    case 1: // 如果是核心课
                        await this.Corecourses();
                        await this.CoreClass(this.updateClassForm.courseId);
                        break;
                    case 4: // 如果是AI课
                        await this.AIClass();
                        await this.AIclassGet(this.updateClassForm.courseId);
                        break;
                }
                loadingInstance.close();
            }
        },
        handleSelect(val) {
            this.updateClassForm.courseId = '';
            this.updateClassForm.gotoType = '';
            switch (val) {
                case 1:
                    this.Corecourses();
                    break;
                case 4:
                    this.AIClass();
                    break;
            }
        },
        async Corecourses() {
            // 核心课课程列表
            const data = { isPublish: 1 };
            let res = await list('okya_course', data);
            this.classList = res;
        },
        async AIClass() {
            // AI课程列表
            const data = { isPublish: 1 };
            let res = await list('okyaAiCourseSetting', data);
            this.classList = res;
        },
        AIclassGet(e) {
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
            this.updateClassForm.aiType = courseType === 1 ? 4 : 5;
        },
        async CoreClass(e) {
            const CoreList = this.classList;
            let coreExp;
            try {
                await CoreList.forEach(item => {
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
        async updateNewClass() {
            // 新增课程 提交按钮
            if (!this.updateClassForm.courseType) {
                this.$message.error('请选择课程类型');
                return false;
            }
            if (!this.updateClassForm.courseId) {
                this.$message.error('请选择专辑');
                return false;
            }
            if (!this.updateClassForm.gotoType) {
                this.$message.error(
                    '请选择请选择课程列表页或课程详情页或体验课详情页'
                );
                return false;
            }
            const {
                courseType,
                courseId,
                gotoType,
                aiType
            } = this.updateClassForm;
            let tabId = this.typeId;
            if (this.newClassType === 'add') {
                const obj = {
                    courseType,
                    courseId,
                    gotoType,
                    tabId
                };
                switch (courseType) {
                    case 1:
                        break;
                    case 4:
                        Object.assign(obj, {
                            aiType
                        });
                        break;
                }
                const res = await add('okyaHomeCourse', obj);
                if (res) {
                    this.updateClassVisible = false;
                    this.$emit('tabsList', tabId);
                    this.onClose();
                }
            } else if (this.newClassType === 'modify') {
                const mu = this.classMu;
                const obj = {
                    courseType,
                    courseId,
                    gotoType,
                    tabId
                };
                switch (courseType) {
                    case 1:
                        break;
                    case 4:
                        Object.assign(obj, {
                            aiType
                        });
                        break;
                }
                await update('okyaHomeCourse', mu, obj);
                this.updateClassVisible = false;
                this.$emit('tabsList', tabId);
                this.onClose();
            }
        },
        onClose() {
            this.$emit('close');
        }
    }
};
</script>

<style lang="less" scoped>
</style>
