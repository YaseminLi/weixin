import {
  Movie
} from 'class/Movie.js'
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function(options) {
    var movieId = options.id;
    var detailUrl = app.globalData.doubanbase + '/v2/movie/subject/' + movieId;
    var movie = new Movie(detailUrl);
    //getMovieData里有异步方法，所以必须有回掉函数
    // var that=this;
    // movie.getMovieData(function(movie) {
    //   that.setData({
    //     movie: movie
    //   });
    // });
    //箭头函数改写getMovieData中的this
    //箭头函数中的this就是方法调用环境的this
    movie.getMovieData((movie)=>{
      this.setData({movie:movie})
    });
  },


  viewMoviePostImg: function(event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  }
})