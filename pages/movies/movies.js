//获取全局变量，
var app = getApp();

//引用js文件
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //期望的数据结构的形式
    // inTheater：{}
    // comingSoon：{}
    // top250：{}
    searchResult: {},
    containerShow: true,
    searchShow: false,



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取三种数据的地址
    var inTheaterUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&&count=3";
    // 替换成猫眼的API之后的URL
    // var inTheaterUrl = app.globalData.doubanBase +"movie/list.json?type=hot&offset=0&limit=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&&count=3";

    this.getMovieListData(inTheaterUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "Top250");

  },

  // 退出搜索页面
  onCancelImgTap: function () {
    this.setData({
      containerShow: true,
      searchShow: false,
      searchResult: {},
    })
  },

  //获取焦点时需要做的事情
  onBindFocus: function (event) {
    // console.log("show");
    // 当执行搜索的时候电影页面需要赢藏起来，搜索页面需要显示出来
    this.setData({
      containerShow: false,
      searchShow: true
    })
  },


  //失去焦点的时候，执行搜索的功能
  onBindConfirm: function (event) {
    //获取到输入的文本
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },

 

  //获取电影数据函数
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      // Content-Type属性指定请求和响应的HTTP内容类型
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        console.log(error);
      },
      complete: function () {
      }
    })
  },

  //处理数据函数
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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

      var readyData = {};
      readyData[settedKey] = {
        // 让每一个里面有一个movies的属性值
        movies: movies,
        categoryTitle: categoryTitle
      }

      //this.setData()里面需要的是传入一个js对象进去
      this.setData(readyData);

    }
  },


  //更多的函数，不能卸载movie-list文件夹下面，不能成为模块化的编程，小程序仅仅只是模板化的编程
  onMoreTap: function (event) {
    //获取到绑定在movie-list-template里面的变量
    var catagory = event.currentTarget.dataset.catagory;
    wx.navigateTo({
      //把唯一的标识加载到跳转的页面中去
      url: 'more-movie/more-movie?catagory=' + catagory,
    })

  },

  // 跳转到电影详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      //把唯一的标识加载到跳转的页面中去
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },



})