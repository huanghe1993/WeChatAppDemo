//获取全局变量，
var app = getApp();
//引用js文件
var util = require('../../../utils/util.js')

// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //设置中间的变量，在两个函数之间共享
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    // 用来指代当前movies的数据是不是空的
    isEmpty: true,


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var catagory = options.catagory;
    this.data.navigateTitle = catagory;
    console.log(catagory);
    var dataUrl = "";
    switch (catagory) {
      case "正在热映":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "Top250":
        var dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);

  },


  //上拉加载更多函数，movie-grid里面的东西
  onScrollLower: function (event) {
    // console.log("加载跟多");
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    //发起请求的时候出现正在加载
    wx.showNavigationBarLoading();

  },

  //上拉刷新的函数
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  //处理数据函数
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    //因为拿到的数据都会到这里来做一次处理，所以在这里累加是最合适的
    var totalMovies = {};

    if (!this.data.isEmpty) {
      //如果当前的数据集中的数据不是空的情况下，有上一次绑定的数据
      // 新加载的20条数据和以前的数据需要合并在一起,得到一个新的movies
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      //如果是第一的加入就直接的加入进去
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20;
    //数据设置完成的时候结束
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  //动态的设定导航栏的标题
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },


})