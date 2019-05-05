var app = getApp();
Page({
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{},
    searchResult:{},
    isSearchMovie: false
  },
  onLoad: function(options) {
    var inTheatersUrl = app.globalData.doubanbase + '/v2/movie/in_theaters' + '?start=0&count=3';
    var comingSoonUrl = app.globalData.doubanbase + '/v2/movie/coming_soon' + '?start=0&count=3';
    var top250Url = app.globalData.doubanbase + '/v2/movie/top250' + '?start=0&count=3';
    //是异步调用的
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', 'Top250');
  },
  onCancleImgTap: function(event) {
    this.setData({
      isSearchMovie: false,
      searchResult:{}
    });
  },
  onBindFocus: function(event) {
    this.setData({
      isSearchMovie: true
    });
  },
  onBindBlur: function(event) {
    // this.setData({
    //   isSearchMovie: false
    // });
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanbase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, 'searchResult', '搜索');
  },
  getMovieListData: function(url, selectkey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "application/json"
      },
      success: function(res) {
        that.processDoubanData(res.data, selectkey, categoryTitle)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },
  processDoubanData: function(moviesDouban, selectkey, categoryTitle) {
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
    var readyMovie = {};
    readyMovie[selectkey] = {
      movies: movies,
      categoryTitle: categoryTitle
    };
    this.setData(readyMovie);
  },
  onMoreMovie: function(event) {
    wx.navigateTo({
      url: 'more-movies/more-movies?category=' + event.currentTarget.dataset.category,
    })
  }

})