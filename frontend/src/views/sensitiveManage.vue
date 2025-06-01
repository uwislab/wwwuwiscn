<template>
    <div class="sensitive-word-management">
      <div class="action-bar">
        <el-button type="primary" size="small" @click="showAddDialog = true">新增</el-button>
      </div>
      
      <el-dialog v-model="showAddDialog" title="新增敏感词">
        <el-input v-model="newWord" placeholder="请输入敏感词"></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showAddDialog = false">取消</el-button>
            <el-button type="primary" @click="addWord">确定</el-button>
          </span>
        </template>
      </el-dialog>

      <div class="word-list">
        <el-tag
          v-for="(word) in sensitiveWords"
          closable
          @close="deleteWord(word.senId)"
        >
          {{ word.senWord }}
        </el-tag>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import api from '../utils/axios'
  
  // 敏感词列表
  const sensitiveWords = ref([]);
  // 新增对话框控制
  const showAddDialog = ref(false);
  // 新敏感词
  const newWord = ref('');
  
  const getSensitiveWords = async() => {
    const res = await api.get('/sensitive/getWords');
    if(res.data.flag===true){
      sensitiveWords.value = res.data.result;
    }
  };
  getSensitiveWords();
  // 添加敏感词
  const addWord = async() => {
    if (newWord.value.trim()) {
      const res = await api.post('/sensitive/addWord', {
        'sensitiveWord': newWord.value.trim(),
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      if(res.data.flag===true){
      getSensitiveWords()
    }
    }
  };
  
  // 删除敏感词
  const deleteWord = async(senId) => {
    const res = await api.delete('/sensitive/deleteWord', {
      params: {
        'sensitiveId': senId
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(res.data.flag===true){
      showAddDialog.value = false
      getSensitiveWords()
    }
  };
  </script>
  
  <style scoped>
  .sensitive-word-management {
    padding: 20px;
  }
  
  .action-bar {
    margin-bottom: 20px;
  }
  
  .word-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .el-tag {
    margin-top: 5px;
  }
  
  .el-dialog {
    width: 300px;
  }
  </style>