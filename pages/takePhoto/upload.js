// pages/takePhoto/takePhoto.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:0,
    height:0,
    photoWidth:0,
    photoHeight:0,
    ocr:'',
    char:'',
    showInput: false,
    showExam: false,
    tempFilePath: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.path = options.path
    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowWidth
        var height = res.windowHeight
        var gap = (res.windowWidth - 304) / 2
        that.setData({
          width:width,
          height:height,
          gap: gap
        })
        wx.getImageInfo({
          src: that.path,
          success: function(res){
            that.setData({
              photoWidth: res.width,
              photoHeight: res.height
            })
            wx.showToast({
              title: that.data.photoWidth + '-' + that.data.photoHeight,
            })
            that.canvas = wx.createCanvasContext("image-canvas", that)
            that.canvas.drawImage(that.path, 0, 0, that.data.photoWidth, that.data.photoHeight)
            wx.showLoading({
              title: '数据处理中',
              mask: true
            })
            that.realLeftGap = (that.data.photoWidth - that.data.width) / 2 - (800 - that.data.photoWidth)
            that.canvas.setStrokeStyle('red')
            // 这里有一些很神奇的操作,总结就是MD拍出来的照片规格居然不是统一的
            that.canvas.strokeRect(that.realLeftGap, that.data.gap, that.data.photoWidth - 2 * that.realLeftGap, that.data.photoWidth - 2 * that.realLeftGap)
            that.canvas.draw()
            setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: "image-canvas",
                x: that.realLeftGap+1,
                y: that.data.gap+1,
                width: that.data.photoWidth - 2 * that.realLeftGap-2,
                height: that.data.photoWidth - 2 * that.realLeftGap-2,
                destWidth: 400,
                destHeight: 400,
                canvasId: 'image-canvas',
                success: function (res) {
                  that.filePath = res.tempFilePath
                  that.canvas.clearRect(0, 0, that.data.photoWidth, that.data.photoHeight)
                  that.setData({
                    photoWidth: that.data.width,
                    photoHeight: that.data.width,
                    tempFilePath: res.tempFilePath
                  })
                  that.canvas.drawImage(that.filePath, that.data.gap,that.data.gap, 300, 300)
                  that.canvas.draw()
                  wx.showLoading({
                    title: '图片上传中',
                    mask: true
                  })
                  // 文件上传,自动识别写的文字,不一定识别的出来
                  wx.uploadFile({
                    url: 'https://minipro.lezhireading.com/upload.php',
                    filePath: that.filePath,
                    name: 'file',
                    formData: {
                      'mobile': wx.getStorageSync('lezhi_account').phoneNumber || "13800000000",
                      'password': wx.getStorageSync('lezhi_account').password || '123456',
                      'keyCode': '5eedac92557171f1684da2eb9fe58ca2502998c1',
                      'char': options.char
                    },
                    success: function (res) {
                      wx.hideLoading()
                      var data = JSON.parse(res.data)
                      var status = data.status
                      var file = data.file
                      var ocr = data.ocr
                      if(status=='OK'){
                        if (ocr.words_result_num>0){
                          var temp = ""
                          for (var i = 0; i < ocr.words_result_num; i++) {
                            temp += ocr.words_result[i]['words'];
                          }
                          that.setData({
                            ocr: temp[0],
                            showInput: true,
                            showExam: true,
                            char: temp[0]
                          });
                        } else {
                          that.setData({
                            ocr:'无法识别到汉字，手动输入吧',
                            showInput: true,
                            showExam: true
                          })
                        }
                      } else {
                        wx.showToast({
                          title: '服务器出错',
                          icon: 'loading'
                        })
                      }
                    },
                    fail:function(e){
                      console.log(e);
                      wx.hideLoading()
                      wx.showToast({
                        title: '出错啦...',
                        icon: 'loading'
                      })    
                    }
                  })
                },
                fail:function(e){
                  wx.hideLoading()
                  wx.showToast({
                    title: '出错啦...',
                    icon: 'loading'
                  })
                }
              });
            }, 1000);
          }
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 打分
   */
  exam: function(){
    var that = this
    if (that.data.char){
      wx.navigateTo({
        url: '../exam/exam?char=' + that.data.char[0] + '&path=' + that.data.tempFilePath
      })
    } else {
      wx.showToast({
        title: '识别不了写的字，手动输入一下吧',
        icon: 'none',
        duration: 800
      })
    }
  },

  /**
   * 用户手动输入图片中汉字
   */
  userInput: function(e){
    this.setData({
      char: e.detail.value
    })
  }
})