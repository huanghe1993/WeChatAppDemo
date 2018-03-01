//把数据集种的数据加载进来,这里是不能用绝对路径的，只能使用相对路径的
var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: "Sep 18 2016",
    title: "正是虾肥蟹壮时"
    // post_key:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      posts_key: postsData.postList
    });

    //计数的功能
    var readCount = wx.getStorageSync("read_Count");
    if (readCount){
      // this.data.readCount = readCount;
      this.setData({
        readCount: readCount
      })
    }else{
      this.setData({
        readCount: 0
      })
    }
    
  },

  onPostTap: function (event) {
    //获取到绑定到标签的数据
    //事件源组件上由data-开头的自定义属性组成的集合
    //自动的开启驼峰式的命名规则
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      // 把当前页面的id传到详情的页面
      url: 'post-detail/post-detail?id=' + postId,
    })

    //实现计数功能，利用缓存实现，只要有链接点击进入一次就是表示的是一次的阅读
    wx.setStorageSync("read_Count", this.data.readCount++);
  },

  onSwiperItemTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      // 把当前页面的id传到详情的页面
      url: 'post-detail/post-detail?id=' + postId,
    })
    //实现计数功能，利用缓存实现，只要有链接点击进入一次就是表示的是一次的阅读
    wx.setStorageSync("readCount", this.data.readCount++);
  }

})