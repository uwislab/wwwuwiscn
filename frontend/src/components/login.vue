<template>
    <div class="login_containner">
        <!-- 最外层的大盒子 -->
        <div class="box">
            <!-- 滑动盒子 -->
            <div class="pre-box" :style="preBoxStyle">
                <h1>WELCOME</h1>
                <div class="img-box">
                    <img :src="imgSrc" alt="">
                </div>
            </div>
            <!-- 注册盒子 -->
            <div class="register-form">
                <!-- 标题盒子 -->
                <div class="title-box">
                    <h1>注册</h1>
                </div>
                <!-- 输入框盒子 -->
                <el-form ref="registerFormRef" :rules="registerrules" :model="registerForm" class="input-box"
                    label-width="0">
                    <el-form-item prop="username">
                        <el-input class="custom-input" v-model="registerForm.username" placeholder="账户"></el-input>
                    </el-form-item>

                    <el-form-item prop="name">
                        <el-input class="custom-input" v-model="registerForm.name" placeholder="名称"></el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input type="password" class="custom-input" v-model="registerForm.password"
                            placeholder="密码"></el-input>
                    </el-form-item>

                    <el-form-item prop="checkpass">
                        <el-input type="password" class="custom-input" v-model="registerForm.checkpass"
                            placeholder="确认密码"></el-input>
                    </el-form-item>

                    <el-form-item prop="email">
                        <el-input class="custom-input" v-model="registerForm.email" placeholder="邮箱"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="register()">注册</el-button>
                        <el-button type="info" @click="resetregisterForm()">重置</el-button>
                        <p @click="mySwitch">已有账号?去登录</p>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 登录盒子 -->
            <div class="login-form">
                <!-- 标题盒子 -->
                <div class="title-box">
                    <h1>登录</h1>
                </div>

                <!-- 输入框盒子 -->
                <el-form ref="loginFormRef" :rules="loginrules" :model="loginForm" class="input-box" label-width="0">
                    <el-form-item prop="username">
                        <el-input class="custom-input" v-model="loginForm.username" placeholder="账户"></el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input type="password" class="custom-input" v-model="loginForm.password"
                            placeholder="密码"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="login()">登录</el-button>
                        <el-button type="info" @click="resetLoginForm()">重置</el-button>
                        <p @click="mySwitch">没有账号?去注册</p>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

            loginForm: {
                username: "admin",
                password: "123"
            },

            loginrules: {
                username: [
                    { required: true, message: '请输入账户', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ]
            },

            registerForm: {
                username: "",
                name: "",
                password: "",
                checkpass: "",
                email: ""
            },



            registerrules: {
                username: [
                    { required: true, message: '请输入账户', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入密码'));
                            } else {
                                if (this.registerForm.checkpass !== '') {
                                    this.$refs.registerFormRef.validateField('checkpass');
                                }
                                callback();
                            }
                        }, trigger: 'blur'
                    }
                ],
                checkpass: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请再次输入密码'));
                            } else if (value !== this.registerForm.password) {
                                callback(new Error('两次输入密码不一致!'));
                            } else {
                                callback();
                            }
                        }, trigger: 'blur'
                    }
                ],
                email: [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]
            },


            flag: false,
            preBoxStyle: {
                transform: 'translateX(0%)',
                backgroundColor: '#edd4dc'
            },
            imgSrc: require('@/assets/img/login1.jpg'),
        };
    },
    methods: {
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },

        resetregisterForm() {
            this.$refs.registerFormRef.resetFields();
        },

        login() {
            this.$refs.loginFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post("login", this.loginForm);
                if (res.flag == "ok") {
                    this.$message.success("登录成功");
                    // window.sessionStorage.setItem("user", res.user);//存储user对象
                    window.sessionStorage.setItem("user", JSON.stringify(res.user)); // 存储user对象为JSON字符串
                    sessionStorage.setItem('userId', res.user.id);
                    sessionStorage.setItem('user_static', res.user.user_static);
                    this.$router.push({ path: "/home" });
                }
                else {
                    this.$message.error("登录失败");
                }
            });
        },

        register() {

            // 首先验证表单
            this.$refs.registerFormRef.validate(async valid => {
                if (!valid) return;

                // 检查用户名是否已被注册
                const usernameCheckResponse = await this.$http.post("checkUsername", { username: this.registerForm.username });
                if (usernameCheckResponse.data.exists) {
                    // 如果用户名存在，提示用户
                    return this.$message.error("该账户已被注册");
                }

                // 如果用户名不存在，继续添加用户
                const { data: res } = await this.$http.post("addUser", this.registerForm);
                if (res !== "success") {
                    return this.$message.error("添加用户失败");
                }
                this.$message.success("添加用户成功");
                this.resetregisterForm();
            });

        },

        mySwitch() {
            if (this.flag) {
                this.preBoxStyle.transform = 'translateX(0%)';
                this.preBoxStyle.backgroundColor = '#edd4dc';
                this.imgSrc = require('@/assets/img/login1.jpg');
                this.resetregisterForm();
            } else {
                this.preBoxStyle.transform = 'translateX(100%)';
                this.preBoxStyle.backgroundColor = '#c9e0ed';
                this.imgSrc = require('@/assets/img/login2.jpg');
                this.resetLoginForm();
            }
            this.flag = !this.flag;
        },

    },
};
</script>

<style src="../assets/css/login.css"></style>
<style lang="less" scoped>
.error {
    color: red;
}

.success {
    color: green;
}
</style>
