<template>
  <div class="user-management">
    <!-- 搜索过滤区域 -->
    <div class="filter-container">
      <el-form ref="filterForm" :model="filterParams" size="small" class="search-form">
        <el-form-item label="管理员名称" class="form-item">
          <el-input v-model="filterParams.account" placeholder="请输入" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item class="form-item action-btns">
          <el-button type="primary" @click="handleFilter">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" @click="addAdmin">添加管理员</el-button>
    <!-- 用户列表表格 -->
    <el-table :data="adminList" stripe style="width: 100%; margin-top: 20px;">
      <el-table-column prop="adminId" label="管理员账号" width="160"></el-table-column>
      <el-table-column prop="adminPassword" label="管理员密码" width="160"></el-table-column>
      <el-table-column prop="adminName" label="管理员名称" width="140"></el-table-column>
      <el-table-column prop="adminEmail" label="管理员邮箱" width="160"></el-table-column>
      <el-table-column prop="adminPhone" label="管理员电话" width="160"></el-table-column>
      <el-table-column prop="adminCreateTime" label="注册时间" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="warning" size="small" @click="handleDisable(scope.row.adminId)">
            注销
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[1, 10, 15, 20]"
      layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
      @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-start" />

    <!-- 添加管理员弹窗 -->
    <el-dialog v-model="addAdminDialogVisible" title="添加管理员" width="30%" center>
      <el-form ref="addAdminForm" :model="addAdminFormData" label-width="120px">
        <el-form-item label="管理员名称">
          <el-input v-model="addAdminFormData.adminName" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addAdminDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddAdmin">确定</el-button>
      </template>
    </el-dialog>

    <!-- 显示账号密码弹窗 -->
    <el-dialog v-model="showAccountPasswordDialogVisible" title="管理员账号密码" width="30%" center>
      <p>管理员账号：{{ adminAccount }}</p>
      <p>管理员密码：{{ adminPassword }}</p>
      <template #footer>
        <el-button @click="showAccountPasswordDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../utils/axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

// 搜索参数
const filterParams = ref({
  account: '',
});

// 用户列表数据（模拟数据）
const adminList = ref([]);
// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(800);
const router = useRouter();

const getAdminList = async () => {
  const res = await api.get('/admin/getAllAdmin', {
    params: {
      'currentPage': currentPage.value,
      'pageSize': pageSize.value
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (res.data.flag === true) {
    console.log(res.data);
    console.log(res.data.result);
    adminList.value = res.data.result.records;
    total.value = res.data.result.total;
  }
};
getAdminList();

// 模拟查询接口
const handleFilter = async () => {
  if (filterParams.value.account) {
    const res = await api.get('/admin/selectAdmin', {
      params: {
        'adminName': filterParams.value.account,
        'currentPage': currentPage.value,
        'pageSize': pageSize.value,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (res.data.flag === true) {
      adminList.value = res.data.result.records;
      total.value = res.data.result.total;
    }
  }
};

// 重置表单
const handleReset = () => {
  filterParams.value = {
    account: '',
  };
  currentPage.value = 1;
  getAdminList();
};

// 注销用户
const handleDisable = async (row) => {
  const res = await api.delete('/admin/deleteAdmin', {
    params: {
      'adminId': row,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
  if (res.data.flag === true) {
    ElMessage.success('注销成功');
    getAdminList();
  } else {
    ElMessage.error('注销失败');
  }
};

// 当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  getAdminList()
};
// 当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  currentPage.value = num
  getAdminList()
};

// 添加管理员弹窗相关
const addAdminDialogVisible = ref(false);
const addAdminFormData = ref({
  adminName: ''
});

// 显示账号密码弹窗相关
const showAccountPasswordDialogVisible = ref(false);
const adminAccount = ref('');
const adminPassword = ref('');
const handleAddAdmin = async () => {
  if (!addAdminFormData.value.adminName) {
    ElMessage.error('管理员名称不能为空');
    return;
  }
  try {
    // 这里假设后端接口是 /admin/addAdmin，根据实际情况修改
    const res = await api.post('/admin/addAdmin',null, {
      params:{
        'adminName': addAdminFormData.value.adminName
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    if (res.data.flag === true) {
      ElMessage.success('添加管理员成功');
      console.log("add",res.data.result);
      addAdminDialogVisible.value = false;
      adminAccount.value = res.data.result.adminId;
      adminPassword.value = res.data.result.adminPassword;
      showAccountPasswordDialogVisible.value = true;
      getAdminList();
    } else {
      ElMessage.error('添加管理员失败');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('网络错误，请重试');
  }
};


const addAdmin = () => {
  addAdminDialogVisible.value = true;
};
</script>

<style scoped>
.time-pickers {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-picker {
  /* 设置固定宽度 */
  width: 180px;
}

/* 调整Element UI内部样式 */
:deep(.range-picker .el-input__inner) {
  padding-left: 15px;
  padding-right: 15px;
}

:deep(.range-picker .el-input__prefix),
:deep(.range-picker .el-input__suffix) {
  display: none;
}

.separator {
  color: #606266;
  font-size: 14px;
  padding: 0 2px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;
}

.form-item {
  margin-bottom: 1px;
  display: flex;
  align-items: center;
}

/* .separator {
  color: #999;
  padding: 0 4px;
} */

.action-btns {
  margin-left: auto;
}

/* 调整表单标签间距 */
:deep(.el-form-item__label) {
  padding-right: 8px;
}

.user-management {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

/* .fliter-time {
  display: flex;
  flex-direction: row;
} */
.fliter-btn {
  margin-right: 10px;
}

.el-table__header {
  background-color: #696868;
}
</style>