//index.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    src:"../../assets/imgs/takephoto.jpg",
    takephoto_txt:"点击图标开始拍照测试",
    hasBindAccount:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否扫描二维码进入
    var scene = decodeURIComponent(options.scene) || ""
    if(scene!=undefined && scene!="undefined" && scene.length){
      scene = String.fromCharCode(parseInt(scene, 16).toString(10))
      console.log(scene)
      this.takePhotoWithChar(scene)
    }
  },

  /**
   * 生命周期函数--监听被展示时调用
   */
  onShow: function(){
    var that = this
    var lezhi_account = wx.getStorageSync('lezhi_account') || ""
    if (lezhi_account) {
      this.setData({
        hasBindAccount: true
      });
    } else {
      this.setData({
        hasBindAccount: false
      });
      wx.showModal({
        title: '提示',
        content: '系统检测到您尚未关联乐智悦读网站账号，为了记录成绩，请点击下方“关联账号”进行操作',
        success: function (res) {
          if (res.confirm) {
            that.bindAccount()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 跳转到绑定账号界面
   */
  bindAccount: function () {
    wx.navigateTo({
      url: '../bindAccount/bindAccount'
    })
  },

  /**
   * 跳转到拍照界面
   */
  takePhoto: function(){
    wx.navigateTo({
      url: '../takePhoto/takePhoto'
    })
  },

  /**
   * 带参数跳转到拍照界面
   */
  takePhotoWithChar: function (char) {
    wx.navigateTo({
      url: '../takePhoto/takePhoto?char=' + char
    })
  },

  /**
   * 跳转到使用说明
   */
  about: function(){
    wx.navigateTo({
      url: '../about/about'
    }) 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
