var app = getApp();
Page({
  data:{
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },
  onLoad: function(options) {
    var inTheatersUrl = app.globalData.doubanbase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoonUrl = app.globalData.doubanbase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250Url = app.globalData.doubanbase + '/v2/movie/top250' + '?start=0&count=3';
    //是异步调用的
    this.getMovieListData(inTheatersUrl,'inTheaters');
    this.getMovieListData(comingSoonUrl,'comingSoon');
    this.getMovieListData(top250Url,'top250');
  },

  getMovieListData: function(url,selectkey) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        that.processDoubanData(res.data,selectkey)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  processDoubanData: function(moviesDouban,selectkey) {
    var movies = [];
    var subjects = moviesDouban.subjects;
    for (var idx in subjects) {
      var title = subjects[idx].title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...';
      }
      var temp = {
        coverageUrl: subjects[idx].images.large,
        title: title,
        movieId: subjects[idx].id,
        average: subjects[idx].rating.average
      }
      movies.push(temp);
    }
    var readyMovie={};
    readyMovie[selectkey]={
      movies:movies
    };
    this.setData(readyMovie);
  }

})