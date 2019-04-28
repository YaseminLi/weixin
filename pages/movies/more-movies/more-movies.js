var app = getApp();
Page({
  data: {
   category:'',
   categoryMovie:{}
  },
  onLoad: function (options) {
    var category=options.category;
    this.setData({category:category});
    var categoryUrl;
    if(category=='正在热映'){
      categoryUrl = app.globalData.doubanbase + '/v2/movie/in_theaters' + '?start=0&count=9';
      this.getMovieListData(categoryUrl, 'inTheaters');
    } else if (category == '即将上映')
    { categoryUrl = app.globalData.doubanbase + '/v2/movie/coming_soon' + '?start=0&count=9';
      this.getMovieListData(categoryUrl, 'comingSoon');
      }
    else{
      categoryUrl = app.globalData.doubanbase + '/v2/movie/top250' + '?start=0&count=9';
      this.getMovieListData(categoryUrl, 'top250',);
    }
  },
  getMovieListData: function (url, selectkey) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        that.processDoubanData(res.data, selectkey)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processDoubanData: function (moviesDouban, selectkey) {
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
  onReady:function(){
    wx.setNavigationBarTitle({
      title:this.data.category,
    })
  }
})