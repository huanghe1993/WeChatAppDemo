Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  /**
   * 点击触发跳转页面
   */
  onTap:function(event){
    // navigateTo：是父子的关系，最多只能跳转五级
    // wx.navigateTo({
    //   url: '../posts/post',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })

    //redirectTo是平行的关系，其中的页面是不能进行返回的
    wx.switchTab({
      url: '../posts/post',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
 
})