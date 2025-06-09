<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人信息</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 用户信息显示区域 -->
        <div class="user-info">

            <el-descriptions title="个人信息" size="middle">
                <el-descriptions-item label="账户">{{ userInfo.username }}</el-descriptions-item>
                <el-descriptions-item label="名称">{{ userInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
                <el-descriptions-item label="用户角色">
                    <el-tag :type="getStatusType(userInfo.role_id)">
                        {{ getStatusText(userInfo.role_id) }}
                    </el-tag>
                </el-descriptions-item>
            </el-descriptions>
            <el-button @click="showEditDialog(userInfo.id)">修改信息</el-button>
        </div>

        <!-- 修改区域 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="70px">
                <el-form-item label="账户" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <!-- 内容底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editUserInfo">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {

    data() {
        return {

            //修改用户信息
            editForm: {
            },
            //显示和隐藏用户栏
            editDialogVisible: false,

            userInfo: {
                id: "",
                username: "",
                name: "",
                email: "",
                role_id: 0
            },

            //修改表单验证
            editFormrules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            },

        }
    },

    created() {
        this.getUserInfo();
    },

    methods: {

        // 根据状态值返回文本
        getStatusText(status) {
            switch (status) {
                case 0:
                    return "管理员";
                case 1:
                    return "普通用户";
            }
        },

        // 根据状态值返回类型
        getStatusType(status) {
            switch (status) {
                case 0:
                    return "primary"; // 蓝色
                case 1:
                    return "success"; // 绿色
                case 2: // 假设2是禁用用户的标识
                    return "danger"; // 红色
                default:
                    return "";
            }
        },

        getUserInfo() {
            const userJson = sessionStorage.getItem('user');
            if (userJson) {
                try {
                    const user = JSON.parse(userJson);
                    if (user) {
                        this.userInfo = {
                            id: user.id,
                            username: user.username,
                            name: user.name,
                            email: user.email,
                            role_id: user.role_id
                        };
                    } else {
                        this.$message.error("获取用户信息失败");
                        this.$router.push('/login'); // 如果没有用户信息，跳转到登录页面
                    }
                } catch (e) {
                    console.error('解析用户信息时出错:', e);
                    this.$message.error("用户信息格式错误");
                    this.$router.push('/login'); // 如果解析出错，跳转到登录页面
                }
            } else {
                this.$message.error("未找到用户信息");
                this.$router.push('/login'); // 如果没有用户信息，跳转到登录页面
            }
        },

        //显示对话框
        async showEditDialog(id) {

            const { data: res } = await this.$http.get('getUpdataUser?id=' + id);
            // if (res != "success") {
            // userinfo.state = !userinfo.state;
            // return this.$message.error("操作失败！！！");
            // }
            // this.$message.success("操作成功！！！");

            this.editForm = res;
            this.editDialogVisible = true;
        },
        //关闭修改
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        //确认修改
        editUserInfo() {
            this.$refs.editFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
                // 发起请求
                const { data: res } = await this.$http.put("editUser", this.editForm);
                console.log(res);
                if (res != "success") return this.$message.error("操作失败！！！");
                this.$message.success("操作成功！！！");

                // 更新 editForm 中的数据到 userInfo
                this.userInfo = {
                    id: this.editForm.id,
                    username: this.editForm.username,
                    name: this.editForm.name,
                    email: this.editForm.email,
                    role_id: this.editForm.role_id
                };

                // 更新 sessionStorage 中的用户信息
                sessionStorage.setItem('user', JSON.stringify(this.userInfo));

                // 刷新用户信息显示区域
                this.getUserInfo();
                //隐藏
                this.editDialogVisible = false;
            });
        },

    },
}
</script>

<style lang="less" scoped>
.user-info {
    background-color: #ffffff;
    border-radius: 15px;
    padding: 15px;
}
</style>