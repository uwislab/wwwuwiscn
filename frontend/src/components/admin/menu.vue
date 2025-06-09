<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 主体 -->
        <el-card>
            <el-row :gutter="25">
                <el-col :span="10">
                    <!-- 搜索 -->
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getmenuList">
                        <el-button slot="append" icon="el-icon-search" @click="getmenuList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加 -->
                <!-- <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加菜单</el-button>
                </el-col> -->
            </el-row>

            <!-- 列表显示 -->
            <el-table :data="menuList" border stripe>
                <el-table-column type="index"></el-table-column><!-- 索引列 -->
                <el-table-column label="菜单名称" prop="name"></el-table-column>
                <el-table-column label="所需角色" prop="required_role_id">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.required_role_id)">
                            {{ getStatusText(scope.row.required_role_id) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="显示顺序" prop="morder"></el-table-column>
                <el-table-column label="路径" prop="location"></el-table-column>
                <el-table-column label="菜单图标">
                    <template slot-scope="scope">
                        <i :class="scope.row.icon"></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" class="fixed-width-btn"
                            @click="showEditDialog(scope.row.id)"></el-button>
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
        <el-dialog title="修改菜单" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="70px">
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单权限" prop="required_role_id">
                    <el-radio-group v-model="editForm.required_role_id" size="mini">
                        <el-radio-button :label="0" style="background-color: white; color: black;"
                            @click.native.prevent="editForm.required_role_id = 0">管理员</el-radio-button>
                        <el-radio-button :label="1" style="background-color: white; color: black;"
                            @click.native.prevent="editForm.required_role_id = 1">普通用户</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="显示顺序" prop="moder">
                    <el-input v-model="editForm.morder"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="location">
                    <el-input v-model="editForm.location" disabled></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon">
                    <el-select v-model="editForm.icon" placeholder="请选择图标">
                        <el-option
                            v-for="icon in iconList"
                            :key="icon"
                            :label="icon"
                            :value="icon">
                            <i :class="icon"></i> {{ icon }}
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <!-- 内容底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editMenuInfo">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import axios from 'axios';

export default {

    data() {
        return {

            //查询信息实体
            queryInfo: {
                query: "",     //查询信息
                pageNum: 1,    //当前页
                pageSize: 10   //每页最大数
            },
            menuList: [],     //用户列表
            total: 0,          //总记录数
            
            //修改信息
            editForm: {
            },
            //显示和隐藏用户栏
            editDialogVisible: false,

            //修改表单验证
            editFormrules: {
                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                    { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
                ],
            },

            // 图标列表
            iconList: [
                'el-icon-edit',
                'el-icon-delete',
                'el-icon-search',
                'el-icon-plus',
                'el-icon-minus',
                'el-icon-setting',
                'el-icon-user',
                'el-icon-more-outline',
                'el-icon-star-off',
                'el-icon-goods',
                'el-icon-bell',
                'el-icon-warning-outline',
            ],

        }
    },

    created() {

        this.getmenuList();

    },

    methods: {

        //获取所有菜单
        async getmenuList() {
            const { data: res } = await this.$http.get("allMenus", { params: this.queryInfo });
            this.menuList = res.data; // 将返回数据赋值
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
            this.getmenuList();
        },
        //每页显示最大数改变时触发
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getmenuList();
        },
        
        //显示对话框
        async showEditDialog(id) {

            const { data: res } = await this.$http.get('UpdataMenu?id=' + id);
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
        editMenuInfo() {
            this.$refs.editFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) return;
                // 发起请求
                const { data: res } = await this.$http.put("editMenu", this.editForm);
                console.log(res);
                if (res != "success") return this.$message.error("操作失败！！！");
                this.$message.success("操作成功！！！");
                //隐藏
                this.editDialogVisible = false;
                this.getmenuList();
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