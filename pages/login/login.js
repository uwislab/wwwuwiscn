Page({
  data: {
    isLoading:false,
    showModal:false
  },
  forRequest(){
    wx.showModal({
      content: '是否同意小程序获取用户信息？',
      success: (res) =>{
        if (res.confirm) {
          this.handleLogin()
        } else if (res.cancel) {
         wx.showToast({
           title: '已取消授权',
         })
        }
      }
    })
  },
  handleLogin() {
    if (this.data.isLoading) return;
    this.setData({ isLoading: true });
    let that = this;
    // 获取个人信息
    wx.getUserProfile({
      desc: '用于获取用户个人信息',
      success:  (detail)=> {
        console.log(detail);
        wx.login({
          success: (res) =>{
            var code = res.code; //登录凭证
            console.log("code:"+code)
            wx.request({
              url: 'http://localhost:8888/funny/user/login', //自己的服务接口地址
              method: 'post',
              // header: {
              //   'content-type': 'application/json'
              // },
              // 需要传给后端的数据
              data: {
              code: code,
              rawData: detail.rawData,
              signature: detail.signature,
              encryptedData: detail.encryptedData,
              iv: detail.iv
              },
              success: (res) => {
                console.log("msg:",res.data.msg)
                if(res.data.msg==='用户已被冻结'){
                  wx.setStorageSync("token", res.data.result.token)
                  this.setData({
                    showModal:true,
                    isLoading:false
                  })
                  return ;
                }
                if(res.data.msg==='解封申请待处理'){
                  wx.showToast({ title: '解封申请待处理' });
                  this.setData({
                    isLoading:false
                  })
                  return ;
                }
                console.log("111111")
                console.log("res:", res.data)
                console.log("token:"+res.data.result.token)
                // 将用户授权信息存储到本地
                wx.setStorageSync("user", res.data.result)
                // 将后端返回的token存储到本地
                wx.setStorageSync("token", res.data.result.token)
                wx.showToast({ title: '登录成功' });
                wx.switchTab({ url: '/pages/conversations/conversations' });
              },
              fail: (err) => {
                console.log('系统错误')
                this.setData({
                  isLoading:false
                })
              }
            })
          }
        });
      },
      fail: () => {
       wx.showModal({
         content: '取消授权将会影响相关服务，您确定取消授权吗？',
         success: (res) =>{
           if (res.confirm) {
             wx.showToast({
               title: '已取消授权',
               duration: 1500
             })
             this.setData({
               isLoading:false
             })
           } else if (res.cancel) {
             that.handleLogin()
           }
         }

       })
      }
    })
  },
  applyUnfrozen(){
    console.log("token:",wx.getStorageSync('token'))
    wx.request({
      url: 'http://localhost:8888/funny/user/applyUnfrozen', //自己的服务接口地址
      method: 'put',
      header: {
        "token": wx.getStorageSync('token')
      },
      success: (res) => {
        if(res.data.flag){
          this.setData({
            showModal:false
          })
          wx.showToast({ title: '申请成功' });
        }else{
          this.setData({
            showModal:false
          })
          wx.showToast({ title: '申请出错了' });
        }
      },
      fail: (err) => {
        console.log('系统错误')
        this.setData({
          showModal:false
        })
      }
    })
  },

  onLoad(options) {

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
});
