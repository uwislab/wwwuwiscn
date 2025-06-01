// pages/conSetting/conSetting.js
const token = wx.getStorageSync('token')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conversationShow:{},
    // userInfo: {
    //   avatar: '/images/default-avatar.png',
    //   nickname: '子非鱼',
    //   gender: 0, // 0'默认', 1'甄嬛',2'夸夸机器人'
    //   signature: '1111111111'
    // },
    styleMap: ["默认", "甄嬛","夸夸机器人"],
    styleIndex: 0,
    showEditModal: false,
    currentField: '',
    editValue: ''

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
  // 更换头像
  changeAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0]
        this.uploadAvatar(tempFilePath)
      }
    })
  },

  // 上传头像到服务器
  uploadAvatar(tempFilePath) {
    wx.showLoading({ title: '上传中...' })
    
    wx.uploadFile({
      url: 'http://localhost:8888/funny/user/chat/changeAiImage', //自己的服务接口地址
      filePath:tempFilePath,
      name:'file',
      // method:'POST',
      header:{
        //   wx.getStorageSync('token') 从缓存中取出token值
        "token":token,
        "Content-Type":"application/x-www-form-urlencoded"
      },
      formData:{
        'conversationId':this.data.conversationShow.conversation.conId
      },
        success:(res) =>{
          wx.hideLoading()
          console.log(res.data)
            this.setData({
              'conversationShow.conUrl':res.data.result
            })
            wx.setStorageSync('conversationShow', this.data.conversationShow)
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration:200
            });
            // this.onLoad()
        },
        fail:(err) =>{
          wx.hideLoading()
          wx.showToast({
            title: '错误',
            icon: 'none',
            duration:200
          })
        }
    })
  },

   // 打开编辑弹窗
   editField(e) {
    const field = e.currentTarget.dataset.field
    const value = this.data.conversationShow.conversation[field]
    
    this.setData({
      showEditModal: true,
      currentField: field,
      editValue: value,
      styleIndex: field === 'conAiStyle' ? value : 0
    })
  },

  // 输入框内容变化
  onInputEdit(e) {
    this.setData({ editValue: e.detail.value })
  },

  // 性别选择变化
  styleChange(e) {
    console.log("index:",e.detail.value)
    this.setData({ styleIndex: e.detail.value })
  },

  // 保存编辑
  saveEdit() {
    const { currentField, editValue, styleIndex } = this.data
    if (currentField === 'conAiStyle') {
      this.changeAiStyle(styleIndex)
    } else {
      this.changeAiNotes(editValue)
    }
    this.cancelEdit()
  },

  changeAiNotes(aiNotes){
    wx.request({
      url: 'http://localhost:8888/funny/user/chat/changeAiNotes', //自己的服务接口地址
        method: 'PUT',
        header:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data: {
          'conversationId':this.data.conversationShow.conversation.conId,
          'notes':aiNotes,
        },
        success:(res) =>{
          if(res.data.flag){
            this.setData({
              'conversationShow.conversation.conAiNotes' : aiNotes
            })
            wx.setStorageSync('conversationShow',this.data.conversationShow)
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration:200
            })
          }else{
            wx.showToast({
              title: '修改失败',
              icon: 'none',
              duration:200
            })
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
  },
  changeAiStyle(aiStyle){
    wx.request({
      url: 'http://localhost:8888/funny/user/chat/changeAiStyle', //自己的服务接口地址
        method: 'PUT',
        header:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data: {
          'conversationId':this.data.conversationShow.conversation.conId,
          'aiStyle':aiStyle,
        },
        success:(res) =>{
          if(res.data.flag){
            this.setData({
              'conversationShow.conversation.conAiStyle' : aiStyle
            })
            wx.setStorageSync('conversationShow',this.data.conversationShow)
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration:200
            })
          }else{
            wx.showToast({
              title: '修改失败',
              icon: 'none',
              duration:200
            })
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
  },
  // 关闭弹窗
  cancelEdit() {
    this.setData({
      showEditModal: false,
      currentField: '',
      editValue: ''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const conId = options.conId
    this.getConversationShow(conId)
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