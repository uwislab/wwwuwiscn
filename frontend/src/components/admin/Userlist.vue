<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户信息</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 主体 -->
        <el-card>
            <el-row :gutter="25">
                <el-col :span="10">
                    <!-- 搜索 -->
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加 -->
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 列表显示 -->
            <el-table :data="userList" border stripe>
                <el-table-column type="index"></el-table-column><!-- 索引列 -->
                <el-table-column label="账户" prop="username"></el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="角色" prop="role_id">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.role_id)">
                            {{ getStatusText(scope.row.role_id) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" class="fixed-width-btn"
                            @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" class="fixed-width-btn"
                            @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 密码重置 -->
                        <el-tooltip effect="dark" content="重置密码" placement="top-start" :enterable="false">
                            <!--文字提示 enterable 隐藏-->
                            <el-button type="warning" icon="el-icon-setting" size="mini" class="fixed-width-btn"
                                @click="resetConfirm(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum" :page-sizes="[1, 2, 3, 10]" :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

        </el-card>

        <!-- 新增区域 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
                <el-form-item label="账户" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>
            <!-- 内容底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">确定</el-button>
            </span>
        </el-dialog>

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
                <el-form-item label="状态" prop="role_id">
                    <!-- 列表选择 -->
                    <!-- <el-select v-model="editForm.role_id" placeholder="请选择状态">
                        <el-option label="管理员" value="0"></el-option>
                        <el-option label="普通用户" value="1"></el-option>
                    </el-select> -->
                    <!-- 按钮选择 -->
                    <!-- <el-button type="primary" :class="{ 'active': editForm.role_id === 0 }"
                        @click="editForm.role_id = 0">
                        管理员
                    </el-button>
                    <el-button type="success" :class="{ 'active': editForm.role_id === 1 }"
                        @click="editForm.role_id = 1">
                        普通用户
                    </el-button> -->
                    <el-radio-group v-model="editForm.role_id" size="mini">
                        <el-radio-button :label="0" style="background-color: white; color: black;"
                            @click.native.prevent="editForm.role_id = 0">管理员</el-radio-button>
                        <el-radio-button :label="1" style="background-color: white; color: black;"
                            @click.native.prevent="editForm.role_id = 1">普通用户</el-radio-button>
                    </el-radio-group>
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

            //查询信息实体
            queryInfo: {
                query: "",     //查询信息
                pageNum: 1,    //当前页
                pageSize: 10   //每页最大数
            },
            userList: [],     //用户列表
            total: 0,          //总记录数
            addDialogVisible: false, //对话框状态
            addForm: {
                username: "",
                name: "",
                password: "",
                email: "",
                role_id: 1
            },

            //修改用户信息
            editForm: {
            },
            //显示和隐藏用户栏
            editDialogVisible: false,

            //添加表单验证
            addFormrules: {
                username: [
                    { required: true, message: '请输入账户', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            },

            //修改表单验证
            editFormrules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            },

        }
    },

    created() {

        this.getUserList();

    },

    methods: {

        //获取所有用户
        async getUserList() {
            const { data: res } = await this.$http.get("allUser", { params: this.queryInfo });
            this.userList = res.data; // 将返回数据赋值
            this.total = res.numbers; // 总个数
        },

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

        //当前页码改变时触发
        handleCurrentChange(newPageNum) {
            this.queryInfo.pageNum = newPageNum;
            this.getUserList();
        },
        //每页显示最大数改变时触发
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getUserList();
        },

        // 重置密码
        // async resetConfirm(userinfo) {
        //     const { data: res } = await this.$http.post(
        //         `resetPassword?id=${userinfo.id}&password=${userinfo.password}`
        //     );
        //     if (res != "success") {
        //         userinfo.password = !userinfo.password;
        //         return this.$message.error("操作失败！！！");
        //     }
        //     this.$message.success("操作成功！！！");
        //     this.getUserList();
        // },

        // 确认重置密码
        confirmReset(userinfo) {
            this.$confirm('此操作将重置该用户的密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.resetConfirm(userinfo);
            }).catch(() => {
                this.$message.info('取消重置');
            });
        },

        // 重置密码
        async resetConfirm(userinfo) {
            const { data: res } = await this.$http.post(
                `resetPassword?id=${userinfo.id}&password=${userinfo.password}`
            );
            if (res != "success") {
                userinfo.password = !userinfo.password;
                return this.$message.error("操作失败！！！");
            }
            this.$message.success("操作成功！！！");
            this.getUserList();
        },

        //监听添加用户
        addDialogClosed() {
            this.$refs.addFormRef.resetFields(); // 重置表单
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post("addUser", this.addForm);
                if (res != "success") {
                    return this.$message.error("添加用户失败");
                }
                this.$message.success("添加用户成功");
                this.addDialogVisible = false;
                this.getUserList();
            });

        },

        //删除用户
        async deleteUser(userId) {
            const confirmResult = await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult != 'confirm') {
                return this.$message.info("取消删除");
            }
            const { data: res } = await this.$http.delete(`deleteUser?id=${userId}`);
            if (res != "success") {
                return this.$message.info("删除失败");
            }
            this.$message.success("删除成功");
            this.getUserList();
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
                //隐藏
                this.editDialogVisible = false;
                this.getUserList();
            });
        },
    },
}
</script>

<style lang="less" scoped>
.el-radio-button__inner {
    background-color: white;
    color: black;
}

.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #409EFF; // 蓝色
    color: white;
    border-color: #409EFF;
}

.el-radio-button__orig-radio:checked+.el-radio-button__inner:hover,
.el-radio-button__inner:hover {
    background-color: white;
    color: black;
}
</style>