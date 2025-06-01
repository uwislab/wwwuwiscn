// pages/chat-bg/chat-bg.js
const token = wx.getStorageSync('token')
Page({
  data: {
    user:{},
    // defaultBg: '/images/default-bg.jpg',
    currentBg: '',
    presetBackgrounds: [],
    customBackgrounds: [],
    showDeleteIcons: {}
  },
  onLoad(options) {
    this.setData({
      user:wx.getStorageSync('user'),
      currentBg:wx.getStorageSync('user').backUrl
    })
    this.getBackPicture()
    console.log("picture:",this.data.user.backUrl)
  },
  getBackPicture() {
    wx.request({
      url: 'http://localhost:8888/funny/user/selectBackPicture', //自己的服务接口地址
        method: 'get',
        header:{
          //   wx.getStorageSync('token') 从缓存中取出token值
          "token":token,
          "Content-Type":"application/x-www-form-urlencoded"
        },
        success:(res) =>{
          console.log("success")
          if(res.data.flag){
            this.setData({
              presetBackgrounds:res.data.result
            })
            console.log(this.data.presetBackgrounds)
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
  // 显示删除确认弹窗
  showDeleteConfirm(e) {
    const item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '删除确认',
      content: '确定要删除该背景吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteBackground(item);
        }
      }
    });
  },
  // 删除背景逻辑
  deleteBackground(item) {
    wx.request({
      url: 'http://localhost:8888/funny/user/deleteUserBack', //自己的服务接口地址
        method: 'delete',
        header:{
          //   wx.getStorageSync('token') 从缓存中取出token值
          "token":token,
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data:{
          'userBack':item.pictureId
        },
        success:(res) =>{
          if(res.data.flag){
            this.getBackPicture()
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
  // 选择背景
  selectBackground(e) {
    const url = e.currentTarget.dataset.url
    const urlId = e.currentTarget.dataset.id
    this.setData({ currentBg: url })
    this.saveBackground(urlId,url)
  },

  // 保存背景设置
  saveBackground(urlId,url) {
    console.log("start")
    wx.request({
      url: 'http://localhost:8888/funny/user/changeUserBack', //自己的服务接口地址
        method: 'put',
        header:{
          //   wx.getStorageSync('token') 从缓存中取出token值
          "token":token,
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data:{
          'userBack':urlId
        },
        success:(res) =>{
          console.log("res",res.data)
          if(res.data.flag){
            console.log("yes")
            this.setData({
              'user.backUrl':url,
              'user.userInfo.userImage':urlId
            })
            wx.setStorageSync('user', this.data.user)
            wx.showToast({
              title: '背景设置成功',
              icon: 'success'
            })
            console.log(this.data.presetBackgrounds)
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
    console.log("end")
  },

  // 上传新背景
  uploadNewBg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: res => {
        const tempFilePath = res.tempFilePaths[0]
        this.uploadImage(tempFilePath)
      }
    })
  },

  // 上传图片（示例用本地缓存，实际需上传服务器）
  uploadImage(tempFilePath) {
    wx.showLoading({ title: '上传中...' })
    
    wx.uploadFile({
      url: 'http://localhost:8888/funny/user/addUserBack', //自己的服务接口地址
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
            this.getBackPicture()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration:200
            });
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