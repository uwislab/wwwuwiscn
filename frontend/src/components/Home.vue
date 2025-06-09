<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/img/login1.jpg" class="logo-img">
                <span>图形化机器人编程平台后台管理</span>
            </div>
            <div></div>
            <!-- <el-button type="info" @click="logout">退出登录</el-button> -->
            <div>
                <!-- 显示当前登录用户并展示下拉菜单 -->
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img src="../assets/img/login1.jpg" alt="用户头像"
                            style="height: 30px; border-radius: 50%; margin-right: 10px;" />
                        {{ loginuser.username }}
                        <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- 项目社区 -->
                        <!-- <el-dropdown-item command="projectCommunity">
                            <i class="el-icon-share" style="margin-right: 10px;"></i>
                            项目社区
                        </el-dropdown-item> -->
                        <!-- 创建项目 -->
                        <el-dropdown-item command="createProject">
                            <i class="el-icon-plus" style="margin-right: 10px;"></i>
                            创建项目
                        </el-dropdown-item>
                        <!-- 退出登录 -->
                        <el-dropdown-item command="logout">
                            <i class="el-icon-switch-button" style="margin-right: 10px;"></i>
                            退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 主体侧边栏 -->
            <el-aside width="200px">
                <!-- <div class="toggle-button" @click="toggleCollapase">|||</div> -->
                <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" unique-opened
                    :router="true" :defalut-active="activePath">
                    <el-menu-item :index="item.location" v-for="item in menuList" :key="item.id"
                        v-if="!(loginuser.role_id === 1 && item.required_role_id === 0)"
                        @click="saveNavState(item)">
                        <i :class="item.icon"></i>
                        <span>{{ item.name }}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <!-- 主体内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>

export default {

    data() {
        return {
            menuList: [],
            loginuser: {
                username: "未登录",
            },
            // isCollapse: true,
            activePath: '/Welcome',
        }
    },

    created() {

        this.getMenuList();
        this.activePath = window.sessionStorage.getItem("activePath");
        this.getUserInfo();//获取登录用户信息

    },

    methods: {
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
                            username: user.name,
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

        // 处理下拉菜单的点击事件
        handleCommand(command) {
            switch (command) {
                case "logout":
                    this.logout(); // 调用退出登录方法
                    break;
                default:
                    break;
            }
        },

        //获取导航菜单
        async getMenuList() {
            const { data: res } = await this.$http.get('menus');
            console.log(res);

            if (res.status != 200) {
                return this.$message.error("获取菜单列表失败");
            }
            this.menuList = res.menus;//数据回填
        },

        //侧边栏折叠
        toggleCollapase() {
            this.isCollapse = !this.isCollapse;
        },

        //保存当前激活的菜单
        saveNavState(item) {

            // window.sessionStorage.setItem('activePath', activePath);
            // this.activePath = activePath;

            // 获取当前路径
            const currentPath = this.$route.path;

            // 获取当前登录用户的 role_id
            const userStatic = this.loginuser.role_id;

            // 如果找到了菜单项且 role_id 为 1 且 required_role_id 为 0，则跳转到 none.vue
            if (item && userStatic === 1 && item.required_role_id === 0) {
                if (currentPath !== '/none') {
                    this.$router.push('/none');
                }
            } else {
                if (currentPath !== item.location) {
                    window.sessionStorage.setItem('activePath', item.location);
                    this.activePath = item.location;
                    this.$router.push(item.location); // 默认情况下，根据 activePath 进行跳转
                }
            }
        },

        // 启动定时刷新用户信息
        startUserInfoRefresh() {
            this.userInfoRefreshInterval = setInterval(() => {
                this.getUserInfo();
            }, 500); // 每0.5秒刷新一次
        },

        // 停止定时刷新用户信息
        stopUserInfoRefresh() {
            if (this.userInfoRefreshInterval) {
                clearInterval(this.userInfoRefreshInterval);
            }
        },

        // 处理下拉菜单的点击命令
        handleCommand(command) {
            if (command === 'logout') {
                this.logout();
            } else if (command === 'projectCommunity') {
                this.$router.push('/projects'); // 跳转到projects界面
            } else if (command === 'createProject') {
                this.$router.push('/scratchBlocks'); // 跳转到ScratchBlocks页面
            }
        },

    },
}
</script>
<style scoped>
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

.el-aside {
    background-color: #333744;

    .el-menu {
        border-right: none;
    }
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
</style>