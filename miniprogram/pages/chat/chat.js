// pages/talk/talk.js
const MAX_WAVEFORM = 50 // 波形最大高度百分比
const user = wx.getStorageSync('user')
const token = wx.getStorageSync
('token')
// const plugin = requirePlugin('WechatSI')
Page({
  data: {
    messages: [
    ],
    user:user,
    conversationShow:{},
    scrollTop: 0,
    isVoiceMode: false,
    inputText: '',
    audioContext: null,
    currentPlayingIndex: -1,
    recorderManager: null,
    recordStartTime: 0,
    isRecording: false,
    isSwiping: false,
    touchStartY:0,
    // 语音识别配置
    chatBackground:'',
    showInputIndicator: false
  },
  // 实时波形处理
  // updateWaveform(buffer) {
  //   const chunkSize = 1024
  //   let sum = 0
    
  //   // 简单计算音频振幅
  //   for (let i = 0; i < buffer.length; i += chunkSize) {
  //     const chunk = buffer.slice(i, i + chunkSize)
  //     sum += chunk.reduce((a, b) => a + Math.abs(b), 0)
  //   }
    
  //   const amplitude = Math.min(MAX_WAVEFORM, (sum / chunkSize) * 2)
  //   this.setData({
  //     waveformData: [...this.data.waveformData.slice(-30), amplitude]
  //   })
  // },
  handleTouchMove(e) {
    if (!this.data.isRecording) return;
    const touch = e.touches[0];
    const startY = this.data.touchStartY;
    const deltaY = touch.clientY - startY; // 计算向下滑动距离（向上滑动时为负数）
    // 上滑取消：touch.clientY < startY，即 deltaY < 0，绝对值 > 50
    this.setData({ 
      isSwiping: Math.abs(deltaY) > 50 && deltaY < 0 // 向上滑动超过50px
    });
  },
// 长按消息处理
handleLongPress(e) {
  const index = e.currentTarget.dataset.index;
  console.log("index:",index)
  const message = e.currentTarget.dataset.message;
  const type = message.messageTypeFlag;
  const actions = type === 0 
    ? ['删除消息'] 
     : ['语音识别', '删除消息']; // 0 为文字，1 为语音

  wx.showActionSheet({
    itemList: actions,
    success: (res) => {
      if (!res.cancel) {
        if (actions[res.tapIndex] === '删除消息') {
          this.deleteMessage(message.messageId); // 调用删除函数
        } else if (actions[res.tapIndex] === '语音识别') {
          this.recognizeVoice(index); // 调用识别函数
        }
      }
    }
  });
},
async deleteMessage(messageId){
  wx.request({
    url: 'http:/localhost:8888/funny/user/chat/deletePartChatHistory',
    method: 'put',
    header:{
        //   wx.getStorageSync('token') 从缓存中取出token值
        "token":token,
        "Content-Type":'application/x-www-form-urlencoded'
      },
      data:{
        "messageId":messageId
      },
      success:(res) =>{
        this.getMessages(this.data.conversationShow.conversation.conId)
      },
      fail: (err) => {
        console.error(err.data.msg);
    }
  })
},
async recognizeVoice(index){
  this.setData({
    [`messages[${index}].messageRecognition`]: 1, 
  })
},

  // 保存到本地缓存
  async saveVoiceToCache(tempFilePath) {
    try {
      const fs = wx.getFileSystemManager()
      const savedPath = `${wx.env.USER_DATA_PATH}/${Date.now()}.mp3`
      
      await new Promise((resolve, reject) => {
        fs.saveFile({
          tempFilePath,
          filePath: savedPath,
          success: resolve,
          fail: reject
        })
      })
      
      return savedPath
    } catch (err) {
      console.error('保存失败:', err)
      return tempFilePath
    }
  },
 getMessages(conId) {
  wx.request({
    url: 'http://localhost:8888/funny/user/chat/selectChatHistory',
    method: 'get',
    header:{
        //   wx.getStorageSync('token') 从缓存中取出token值
        "token":token,
        "Content-Type":'application/x-www-form-urlencoded'
      },
      data:{
        "conversationId":conId
      },
      success:(res) =>{
        this.setData({ messages: res.data.result }, () => {
          // 使用 setTimeout 确保 DOM 渲染完成后再滚动（解决部分场景下滚动无效问题）
          setTimeout(() => {
            this.setData({ scrollTop: 10000 });
          }, 100);
        });
      },
      fail: (err) => {
        console.error('请求失败:', err);
    }
  })
 },
 async getConversationShow(conId){
  wx.request({
    url: 'http://localhost:8888/funny/user/chat/getConversationShow',
    method: 'get',
    header:{
        //   wx.getStorageSync('token') 从缓存中取出token值
        "token":token,
        "Content-Type":'application/x-www-form-urlencoded'
      },
      data:{
        "conId":conId
      },
      success:(res) =>{
        this.setData({
          conversationShow:res.data.result
        })
      },
      fail: (err) => {
        console.error('请求失败:', err);
    }
  })
 },

  onLoad(options) {
    const conId = options.conId
    this.getConversationShow(conId);
    this.getMessages(conId);
    const recordAuth = false;
    if(wx.getStorageSync('recordAuth')){
      recordAuth = true
    }
    if(!recordAuth){
      this.getSetting()
    }
    console.log('chatBack',wx.getStorageSync('user').backUrl)
    this.setData({
      chatBackground:wx.getStorageSync('user').backUrl
    })
    this.recorderManager = wx.getRecorderManager()
    this.audioContext = wx.createInnerAudioContext()
    // 录音管理器配置
    // this.recorderManager.onFrameRecorded(res => {
    //   const buffer = new Int16Array(res.frameBuffer)
    //   this.updateWaveform(buffer)
    // })
    // 录音事件监听
    this.recorderManager.onStart(() => {
      this.setData({ recordStartTime: Date.now() })
      console.log('录音开始')
    })

    this.recorderManager.onStop(async (res) => {
      console.log("onStop")
      const duration = res.duration || Math.round((Date.now() - this.data.recordStartTime) / 1000)
      console.log("duration")
      if (this.data.isSwiping) {
          // 上滑取消
          this.setData({ isSwiping: false })
          return
      }
      console.log("tempFilePath:",res.tempFilePath)
      await this.handleRecordSuccess(res.tempFilePath, duration)
  })


    this.recorderManager.onError((err) => {
      console.error('录音失败:', err)
      wx.showToast({ title: '录音失败', icon: 'none' })
    })
    // 音频播放事件监听
    this.audioContext.onEnded(() => {
      console.log("pauseStart")
      this.resetPlayingState()
      console.log("pauseEnd")
    })

    this.audioContext.onError(() => {
      this.resetPlayingState()
      wx.showToast({ title: '播放失败', icon: 'none' })
    })
  },

  toggleInputMode() {
    this.setData({ isVoiceMode: !this.data.isVoiceMode })
  },

  // 输入框事件
  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  // 发送文字消息
  sendText() {
    if (!this.data.inputText.trim()) return
    this.addTextMessage(this.data.inputText)
    this.setData({
      showInputIndicator:true
    })
    const message = this.data.inputText
    this.setData({
      inputText: '',
    })
    if(this.data.conversationShow.conversation.conAiStyle===4){
      wx.request({
        url: 'http://localhost:8888/funny/robot/controlRobotByText', //自己的服务接口地址
          method: 'get',
          header:{
            //   wx.getStorageSync('token') 从缓存中取出token值
            "token":token,
            "Content-Type":"application/x-www-form-urlencoded"
          },
          data:{
            'userMessage':message,
            'conversationId':this.data.conversationShow.conversation.conId,
          },
          success:(res) =>{
            if(res.data.flag){
              this.setData({
                showInputIndicator:false
              })
              this.getMessages(this.data.conversationShow.conversation.conId)
            }
          },
          fail:(err) =>{
            wx.showToast({
              title: '系统错误',
              icon: 'none',
              duration:200
            })
          }
      })
    }else{
      wx.request({
        url: 'http://localhost:8888/funny/user/chat', //自己的服务接口地址
          method: 'get',
          header:{
            //   wx.getStorageSync('token') 从缓存中取出token值
            "token":token,
            "Content-Type":"application/x-www-form-urlencoded"
          },
          data:{
            'userMessage':message,
            'conversationId':this.data.conversationShow.conversation.conId,
          },
          success:(res) =>{
            if(res.data.flag){
              this.setData({
                showInputIndicator:false
              })
              this.getMessages(this.data.conversationShow.conversation.conId)
            }
          },
          fail:(err) =>{
            wx.showToast({
              title: '系统错误',
              icon: 'none',
              duration:200
            })
          }
      })
    }
  },

  getSetting() {
    // 请求录音授权
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            fail: () => this.showAuthGuide()
          })
        } 
      }
    })
  },

  startRecord(e) {
    console.log("startRecord")
    if (this.recorderManager.state === 'recording') {
      wx.showToast({ title: '请先停止当前录音', icon: 'none' });
      return;
    }
    this.setData({
      isRecording: true,
      touchStartY: e.touches[0].clientY,
      isSwiping: false,
    })
    console.log("recorderBefore")
    this.recorderManager.start({
      format: 'mp3',
      sampleRate: 16000,
      numberOfChannels: 1,
      frameSize: 50, // 每50ms获取一次数据
    })
    console.log("recorderAfter")
  },

  async stopRecord() {
    if (this.recorderManager.state === 'stopped') return;
    this.recorderManager.stop()
    this.setData({ isRecording: false })
  },

  // 新增语音消息处理逻辑
  async handleRecordSuccess(tempFilePath, duration) {
    try {
      console.log("handleRecordSuccess")
      // 3. 添加消息
      this.addVoiceMessage(tempFilePath,duration)
      console.log("messageAdd")
        // 2. 上传到后端
        this.setData({ showInputIndicator: true }); // 显示提示
        const voiceUrl = await this.uploadVoiceToServer(tempFilePath, duration)
        console.log("uploadVoice:",voiceUrl)
        this.setData({ showInputIndicator: false }); // 显示提示
        this.getMessages(this.data.conversationShow.conversation.conId);
    } catch (err) {
        console.log("处理语音失败")
        this.setData({ showInputIndicator: false }); // 显示提示
        wx.showToast({ title: '处理语音失败', icon: 'none' })
    }
},
  
  // 上传到后端
  async uploadVoiceToServer(tempFilePath, duration) {
    console.log("serverStart")
    if(this.data.conversationShow.conversation.conAiStyle===4){
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'http://localhost:8888/funny/robot/controlRobotByVoice',
          filePath: tempFilePath,
          name: 'file',
          header: {
            "token": token,
            // 注意：上传文件时 Content-Type 应为 multipart/form-data，无需手动设置，框架自动处理
          },
          formData: {
            'duration': duration,
            'conversationId': this.data.conversationShow.conversation.conId
          },
          success: (res) => {
            console.log("上传后端：",res.data)
              resolve(res.data.result);
          },
          fail: (err) => {
            console.log("errorMessage:",res.data.msg)
            reject(err);
          }
        });
      });
    }else{
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'http://localhost:8888/funny/user/chat/voiceChat',
          filePath: tempFilePath,
          name: 'file',
          header: {
            "token": token,
            // 注意：上传文件时 Content-Type 应为 multipart/form-data，无需手动设置，框架自动处理
          },
          formData: {
            'duration': duration,
            'conversationId': this.data.conversationShow.conversation.conId
          },
          success: (res) => {
            console.log("上传后端：",res.data)
              resolve(res.data.result);
          },
          fail: (err) => {
            console.log("errorMessage:",res.data.msg)
            reject(err);
          }
        });
      });
    }
    
  },

  showAuthGuide() {
    wx.showModal({
      title: '需要麦克风权限',
      content: '请允许使用麦克风以发送语音消息',
      success(res) {
        if (res.confirm) {
          wx.openSetting()
        }
      }
    })
  },

  addTextMessage(messageContent) {
      const newMessage = {
        messageId:null,
        messageConId:this.data.conversationShow.conversation.conId,
        messageTypeFlag:0,
        messageContent:messageContent,
        messageVoiceContent:'',
        messageRole:'User',
        messageTime:this.formatTime(new Date()),
        messageDeleteFlag:0,
        messagePlaying:0,
        messageDuration:0,
        messageRecognition:0,
        messageRecText:'',
       }
       this.setData({
        messages: [...this.data.messages, newMessage],
        scrollTop: this.data.scrollTop + 10000
      })
  },

  addVoiceMessage(messageVoiceContent,duration) {
      const newMessage = {
        messageId:null,
        messageConId:this.data.conversationShow.conversation.conId,
        messageTypeFlag:1,
        messageContent:'',
        messageVoiceContent:messageVoiceContent,
        messageRole:'User',
        messageTime:this.formatTime(new Date()),
        messageDeleteFlag:0,
        messagePlaying:0,
        messageDuration:duration,
        messageRecognition:0,
        messageRecText:'',
       }
      this.setData({
        messages: [...this.data.messages, newMessage],
        scrollTop: this.data.scrollTop + 10000
      })
  },

  formatTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
},

  playAudio(e) {
    const index = e.currentTarget.dataset.index
    console.log("index:",index)
    const message = this.data.messages[index]
    console.log("1:",index)
    if (this.data.currentPlayingIndex === index) {
      // 点击正在播放的语音
      if (message.messagePlaying===1) {
        this.audioContext.pause()
        this.togglePlayingState(index, 0)
      } else {
        this.audioContext.play()
        this.togglePlayingState(index, 1)
      }
    } else {
      console.log("3:",index)
      // 切换新语音
      this.resetPlayingState()
      console.log("4:",index)
      this.setData({
        currentPlayingIndex : index,
      })
      this.audioContext.src = message.messageVoiceContent
      this.togglePlayingState(index, 1)
      this.audioContext.play()
      console.log("6:",index)
    }
  },

  togglePlayingState(index, state){
      console.log("toggleindex:",index)
    this.setData({
      [`messages[${index}].messagePlaying`]: state, 
    })
  },

  resetPlayingState() {
    console.log('reset:',this.data.currentPlayingIndex)
    if (this.data.currentPlayingIndex !== -1) {
      this.togglePlayingState(this.data.currentPlayingIndex, 0)
      this.setData({
        currentPlayingIndex:-1
      })
    }
  },

  // getCurrentTime() {
  //   const date = new Date()
  //   return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  // },
  goSetting(){
    const conId = this.data.conversationShow.conversation.conId
    wx.navigateTo({
      url: `/pages/conSetting/conSetting?conId=${conId}`,
    })
  },

  onUnload() {
    if (this.audioContext) {
      this.audioContext.destroy();
    }
  }
})