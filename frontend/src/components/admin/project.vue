<template>
    <!-- 保持原有的模板代码不变 -->
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>项目管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 主体 -->
        <el-card>
            <el-row :gutter="25">
                <el-col :span="10">
                    <!-- 搜索 -->
                    <el-input placeholder="请输入项目名称进行搜索" v-model="queryInfo.query" clearable @clear="getProjectList">
                        <el-button slot="append" icon="el-icon-search" @click="getProjectList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加 -->
                <el-col :span="4">
                    <el-button type="primary" @click="gotoMakePage">添加项目</el-button>
                </el-col>
            </el-row>

            <!-- 列表显示 -->
            <el-table :data="projects" border stripe>
                <el-table-column type="index"></el-table-column><!-- 索引列 -->
                <el-table-column label="项目名称" prop="title"></el-table-column>
                <el-table-column label="项目创建者" prop="userName"></el-table-column>
                <el-table-column label="项目状态" prop="visibility">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.visibility === 0 ? 'info' : 'success'">
                            {{ scope.row.visibility === 0 ? '未发布' : '已发布' }}
                        </el-tag>
                        <el-switch style="padding-left: 10px;" v-model="scope.row.visibility" :active-value="1"
                            :inactive-value="0" @change="() => publishProject(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="项目创建时间" prop="created_at">
                    <template slot-scope="scope">
                        {{ scope.row.created_at }} <!-- 格式化时间 -->
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showProjectDetail(scope.row)">查看项目</el-button>
                        <!-- 修改 -->
                        <!-- <el-button type="primary" icon="el-icon-edit" size="mini" class="fixed-width-btn"
                            @click="showEditDialog(scope.row.id)"></el-button> -->
                        <!-- 删除 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" class="fixed-width-btn"
                            @click="deleteProject(scope.row.project_id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum" :page-sizes="[1, 2, 3, 10]" :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>

        </el-card>

        <!-- 修改区域 -->
        <el-dialog title="修改项目信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="70px">
                <el-form-item label="项目名称" prop="title">
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>
                <el-form-item label="项目创建者" prop="userName">
                    <el-input v-model="editForm.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="项目描述" prop="description">
                    <el-input v-model="editForm.description"></el-input>
                </el-form-item>
                <el-form-item label="项目代码" prop="Code">
                    <el-input v-model="editForm.cCode" disabled></el-input>
                </el-form-item>
            </el-form>
            <!-- 内容底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editProjectInfo">确定</el-button>
            </span>
        </el-dialog>

        <el-drawer :visible.sync="table" direction="rtl" size="50%">
        </el-drawer>

        <!-- 项目详情对话框 -->
        <el-dialog title="项目详情" :visible.sync="detailDialogVisible" width="50%">
            <el-descriptions :column="1" border>
                <!-- <el-descriptions-item label="项目ID">{{ currentProject.id }}</el-descriptions-item> -->
                <el-descriptions-item label="项目名称">{{ currentProject.title }}</el-descriptions-item>
                <!-- 
                <el-descriptions-item label="所属用户">{{ currentProject.username }}</el-descriptions-item> -->
                <el-descriptions-item label="创建时间">{{ currentProject.created_at }}</el-descriptions-item>
                <el-descriptions-item label="项目描述">
                    <div style="white-space: pre-line;">{{ currentProject.description }}</div>
                </el-descriptions-item>
                <el-descriptions-item label="项目代码">
                    <el-collapse>
                        <el-collapse-item title="查看项目代码">
                            <pre style="max-height: 300px; overflow: auto; max-width: 450px;">
                        {{ currentProject.c_code }}
                    </pre>
                        </el-collapse-item>
                    </el-collapse>
                </el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查询信息实体
            queryInfo: {
                query: "",     // 查询信息
                pageNum: 1,    // 当前页
                pageSize: 10   // 每页最大数
            },
            projects: [],     // 列表
            total: 0,          // 总记录数
            //修改信息
            editForm: {
            },
            //显示和隐藏修改信息弹窗
            editDialogVisible: false,

            //修改表单验证
            editFormrules: {
                title: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
                ],
            },

            table: false,
            detailDialogVisible: false, //详情对话框状态
            currentProject: {} //当前查看的项目详情
        }
    },

    created() {
        this.getProjectList();
    },

    methods: {

        // 获取所有项目信息
        async getProjectList() {
            try {

                // 从 sessionStorage 中获取用户信息
                const user = JSON.parse(sessionStorage.getItem('user'));

                let apiEndpoint = '/allProject'; // 默认接口
                let params = { ...this.queryInfo }; // 复制查询参数

                // 判断是否是受限用户，需要只看自己的项目
                if (user && user.role_id === 1) {
                    apiEndpoint = '/myProject';
                    params.userId = user.id; // 添加 userId 参数
                }

                // 发起请求
                const { data: res } = await this.$http.get(apiEndpoint, { params });

                // const { data: res } = await this.$http.get("allProject", { params: this.queryInfo });
                // console.log('返回的项目数据:', res.data); // 添加调试输出

                // 检查返回的数据中是否包含 id 属性
                // res.data.forEach(project => {
                //     console.log('项目 ID:', project.project_id);
                // });
                this.projects = res.data; // 将返回数据赋值
                this.total = res.numbers; // 总个数
            } catch (error) {
                console.error('获取项目列表失败:', error);
            }
        },

        // 跳转到 make.vue 页面
        gotoMakePage() {
            // this.$router.push('/SnapEditor');
            this.$router.push('/ScratchBlocks');
        },

        // 当前页码改变时触发
        handleCurrentChange(newPageNum) {
            this.queryInfo.pageNum = newPageNum;
            this.getProjectList();
        },
        // 每页显示最大数改变时触发
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getProjectList();
        },

        // 删除项目
        async deleteProject(id) {
            if (!id || id <= 0) {
                this.$message.warning("无效的项目ID");
                return;
            }
            try {
                const confirmResult = await this.$confirm(
                    "此操作将永久删除该项目, 是否继续?",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                );
                if (confirmResult !== "confirm") {
                    this.$message.info("已取消删除");
                    return;
                }
                const { data: res } = await this.$http.delete(`/deleteProject?id=${id}`);
                if (res === "success") {
                    this.$message.success("删除成功");
                    this.getProjectList(); // 刷新列表
                } else {
                    this.$message.error("删除失败");
                }
            } catch (error) {
                if (error === "cancel") {
                    this.$message.info("已取消删除");
                } else {
                    console.error("删除项目失败:", error);
                    this.$message.error("删除失败，请重试或联系管理员");
                }
            }
        },
        //显示对话框
        async showEditDialog(project_id) {
            const { data: res } = await this.$http.get('getUpdataProject?id=' + project_id);
            this.editForm = res;
            this.editDialogVisible = true;
        },
        //关闭修改
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        },
        //确认修改
        editProjectInfo() {
            this.$refs.editFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
                // 发起请求
                const { data: res } = await this.$http.put("editProject", this.editForm);
                console.log(res);
                if (res != "success") return this.$message.error("操作失败！！！");
                this.$message.success("操作成功！！！");
                //隐藏
                this.editDialogVisible = false;
                this.getProjectList();
            });
        },
        // 显示项目详情
        async showProjectDetail(project) {
            this.currentProject = project;
            this.detailDialogVisible = true;
            // 如果项目信息已经完整，直接显示
            // if (project.id && project.title) {
            //     this.currentProject = project;
            //     this.detailDialogVisible = true;
            // } else {
            //     // 否则请求完整项目信息
            //     try {
            //         const { data: res } = await this.$http.get(`projectDetail?id=${project.project_id}`);
            //         this.currentProject = res.data;
            //         this.detailDialogVisible = true;
            //     } catch (error) {
            //         this.$message.error("获取项目详情失败");
            //     }
            // }
        },

        async publishProject(project) {
            const id = project.project_id;
            if (!id) {
                this.$message.warning('无效的项目ID');
                return;
            }
            try {
                const { data: res } = await this.$http.post(`/toggleVisibility?id=${id}`);
                if (res.code === 200) {
                    this.$message.success(res.msg || '发布成功');
                } else {
                    this.$message.error(res.msg || '发布失败');
                    // 回滚状态
                    project.visibility = project.visibility === 1 ? 0 : 1;
                }
            } catch (error) {
                console.error('请求失败:', error);
                this.$message.error('请求失败，请检查网络或重试');
                // 回滚状态
                project.visibility = project.visibility === 1 ? 0 : 1;
            }
        },
    },
}
</script>

<style lang="less" scoped></style>