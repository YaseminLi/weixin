var util=require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
   category:'',
   categoryMovie:{}
  },
  onLoad: function (options) {
    var category=options.category;
    this.setData({category:category});
    var categoryUrl='';
    switch (category){
      case '正在热映':
        categoryUrl = app.globalData.doubanbase + '/v2/movie/in_theaters';
      break;
      case '即将上映':
        categoryUrl = app.globalData.doubanbase + '/v2/movie/coming_soon';
      break;
      case 'Top250':
        categoryUrl = app.globalData.doubanbase + '/v2/movie/top250';
      break;
    }
    util.http(categoryUrl,this.processDoubanData)
    // 还用if else……
    // if(category=='正在热映'){
    //   categoryUrl = app.globalData.doubanbase + '/v2/movie/in_theaters' + '?start=0&count=9';
    //   this.getMovieListData(categoryUrl, 'inTheaters');
    // } else if (category == '即将上映')
    // { categoryUrl = app.globalData.doubanbase + '/v2/movie/coming_soon' + '?start=0&count=9';
    //   this.getMovieListData(categoryUrl, 'comingSoon');
    //   }
    // else{
    //   categoryUrl = app.globalData.doubanbase + '/v2/movie/top250' + '?start=0&count=9';
    //   this.getMovieListData(categoryUrl, 'top250',);
    // }
  },
  //与movies.js的方法一样，提取到util.js
  // getMovieListData: function (url, selectkey) {
  //   var that = this;
  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     header: {
  //       "content-type": "application/json"
  //     },
  //     success: function (res) {
  //       that.processDoubanData(res.data, selectkey)
  //     },
  //     fail: function (error) {
  //       console.log(error)
  //     }
  //   })
  // },
  //要实现上拉下拉加载更多，不用提取
  processDoubanData: function (moviesDouban) {
    var movies = [];
    var subjects = moviesDouban.subjects;
    for (var idx in subjects) {
      var title = subjects[idx].title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...';
      }
      var starsNum = subjects[idx].rating.stars.toString().substring(0, 1);
      var stars = [];
      for (var i = 0; i < 5; i++) {
        stars[i] = (i < starsNum ? 1 : 0);
      };
      var temp = {
        coverageUrl: subjects[idx].images.large,
        title: title,
        movieId: subjects[idx].id,
        rating: {
          average: subjects[idx].rating.average,
          stars: stars
        }
      }
      movies.push(temp);
    } 
    this.setData({categoryMovie:movies});
  },
  //涉及到UI的渲染要放在onReady里
  onReady:function(){
    wx.setNavigationBarTitle({
      title:this.data.category,
    })
  }
})