<template>
    <el-container>
        <el-main>
            <el-form class="demo-ruleForm" label-width="180px" label-position="left" :model="basicForm">
                <div class="el-span"> 基础信息</div>
                <el-form-item label="用户姓名:">
                    <span>{{basicForm.userName}}</span>
                </el-form-item>
                <el-form-item label="用户角色:">
                    <span>{{basicForm.role}}</span>
                </el-form-item>
                <el-form-item label="联系方式:">
                    <span> {{basicForm.phone}}</span>
                </el-form-item>
                <el-form-item label="宝宝姓名:">
                    <span>{{basicForm.childname}}</span>
                </el-form-item>
                <el-form-item label="宝宝性别:">
                    <span>{{SEX[basicForm.sex]}}</span>
                </el-form-item>
                <el-form-item label="宝宝年龄:">
                    <span>{{basicForm.age}}</span>
                </el-form-item>
                <el-form-item label="会员:">
                    <span>{{IsTpl[basicForm.isTpl] }}</span>
                </el-form-item>
                <div class="el-span">账号数据</div>
                <el-form-item label="注册时间:">
                    <span>{{basicForm.registerDate}}</span>
                </el-form-item>
                <el-form-item label="最近一次活跃时间:">
                    <span>{{basicForm.lastLoginDate}}</span>
                </el-form-item>
                <el-form-item label="城市:">
                    <span v-if="basicForm.province">{{basicForm.province}}-{{basicForm.city}}</span>
                </el-form-item>
                <el-form-item label="来源:">
                    <span>{{IsVip[basicForm.isVip]}}</span>
                </el-form-item>
                <div class="el-span">收货地址</div>
                <el-form-item label="收货姓名:">
                    <span>{{basicForm.addressName}}</span>
                </el-form-item>
                <el-form-item label="收货电话:">
                    <span>{{basicForm.addressPhone}}</span>
                </el-form-item>
                <el-form-item label="收货地址:">
                    <span v-if="basicForm.addressProvince">{{basicForm.addressProvince}} - {{basicForm.addressCity}} - {{basicForm.addressDistrict}} {{basicForm.addressAddress}}</span>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>
<script>
export default {
    props: {
        basicForm: {
            type: Object,
        },
        staue: Number,
        userMu: String,
    },
    data() {
        return {
            name: '', // 用户姓名
            role: '', //  用户角色
            phone: '', // 联系方式
            childname: '',  //  宝宝姓名
            sex: '',    // 宝宝性别
            age: '',  // 宝宝年龄
            isTpl: '',  // 会员
            registerDate: '', // 注册时间
            activedDate: '', //最后一次登录账户
            lastLoginDate: '', // 最后一次登录APP
            province: '',  //  所在地区  省
            city: '', // 所在地区 市
            isVip: '', // 来源
            addressName: '', // 收货姓名
            addressPhone: '', // 收货电话
            addressAddress: '', // 收货地址
            addressProvince: '', // 省
            addressCity: '', // 市
            addressDistrict: '', // 区
            SEX: {
                1: '男',
                2: '女'
            },
            IsTpl: {
                0: '普通用户',
                1: '会员'
            },
            IsVip: {
                0: 'okya用户',
                1: '七田真老用户',
                2: '七田真新用户',
                3: 'okya新注册用户',
                4: '有赞购买新注册用户',
                5: '管理后台添加用户',
                6: '微信公众号',
                8: 'H5渠道用户',
                9: '七田真启蒙',
            }
        };
    },
    methods: {

    },
};
</script>
<style lang="less" scoped>
.el-form {
    width: auto;
    .el-form-item {
        margin-bottom: 6px;
        border-bottom: 1px solid #8c939d;
        border-color: rgba(215, 215, 215, 1);
        padding: 10px 0 10px 0;
    }
    .form-footer {
        width: 65%;
        margin: 20px 0 0 0;
        text-align: center;
        justify-content: center;
    }
    .el-span {
        width: auto;
        padding-top: 10px;
        padding-bottom: 10px;
        margin-bottom: 6px;
        border-bottom: 1px solid #8c939d;
        border-color: rgba(215, 215, 215, 1);
    }
}
</style>
