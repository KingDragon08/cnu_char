// pages/bindAccount/bindAccount.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:"",
    password:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 手机号码的输入事件 
   */
  phoneNumberInput: function(e){
    this.setData({
      phoneNumber: e.detail.value
    });
  },

  /**
   * 密码的输入事件
   */
  passwordInput: function(e){
    this.setData({
      password: e.detail.value
    });
  },

  /**
   * 绑定乐智悦读网站账号 
   */
  go: function (){
    var that = this
    if(that.data.phoneNumber && that.data.phoneNumber.length==11 && that.data.password && that.data.password.length>=6){
      wx.showToast({
        title: '账号绑定中',
        icon: 'loading',
        duration: 2000
      })
      //对接数据绑定接口
      wx.showToast({
        title: '账号绑定成功',
        icon: 'success',
        duration: 2000,
        success: function(){
          var lezhi_account = {
            phoneNumber: that.data.phoneNumber,
            password: that.data.password
          }
          wx.setStorageSync('lezhi_account', lezhi_account)
          setTimeout(function(){
            wx.navigateBack()
          },2000)
        }
      })
    } else {
      wx.showToast({
        title: '账号或密码错误',
        icon: 'none',
        duration: 2000
      })
    }
  }
})