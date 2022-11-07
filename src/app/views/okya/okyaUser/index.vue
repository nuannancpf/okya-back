<template>
    <el-container>
        <el-header style="height: 120px">
            <el-container class="contain">
                <el-form :model="okyaUserrForm" label-width="auto" class="form-header" label-position="left">
                    <div class="element-div">
                        <div class="header-form">
                            <el-form-item label="地区: ">
                                <el-select class="el-select-one" width="10%" clearable v-model="okyaUserrForm.province" @change="(value) => this.handlePro(value, 'okyaUserrForm.city')">
                                    <el-option v-for="item in Object.keys(AreaChinaLite)" :key="item" :value="item" :label="item"></el-option>
                                </el-select>
                                <el-select class="el-select-twe" width="120px" clearable v-model="okyaUserrForm.city" @change="(value)=>this.handleChange(value,'okyaUserrForm.city')">
                                    <el-option v-for="item in AreaChinaLite[okyaUserrForm.province]" :key="item" :value="item" :label="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="关键词: ">
                                <el-select class="el-select-three" v-model="search_mode" width="105px" @change="searChMode($event)">
                                    <el-option v-for="(val,key) in searchMode" :key="key" :label="val.content" :value="key"></el-option>
                                </el-select>
                                <el-input width="100px" class="input-seach" v-model="okyaUserrForm[searchMode[search_mode].key]" clearable placeholder="请输入关键词" @change="(value)=>this.handleChange(value,'okyaUserrForm[searchMode[search_mode].key]')"></el-input>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="会员: ">
                                <el-select v-model="okyaUserrForm.isTpl" @change="(value)=>this.handleChange(value,'okyaUserrForm.isTpl')">
                                    <el-option label="全部" :value="2">全部</el-option>
                                    <el-option label="会员" :value="1">会员</el-option>
                                    <el-option label="普通用户" :value="0">普通用户</el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="渠道: ">
                                <el-select class="el-select-four" v-model="okyaUserrForm.isVip" @change="(value)=>this.handleChange(value,'okyaUserrForm.isVip')">
                                    <el-option v-for="(item, index) in IsVip" :key="index" :value="index" :label="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="header-form">
                            <el-form-item label="注册时间: ">
                                <el-date-picker style="width: 280px" clearable type="daterange" v-model="okyaTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="userTime"></el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="header-form form-but">
                            <div>
                                <el-button type="primary" @click="userExcel">导出</el-button>
                                <el-button type="primary" @click="searchOkyaUser">搜索</el-button>
                            </div>
                        </div>
                    </div>
                </el-form>
            </el-container>
        </el-header>
        <el-main>
            <el-table stripe :data="tableData" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading.fullscreen.lock="loading">
                <el-table-column type="index" label="序号" />
                <el-table-column prop="userName" label="用户名" />
                <el-table-column prop="role" label="用户角色" />
                <el-table-column prop="phone" label="手机号码" />
                <el-table-column prop="childName" label="宝宝昵称" />
                <el-table-column prop="sex" label="宝宝性别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex === 1">男</span>
                        <span v-if="scope.row.sex === 2">女</span>
                    </template>
                </el-table-column>
                <el-table-column prop="age" label="宝宝年龄" />
                <el-table-column prop="registerDate" label="注册时间" />
                <el-table-column prop="lastLoginDate" label="最近一次登录" />
                <el-table-column prop="province" label="省" />
                <el-table-column prop="city" label="市" />
                <el-table-column prop="isTpl" label="会员">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isTpl === 1">会员</span>
                        <span v-if="scope.row.isTpl === 0">普通用户</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isVip" label="来源">
                    <template slot-scope="scope">
                        {{ IsVip[scope.row.isVip] }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <PlainButton type="text" text="查看信息" :click="() => checkInform(scope.row.userUnique)" />
                        <PlainButton text="编辑" :click="() => showUpdateInform(scope.row)" />
                    </template>
                </el-table-column>
            </el-table>
            <SearchPagination :currentPage="currentPage" :total="total" :limit="limit" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange" />
        </el-main>

        <el-dialog width="30%" center title="修改个人信息" :visible.sync="showUpdateForm" :before-close="onClose">
            <el-form ref="userForm" :rules="rules" :model="editUserForm" label-width="auto">
                <el-form-item label="宝宝姓名:" prop="childName">
                    <el-input maxLength="15" class="prop-input" v-model="editUserForm.childName" placeholder="请输入宝宝姓名"></el-input>
                </el-form-item>
                <el-form-item label="宝宝性别:" prop="sex">
                    <el-radio-group v-model="editUserForm.sex">
                        <el-radio :label="1">男孩</el-radio>
                        <el-radio :label="2">女孩</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期:" prop="birthday">
                    <el-date-picker class="prop-input" v-model="editUserForm.birthday" type="date" placeholder="请选择出生日期" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="家长姓名:" prop="userName">
                    <el-input class="prop-input" maxLength="15" v-model="editUserForm.userName" placeholder="请输入家长姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号:" prop="phone">
                    <el-input class="prop-input" maxLength="11" v-model="editUserForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="城市:">
                    <el-select clearable style="width: 150px" placeholder="请选择所在城市" v-model="editUserForm.province" @change="editUserForm.city= ''">
                        <el-option v-for="item in Object.keys(AreaChinaLite)" :key="item" :value="item"></el-option>
                    </el-select>
                    <el-select clearable style="width: 150px; margin-left: 5px" placeholder="请选择所在城市" v-model="editUserForm.city">
                        <el-option v-for="item in AreaChinaLite[editUserForm.province]" :key="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Union id:">
                    {{editUserForm.unionId}}
                </el-form-item>
                <el-form-item label="Open id:">
                    {{editUserForm.openId}}
                </el-form-item>
                <el-form-item label="家长角色:" prop="role">
                    <el-radio-group v-model="editUserForm.role">
                        <el-radio label="爸爸">爸爸</el-radio>
                        <el-radio label="妈妈">妈妈</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="最后登录:">
                    {{editUserForm.lastLoginDate}}
                </el-form-item>
                <el-form-item label="注册时间:">
                    {{editUserForm.registerDate}}
                </el-form-item>
                <div class="save-button">
                    <el-button type="primary" @click="saveUser('userForm')">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
    </el-container>
</template>

<script>
import {
    pagemx,
    removemx,
    addmx,
    updatemx
} from '@/chaos/functions/mixin/CRUD';
import { search, searchExport, submit } from '@/chaos/functions/common/Data';
import AreaChinaLite from '@/app/asserts/areaChinaLite.json';
export default {
    name: 'okyaAfterUser',
    mixins: [pagemx, removemx, addmx, updatemx],
    data() {
        const rules = {
            childName: [
                { required: true, message: '请输入宝宝姓名', trigger: 'blur' }
            ],
            birthday: [
                {
                    required: true,
                    message: '请选择宝宝出生日期',
                    trigger: 'blur'
                }
            ],
            userName: [
                { required: true, message: '请输入家长姓名', trigger: 'blur' }
            ],
            phone: [
                { required: true, message: '请输入手机号', trigger: 'blur' },
                {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式不正确,最少11位',
                    trigger: 'change'
                }
            ]
        };
        return {
            domain: 'okya_user',
            rules,
            AreaChinaLite,
            provinceList: [],
            theCity: [],
            okyaTime: '',
            okyaUserrForm: {
                phone: '',
                userName: '',
                childName: '',
                endDate: '',
                startDate: '',
                province: '',
                city: '',
                isVip: '100',
                isTpl: 2
            },
            cityData: [],
            tableData: [],
            editForm: {},
            showUpdateForm: false,
            editUserForm: {
                childName: '',
                sex: '',
                birthday: '',
                userName: '',
                phone: '',
                province: '',
                city: '',
                role: '',
                unionId: '',
                openId: '',
                lastLoginDate: '',
                registerDate: '',
                childUnique: '',
                userUnique: ''
            },
            search_mode: '1',
            searchMode: {
                1: {
                    content: '手机号',
                    key: 'phone'
                },
                2: {
                    content: '用户名',
                    key: 'userName'
                },
                3: {
                    content: '宝宝姓名',
                    key: 'childName'
                }
            },
            IsVip: {
                100: '全部',
                0: 'okya用户',
                6: '微信公众号',
                9: '七田真启蒙',
                8: 'H5渠道用户',
                1: '七田真老用户',
                2: '七田真新用户',
                3: 'okya新注册用户',
                5: '管理后台添加用户',
                4: '有赞购买新注册用户'
            }
        };
    },
    created() {
        this.searchOkyaUser();
    },
    methods: {
        async searchOkyaUser() {
            const data = this.okyaUserrForm;
            let res = await search(
                'okya_user/getPage',
                this.currentPage,
                this.limit,
                data
            );
            this.tableData = res.list;
            this.total = res.total;
        },
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage;
            this.searchOkyaUser();
        },
        handleSizeChange(limit) {
            this.limit = limit;
            this.currentPage = 1;
            this.searchOkyaUser();
        },
        handlePro(value, key) {
            this.okyaUserrForm.city = '';
            this.currentPage = 1;
            this.data[key] = value;
            this.searchOkyaUser();
        },
        handleChange(value, key) {
            this.currentPage = 1;
            this.data[key] = value;
            this.searchOkyaUser();
        },
        searChMode(val) {
            this.okyaUserrForm.phone = '';
            this.okyaUserrForm.userName = '';
            this.okyaUserrForm.childName = '';
        },
        userTime() {
            if (this.okyaTime !== null) {
                this.okyaUserrForm.startDate = `${this.okyaTime[0]} 00:00:00`;
                this.okyaUserrForm.endDate = `${this.okyaTime[1]} 23:59:59`;
            } else {
                this.okyaUserrForm.startDate = '';
                this.okyaUserrForm.endDate = '';
            }
            this.currentPage = 1;
            this.searchOkyaUser();
        },
        async userExcel() {
            const header = [
                { title: '用户名', key: 'userName' },
                { title: '用户角色', key: 'role' },
                { title: '手机号码', key: 'phone' },
                { title: '宝宝昵称', key: 'childName' },
                { title: '宝宝性别', key: 'childSex' },
                { title: '宝宝年龄', key: 'age' },
                { title: '注册时间', key: 'registerDate' },
                { title: '最近一次登录', key: 'lastLoginDate' },
                { title: '省', key: 'province' },
                { title: '市', key: 'city' },
                { title: '会员', key: 'tpis' },
                { title: '来源', key: 'vips' }
            ];
            const data = this.okyaUserrForm;
            await searchExport('okya_user/PageExport', header, '用户表', data);
        },
        checkInform(mu) {
            // 查看信息
            this.$router.push({
                name: 'view-user-detail',
                params: { mu}
            });
            this.$store.dispatch('global/setData', { userDetailMu: mu});
        },
        showUpdateInform(scope) {
            // 编辑
            this.editUserForm.childName = scope.childName;
            this.editUserForm.sex = scope.sex;
            this.editUserForm.birthday = scope.birthday;
            this.editUserForm.userName = scope.userName;
            this.editUserForm.phone = scope.phone;
            this.editUserForm.province = scope.province;
            this.editUserForm.city = scope.city;
            this.editUserForm.role = scope.role;
            this.editUserForm.unionId = scope.unionId;
            this.editUserForm.openId = scope.openId;
            let lastLogin = scope.lastLoginDate.split(' ');
            let lastLoginDate =
                lastLogin[0].split('-').join('/') + ' ' + lastLogin[1];
            this.editUserForm.lastLoginDate = lastLoginDate;
            let register = scope.registerDate.split(' ');
            let registerDate =
                register[0].split('-').join('/') + ' ' + lastLogin[1];
            this.editUserForm.registerDate = registerDate;
            this.editUserForm.userUnique = scope.userUnique;
            this.editUserForm.childUnique = scope.childUnique;
            this.showUpdateForm = true;
        },
        saveUser(userForm) {
            let data = this.editUserForm;
            let mu = this.editUserForm.userUnique;
            this.$refs[userForm].validate(async valid => {
                if (valid) {
                    const res = await submit('okya_user/updateDetail', {
                        data,
                        mu
                    });
                    if (res) {
                        this.showUpdateForm = false;
                        this.searchOkyaUser();
                    }
                } else {
                    return false;
                }
            });
        },
        resetFieldForm() {
            this.$refs['userForm'].resetFields();
        },
        onClose() {
            this.resetFieldForm();
            this.showUpdateForm = false;
        }
    }
};
</script>

<style lang="less" scoped>
.el-form {
    width: auto;
}
.el-input {
    width: auto;
}
.form-header {
    display: flex;
    flex-flow: row;
    flex: 1;
    .element-div {
        display: flex;
        flex-wrap: wrap;
        .el-select-twe {
            margin-left: 5px;
        }
        .input-seach {
            margin-left: 5px;
        }
        .form-but {
            flex: 1;
            display: flex;
            flex-flow: row-reverse;
        }
    }
}
.el-form-item__content{
    margin-left: 45px;
}
.prop-input {
    width: 350px;
}
.save-button {
    text-align: center;
}
</style>
