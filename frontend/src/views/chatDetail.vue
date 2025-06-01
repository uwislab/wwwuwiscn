<template>
    <div class="chat-detail-page">
      <div class="header">
        <el-button type="text" @click="goBack">返回</el-button>
      </div>
      <div class="chat-container">
        <div class="chat-header">{{ chatStyle }}</div>
        <div class="chat-record" ref="chatRecordRef">
          <div
            v-for="(message, index) in chatRecords"
            :key="index"
            :class="['chat-message', message.messageRole===User? 'user-message' : 'robot-message']"
          >
            {{ message.messageContent }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { ElButton } from 'element-plus';
  import { useRoute } from 'vue-router';
  import { useRouter } from 'vue-router';
  import api from '../utils/axios'
  
  // 模拟聊天记录数据，isUser为true表示用户消息，false表示机器人消息
  const chatRecords = ref([]);
  const chatStyle = ref('');
  const route = useRoute();
  const router = useRouter();
  const User = 'User';
  const getChatStyle=async () => {
    console.log("query",route.query.conAiStyle)
    const style = route.query.conAiStyle;
    if(style==0){
        chatStyle.value = '默认';
    }else if(style==1){
        chatStyle.value = '嬛嬛';
    }else if(style==2){
        chatStyle.value = '夸夸机器人';
    }
    console.log("style",style)
  }
  getChatStyle();
  console.log("chatStyle",chatStyle.value)
  const getChatRecords=async () => {
    const res = await api.get('/conversation/getConversationDetail',{
        params: {
          'conversationId': route.query.conId
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    if(res.data.flag===true){
      chatRecords.value = res.data.result;
    }
}
  getChatRecords();
  const goBack = () => {
    router.back();
  };
  </script>
  
  <style scoped>
  .chat-detail-page {
    padding: 10px;
  }
  
  .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .chat-container {
    border: 1px solid #409eff;
    border-radius: 4px;
    height: 600px;
    width: 50%;
    overflow-y: auto;
  }
  
  .chat-header {
    text-align: center;
    padding: 10px 0;
    background-color: #f4f4f5;
  }
  
  .chat-record {
    padding: 10px;
  }
  
  .chat-message {
    padding: 8px 12px;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  
  .user-message {
    background-color: #f0f9ff;
    align-self: flex-end;
  }
  
  .robot-message {
    background-color: #d9ecff;
    align-self: flex-start;
  }
  </style>