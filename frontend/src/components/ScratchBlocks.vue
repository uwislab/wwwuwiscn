<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/img/login1.jpg" class="logo-img">
                <span>图形化机器人编程</span>
            </div>
            <div></div>
            <!-- <el-button type="info" @click="logout">退出登录</el-button> -->
            <div>
                <el-button type="primary" @click="addDialogVisible = true">保存项目</el-button>
                <!-- 显示当前登录用户并展示下拉菜单 -->
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img src="../assets/img/login1.jpg" alt="用户头像"
                            style="height: 30px; border-radius: 50%; margin-right: 10px;" />
                        {{ loginuser.username }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- 个人中心 -->
                        <el-dropdown-item command="profile">
                            <i class="el-icon-user" style="margin-right: 10px;"></i>
                            个人中心
                        </el-dropdown-item>
                        <!-- 项目社区 -->
                        <!-- <el-dropdown-item command="projectCommunity">
                            <i class="el-icon-share" style="margin-right: 10px;"></i>
                            项目社区
                        </el-dropdown-item> -->
                        <!-- 退出登录 -->
                        <el-dropdown-item command="logout">
                            <i class="el-icon-switch-button" style="margin-right: 10px;"></i>
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <el-main>
            <iframe src="js/index.html" frameborder="0" width="100%" height="600px"></iframe>
            <!-- Code -->
            <!-- <div v-if="generatedCode" class="code-display">
                <h3>Generated Code:</h3>
                <pre><code class="hljs">{{ generatedCode }}</code></pre>
                <button @click="copyCode" class="copy-btn">Copy Code</button>
            </div> -->
            <!-- 新增区域 -->
            <el-dialog title="保存项目" :visible.sync="addDialogVisible" width="60%" @close="addDialogClosed">
                <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
                    <el-form-item label="项目名称" prop="title">
                        <el-input v-model="addForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="项目创建者" prop="username">
                        <el-input v-model="addForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="项目描述" prop="description">
                        <el-input v-model="addForm.description"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="C代码" prop="c_code">
                        <el-input v-model="addForm.c_code" disabled></el-input>
                    </el-form-item> -->
                </el-form>
                <!-- 内容底部区域 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addProject">确定</el-button>
                </span>
            </el-dialog>

        </el-main>
    </el-container>

</template>

<script>
export default {
    data() {
        return {
            loginuser: {
                username: "未登录",
            },
            generatedCode: '',
            addDialogVisible: false, //对话框状态
            addForm: {
                title: "",
                username: "",
                description: "",
                c_code: "",
                user_id: "",
            },

            //添加表单验证
            addFormrules: {
                title: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
                ],
            },
        };
    },

    created() {
        this.activePath = window.sessionStorage.getItem("activePath");
        this.getUserInfo();//获取登录用户信息
    },

    mounted() {
        // 从localStorage中获取blocklyCode
        const blocklyCode = localStorage.getItem('blocklyCode');
        if (blocklyCode) {
            this.generatedCode = blocklyCode;
            this.addForm.c_code = this.generatedCode; // 为C代码字段赋值
        }
        // 监听页面刷新事件
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    },

    beforeDestroy() {
        // 移除页面刷新事件监听器
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    },

    methods: {
        copyCode() {
            // 创建一个临时的textarea元素
            const tempTextarea = document.createElement('textarea');
            tempTextarea.value = this.generatedCode;
            document.body.appendChild(tempTextarea);
            // 选择textarea内容并复制
            tempTextarea.select();
            document.execCommand('copy');
            // 移除临时的textarea元素
            document.body.removeChild(tempTextarea);
            // 提示用户代码已复制
            alert('代码已复制到剪贴板');
        },

        //退出登录
        logout() {
            window.sessionStorage.clear();//清除session
            this.$router.push('/login');//回到首页
        },

        getUserInfo() {
            const userJson = sessionStorage.getItem('user');
            if (userJson) {
                try {
                    const user = JSON.parse(userJson);
                    if (user) {
                        this.loginuser = {
                            username: user.name
                        };
                        this.addForm.username = this.loginuser.username; // 为项目创建者字段赋值
                        this.addForm.user_id = user.id;
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

        // 处理下拉菜单的点击命令
        handleCommand(command) {
            if (command === 'logout') {
                this.logout();
            } else if (command === 'profile') {
                this.$router.push('/welcome'); // 跳转到welcome界面projectCommunity
            } else if (command === 'projectCommunity') {
                this.$router.push('/projects'); // 跳转到projects界面
            }
        },

        //监听添加
        addDialogClosed() {
            this.$refs.addFormRef.resetFields(); // 重置表单
        },
        addProject() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                // 从localStorage获取最新的blocklyCode
                const blocklyCode = localStorage.getItem('blocklyCode');
                if (blocklyCode) {
                    this.addForm.c_code = blocklyCode;
                } else {
                    this.$message.error('未找到Blockly代码');
                    return;
                }
                try {
                    // 确保user_id字段存在于addForm中
                    if (!this.addForm.user_id) {
                        this.$message.error('未获取到用户ID');
                        return;
                    }
                    const { data: res } = await this.$http.post("addProject", this.addForm);
                    if (res !== "200") {
                        this.$message.success("保存项目成功");
                    } else {
                        this.$message.error(res.msg || "保存项目失败");
                    }
                } catch (error) {
                    console.error('保存项目时出错:', error);
                    this.$message.error("保存项目时发生错误");
                }
                this.addDialogVisible = false;
            });
        },

        // 刷新前提示
        handleBeforeUnload(event) {
            event.preventDefault();
            event.returnValue = ''; // 标准浏览器
            return '刷新后内容将不被保存，是否刷新？'; // 旧版IE
        },

    }
}
</script>

<style>
.home-container {
    height: 100vh;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    color: #ffffff;
    font-size: 24px;
    align-items: center;
}

.el-header div {
    display: flex;
    align-items: center;
    /* 确保图片和文字垂直居中 */
    gap: 15px;
    /* 调整图片和文字之间的间距 */
}

.el-main {
    background-color: #eaedf1;
}

.logo-img {
    height: 58px;
    border-radius: 50%;
}

.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    display: flex;
    align-items: center;
}

.el-icon-arrow-down {
    font-size: 12px;
}

/* 按钮样式 */
.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

.code-display {
    margin-top: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 4px;
    position: relative;
}

.code-display pre {
    background: #272822;
    padding: 15px;
    border-radius: 4px;
    color: #f8f8f2;
    overflow-x: auto;
}

.copy-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    background: #00b3ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.copy-btn:hover {
    background: #0099dd;
}
</style>