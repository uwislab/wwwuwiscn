// pages/conversations/conversations.js
var focus
var isShowView
const token = wx.getStorageSync('token')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:false,
    isShowView:true,
    showModal: false,
    styles: ['默认', '甄嬛', '夸夸机器人','复杂任务','仿真控制'],
    styleIndex: 0,
    newAiName:'',
    remark:'',
    converations:[
    ]
  },
  handleLongPress(e) {
    const item = e.currentTarget.dataset.item 
    const conId = item.conversation.conId;
    console.log("conId:",conId)
    const actions = ['删除对话'];
  
    wx.showActionSheet({
      itemList: actions,
      success: (res) => {
        if (!res.cancel) {
          if (actions[res.tapIndex] === '删除对话') {
            this.deleteConversation(conId); // 调用删除函数
          } 
        }
      }
    });
  },
  async deleteConversation(conId){
    wx.request({
      url: 'http://localhost:8888/funny/user/chat/deleteConversation',
      method: 'put',
      header:{
        //   wx.getStorageSync('token') 从缓存中取出token值
        "token":token,
        "Content-Type":'application/x-www-form-urlencoded'
        },
        data:{
          "conversationId":conId
        },
        success:(res) =>{
          this.getConversations()
        },
        fail:(err) =>{
          console.log("获取对话失败")
        }
    })
  },
  // 时间规范化
  formatTime(originTime) {
    console.log(originTime)
    const targetTime = new Date(originTime);
    const now = new Date();
    const year = now.getFullYear();
    const targetYear = targetTime.getFullYear();
    const diffDay = Math.ceil((now - targetTime) / (1000 * 60 * 60 * 24));

    // 格式化时分
    const formatHM = (date) => {
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    };

    if (targetYear < year) {
      return targetTime.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    if (diffDay > 1) {
      return targetTime.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
    }
    if (diffDay === 1) {
      return `昨天 ${formatHM(targetTime)}`;
    }
    return formatHM(targetTime);
  },
  // 打开弹窗
  openModal() {
    wx.request({
      url: 'http://localhost:8888/funny/user/chat/getNewConversation',
      method: 'get',
      header:{
        //   wx.getStorageSync('token') 从缓存中取出token值
        "token":token
        },
        success:(res) =>{
          console.log(res.data)
          console.log("aiName:"+res.data.result)
          this.setData({newAiName:res.data.result})
        },
        fail:(err) =>{
          console.log("获取机器名失败")
        }
    })
    this.setData({ showModal: true })
  },
  // 取消
  back(){
    this.closeModal()
  },

  // 关闭弹窗
  closeModal() {
    this.setData({ showModal: false })
  },

  // 阻止事件冒泡
  stopPropagation() {},

  // 输入备注
  onInputRemark(e) {
    this.setData({ remark: e.detail.value })
  },

  // 选择风格
  onStyleChange(e) {
    this.setData({ styleIndex: e.detail.value })
  },

  // 确认设置
  confirmSettings() {
    const aiName = this.data.newAiName
    wx.request({
      url: 'http://localhost:8888/funny/user/chat/addConversation', //自己的服务接口地址
      method: 'post',
      header:{
          //   wx.getStorageSync('token') 从缓存中取出token值
          "token":token,
          "Content-Type":'application/x-www-form-urlencoded'
        },
      data:{
        "aiName":aiName,
        "aiStyle":this.data.styleIndex,
        "aiNotes":this.data.remark
      },
      success:(res) =>{
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 200
        })
        this.onLoad();
      }  
    })
    this.closeModal()
  },
  bindtap:function(event){
    wx.navigateTo({
      url: "search/search"
    })
  },
  bindfocus:function(){
    this.setData({
         focus:true
    })
    this.setData({
      isShowView:false
    })
  },
  bindblur:function(){
    this.setData({
        focus:false
    })
this.setData({
     isShowView:true
})
},
  goChat(e){
    console.log("nowItem:",e.currentTarget.dataset.item)
    const data = e.currentTarget.dataset.item
    const conId = data.conversation.conId
    wx.navigateTo({
      url: `/pages/chat/chat?conId=${conId}`
    })
},
async getConversations(){
  wx.request({
    url: 'http://localhost:8888/funny/user/chat/selectConversations', //自己的服务接口地址
    method: 'get',
    header:{
      //   wx.getStorageSync('token') 从缓存中取出token值
      "token":token
    },  
    success: (res) => {
      const conversations = res.data.result;
conversations.forEach((item) => {
  if (item.conversation.lastMessage) {
    item.conversation.lastMessage = item.conversation.lastMessage.replace(/\n{2,}/g, ' '); // 替换不间断空行为普通空格
  }
});
this.setData({ 
  conversations:conversations
 });
 console.log("conversations:",conversations)
    },
    fail: (err) =>{
      console.log("请求失败",err)
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      this.getConversations()
      console.log("token:"+wx.getStorageSync("token"))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})