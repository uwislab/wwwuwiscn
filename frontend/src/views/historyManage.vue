<template>
  <div class="history-management">
    <div class="history-bar">
      <el-button type="primary" size="small" @click="handleDelete()">一键删除</el-button>
    </div>
    <el-table :data="conversationList" stripe style="width: 100%; margin-top: 20px;">
      <el-table-column prop="conId" label="对话ID" width="180"></el-table-column>
      <el-table-column prop="conAiStyle" label="对话风格" width="180"></el-table-column>
      <el-table-column prop="lastMessage" label="最新消息" width="200"></el-table-column>
      <el-table-column prop="conDeleteFlag" label="状态" width="120">
        <template #default="scope">
          <span v-if="scope.row.conDeleteFlag === 0">正常</span>
          <span v-else>已删除</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastMessageTime" label="更新时间" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleCheck(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[1, 10, 15, 20]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-start" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../utils/axios'
import { useRouter } from 'vue-router';

// 模拟活动列表数据
// const activityList = ref([
//   {
//     id: '123',
//     title: '最强妈妈评选',
//     intro: '为期2个月评选比赛',
//     status: 'online',
//     activityTime: {
//       start: '2017-10-31 23:12:00',
//       end: '2017-12-31 23:12:00'
//     },
//     updateTime: '2017-10-31 23:12:00'
//   },
//   // 重复数据模拟
//   {
//     id: '123',
//     title: '最强妈妈评选',
//     intro: '为期2个月评选比赛',
//     status: 'online',
//     activityTime: {
//       start: '2017-10-31 23:12:00',
//       end: '2017-12-31 23:12:00'
//     },
//     updateTime: '2017-10-31 23:12:00'
//   }
// ]);
const conversationList = ref({})

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);
const router = useRouter();

const getConversationList = async() => {
  const res = await api.get('/conversation/getAllConversation', {
    params: {
      'currentPage': currentPage.value,
      'pageSize': pageSize.value
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  if(res.data.flag===true){
    console.log(res.data)
    console.log(res.data.result);
    conversationList.value = res.data.result.records;
    total.value = res.data.result.total;
  }
}
getConversationList()
// 模拟操作方法

const handleCheck = (row) => {
  console.log('对话详情', row.conId);
  router.push({
    path:'/chatDetail',
    query: {
      conId: row.conId,
      conAiStyle: row.conAiStyle
    }
  });
};
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    currentPage.value = 1
    getConversationList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    currentPage.value = num
    getConversationList()
}
const handleDelete = async() => {
  const res = await api.delete('/conversation/deleteConversation')
  if(res.data.flag===true){
    console.log(res.data)
    getConversationList()
  }
}

</script>

<style scoped>
.history-management {
  padding: 20px;
}

.history-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.el-table__header {
  background-color: #f5f7fa;
}

.pagination-container {
    display: flex;
    justify-content: center;
  }
</style>