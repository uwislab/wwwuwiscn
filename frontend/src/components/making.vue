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
        <el-main>
            <div class="project-list-container">
                <div
                    v-for="(project, index) in projects"
                    :key="index"
                    class="project-item"
                >
                    <div class="project-header">
                        <div class="creator-info">
                            <span class="creator-name">{{ project.userName }}</span>
                            <span class="create-time">{{ formatTime(project.created_at) }}</span>
                        </div>
                    </div>
                    <div class="project-content">
                        <h2 class="project-title">{{ project.title }}</h2>
                        <p class="project-desc">{{ project.description }}</p>
                    </div>
                    <div class="project-footer">
                        <span class="view-count">浏览{{ project.view_count }}次</span>
                        <div class="interaction-icons">
                            <i class="fa fa-thumbs-o-up like-icon"></i>
                            <i class="fa fa-comment comment-icon"></i>
                            <i class="fa fa-share-alt share-icon"></i>
                        </div>
                        <div class="comment-input">
                            <input
                                type="text"
                                placeholder="评论"
                                class="comment-input-field"
                            >
                            <i class="fa fa-camera camera-icon"></i>
                        </div>
                    </div>
                </div>

                <!-- 分页 -->
                <el-pagination
                    layout="prev, pager, next"
                    :total="total"
                    :page-size="queryInfo.pageSize"
                    @current-change="handlePageChange"
                />
            </div>
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
            projects: [],
            total: 0,
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
                query: ''
            },
        };
    },

    created() {
        this.activePath = window.sessionStorage.getItem("activePath");
        this.getUserInfo();//获取登录用户信息
        this.fetchProjects();
    },

    mounted() {
        his.getVisibleProjects();
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
                            username: user.name
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

        // 处理下拉菜单的点击命令
        handleCommand(command) {
            if (command === 'logout') {
                this.logout();
            } else if (command === 'profile') {
                this.$router.push('/welcome'); // 跳转到welcome界面
            } else if (command === 'createProject') {
                this.$router.push('/scratchBlocks'); // 跳转到ScratchBlocks页面
            }
        },

        async fetchProjects() {
            try {
                const response = await this.$http.get('/allVisibleProjects')
                if (response.status === 200) {
                    this.projects = response.data
                }
            } catch (error) {
                console.error('获取项目列表失败', error)
            }
        },

        formatTime(timestamp) {
            const now = new Date()
            const postTime = new Date(timestamp)
            const diff = now - postTime
            const seconds = Math.floor(diff / 1000)
            if (seconds < 60) {
                return `${seconds}秒前`
            }
            const minutes = Math.floor(seconds / 60)
            if (minutes < 60) {
                return `${minutes}分钟前`
            }
            const hours = Math.floor(minutes / 60)
            if (hours < 24) {
                return `${hours}小时前`
            }
            const days = Math.floor(hours / 24)
            if (days < 7) {
                return `${days}天前`
            }
            return postTime.toLocaleDateString('zh-CN')
        },

        // 获取可见性为 0 的项目
        async getVisibleProjects() {
            try {
                const { data } = await this.$http.get('/allVisibleProjects', {
                params: {
                    pageNum: this.queryInfo.pageNum,
                    pageSize: this.queryInfo.pageSize,
                    query: this.queryInfo.query
                }
            });
            this.projects = data.data || [];
            this.total = data.numbers || 0;
            } catch (error) {
                console.error('获取公开项目失败:', error);
                this.$message.error('获取项目失败，请检查网络');
            }
        },

        // 分页处理
        handlePageChange(pageNum) {
            this.queryInfo.pageNum = pageNum;
            this.getVisibleProjects();
        },

        // 时间格式化函数
        formatTime(timeStr) {
            if (!timeStr) return '';
            const date = new Date(timeStr);
            return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 
                ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }

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

.project-list-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 15px;
}
.project-item {
    background-color: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 15px;
}
.project-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.creator-info {
    flex: 1;
}
.creator-name {
    font-size: 16px;
    font-weight: bold;
}
.create-time {
    font-size: 14px;
    color: #999;
}
.project-content {
    margin-bottom: 10px;
}
.project-title {
    font-size: 18px;
    margin-bottom: 5px;
}
.project-desc {
    font-size: 14px;
    line-height: 1.5;
    color: #666;
}
.project-footer {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.view-count {
    font-size: 14px;
    color: #999;
}
.interaction-icons {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    color: #999;
}
.comment-input {
    display: flex;
    align-items: center;
    border-top: 1px solid #e6e6e6;
    padding-top: 10px;
}
.comment-input-field {
    flex: 1;
    border: none;
    padding: 5px;
    font-size: 14px;
}
.camera-icon {
    font-size: 20px;
    color: #999;
    margin-left: 10px;
}

</style>