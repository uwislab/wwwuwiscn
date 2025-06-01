// pages/user/user.js
const token = wx.getStorageSync('token')
Page({
  data: {
    // userInfo: {
    //   avatarUrl: '/images/default-avatar.png',
    //   nickName: '微信用户',
    //   gender: 0, // 0-女 1-男
    //   signature: ''
    // },
    userInfo:{},
    genderMap: ['未知','男', '女'],
    showEditModal: false,
    currentField: '',
    currentFieldName: '',
    editValue: '',
    genderIndex:null,
    flag:false
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

  // 上传头像
  uploadAvatar(tempFilePath) {
    wx.showLoading({ title: '上传中...' })
    // 这里替换为实际的上传接口
    wx.uploadFile({
      url: 'http://localhost:8888/funny/user/changeUserImage', //自己的服务接口地址
      filePath:tempFilePath,
      name:'multipartfile',
      // method:'POST',
      header:{
        //   wx.getStorageSync('token') 从缓存中取出token值
        "token":token,
        "Content-Type":"application/x-www-form-urlencoded"
      },
        success:(res) =>{
          wx.hideLoading()
          console.log(res.data)
            this.setData({
              'userInfo.pictureUrl':res.data.result
            })
            wx.setStorageSync('user', this.data.userInfo)
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration:200
            });
            this.onLoad()
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
    const fieldMap = {
      userName: '昵称',
      userSex: '性别',
      userSignature: '个性签名'
    }

    this.setData({
      showEditModal: true,
      currentField: field,
      currentFieldName: fieldMap[field],
      editValue: field === 'userSex' ? this.data.genderMap[this.data.userInfo.user.userSex] : this.data.userInfo.user[field],
      genderIndex:this.data.userInfo.user.userSex
      // userSex: field === 'userSex' ? this.data.userInfo.user.userSex : 0
    })
  },

  // 输入框内容变化
  handleInputChange(e) {
    this.setData({ editValue: e.detail.value })
  },

  // 性别选择变化
  handleGenderChange(e) {
    this.setData({ 
      editValue: this.data.genderMap[e.detail.value] ,
      genderIndex: e.detail.value
    })
  },

  // 保存修改
  saveChanges() {
    const { currentField, editValue, genderIndex } = this.data
    const updateKey = `userInfo.user.${currentField}`
    
    const newValue = currentField === 'userSex' ? genderIndex : editValue
    this.setData({
      showEditModal: false
    })
    if(currentField === 'userSex'){
      this.changeSex(newValue)
    }else if(currentField === 'userName'){
      this.changeName(newValue)
    }else{
      this.changeSignature(newValue)
    }
    wx.setStorageSync('user', this.data.userInfo)
  },
  changeSex(value){
    wx.request({
      url: 'http://localhost:8888/funny/user/changeUserSex', //自己的服务接口地址
        method: 'put',
        header:{
          //   wx.getStorageSync('token') 从缓存中取出token值
          "token":wx.getStorageSync('token'),
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data:{
          'userSex':value
        },
        success:(res) =>{
          if(res.data.flag){
            this.setData({
              'userInfo.user.userSex' : value
            })
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
changeName(userName){
    wx.request({
      url: 'http://localhost:8888/funny/user/changeUserName', //自己的服务接口地址
        method: 'PUT',
        header:{
          //   wx.getStorageSync('token') 从缓存中取出token值
          "token":wx.getStorageSync('token'),
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data: {
          'userName':userName,
        },
        success:(res) =>{
          if(res.data.flag){
            this.setData({
              'userInfo.user.userName' : userName
            })
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
  changeSignature(value){
    wx.request({
      url: 'http://localhost:8888/funny/user/changeUserSignature', //自己的服务接口地址
        method: 'put',
        header:{
          //   wx.getStorageSync('token') 从缓存中取出token值
          "token":wx.getStorageSync('token'),
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data:{
          'userSignature':value,
        },
        success:(res) =>{
          if(res.data.flag){
            this.setData({
              'userInfo.user.userSignature' : value
            })
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
  closeModal() {
    this.setData({ showEditModal: false })
  },

  // 跳转到聊天背景设置
  navigateToChatBg() {
    wx.navigateTo({
      url: '/pages/chat-bg/chat-bg'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'http://localhost:8888/funny/user/getUserInfo', //自己的服务接口地址
        method: 'get',
        header:{
          //   wx.getStorageSync('token') 从缓存中取出token值
          "token":token
        },
        success:(res) =>{
          if(res.data.flag){
            this.setData({
              'userInfo' : res.data.result
            })
          }else{
            wx.showToast({
              title: '出错了',
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