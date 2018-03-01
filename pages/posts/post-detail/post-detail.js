//把数据集种的数据加载进来,这里是不能用绝对路径的，只能使用相对路径的
var postsData = require('../../../data/posts-data.js')

//设置全局变量，是为了解决音乐退出去之后依然保存着原来的状态
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var globalData = app.globalData;
    //这里的id就是post.js里面的url传递过来的id值
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      //javaScript用对象表示之后放在这里，不是把子属性放在这里的
      postData: postData
    });
    // this.setData.postData = postData;

    //设置缓存,这里是同步的方法
    //wx.setStorageSync("key", "huanghe");
    //修改缓存，就是键的名字和设置的缓存的键的名字相同就是可以设置缓存的
    // wx.setStorageSync("key", {
    //   game:"zhangsam",
    //   developer:"暴雪"
    // });

    //用缓存模拟收藏信息和取消收藏功能
    //这一步得到的是一个缓存的集合
    var postsCollected = wx.getStorageSync("posts_collected");
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      //初始化图片的状态
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected);
    }

    //解决返回然后进入音乐图标不切换问题，改变
    //不仅仅是需要判断是否正在播放，还要判断当前播放的音乐是不是当前页设置的音乐
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }

    this.setMusicMonitor();

  },

  setMusicMonitor: function () {
    //监听音乐启动
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      //如果音乐播放了则改变全局的音乐播放变量
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    //监听音乐暂停
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      //如果音乐播放了则改变全局的音乐播放变量
      app.globalData.g_isPlayingMusic = false;
      //在播放暂停的时候需要把当前设置的id值清空
      app.globalData.g_currentMusicPostId = null;
    })

  },


  onColletionTap: function (event) {
    this.getPostsCollectedSync();
  },

  //异步的方法的使用方式
  getPostsCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function (res) {
        //获取缓存，查看是否被收藏了
        var postsCollected = res.data;
        //把postId传到这个函数里面来
        var postCollected = postsCollected[that.data.currentPostId];
        //取反
        postCollected = !postCollected;
        //更新缓存
        postsCollected[that.data.currentPostId] = postCollected;
        //执行交互的界面
        that.showToast(postsCollected, postCollected);
      }
    })
  },

  //同步的方法
  getPostsCollectedSync: function () {
    //获取缓存，查看是否被收藏了
    var postsCollected = wx.getStorageSync("posts_collected");
    //把postId传到这个函数里面来
    var postCollected = postsCollected[this.data.currentPostId];
    //取反
    postCollected = !postCollected;
    //更新缓存
    postsCollected[this.data.currentPostId] = postCollected;
    //执行交互的界面
    this.showToast(postsCollected, postCollected);

  },

  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : "取消收藏该文章",
      showCancel: "true",
      cancelText: "取消",
      confirmText: "确认",
      //显示成功之后再作图片的切换和缓存的设置
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("posts_collected", postsCollected);
          //更新数据绑定,这里的this指代的不是page是showModal的上下文环境
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function (postsCollected, postCollected) {
    //更新了缓存的状态
    wx.setStorageSync("posts_collected", postsCollected);
    //更新数据绑定的变量从而切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
    })
  },

  onShareTap: function () {
    wx.showActionSheet({
      itemList: [
        "分享给微信好友",
        "分享到朋友圈",
        "分享到QQ",
        "分享到微博"
      ],
      itemColor: "#405f80",
      success: function (res) {
        //res.cancel 用户是否点击了取消
        //res.tapIndex 用户点击的按钮，从上到下的顺序，从0开始
      }
    })
  },

  // 新增的分享的功能，注意，分享按钮是页面的行为，而不是应用程序的行为，每个页面都可以调用分享API并设置自己的分享参数。
  // 你不可以自定义分享按钮，只能使用小程序页面右上角的按钮进行分享。
  onShareAppMessage: function () {
    return {
      title: this.data.postData.title,
      desc: this.data.postData.content,
      path: '/pages/posts/post-detail/post-detail'
    }
  },

  //   onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res.target)
  //   }
  //   return {
  //     title: this.data.postData.title,
  //     path: '/pages/posts/post-detail/post-detail',
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },
  onMusicTap: function () {
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[currentPostId].music.url,
        title: postsData.postList[currentPostId].music.title,
        coverImgUrl: postsData.postList[currentPostId].music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },
})