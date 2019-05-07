var util = require('../../../../utils/util.js');
class Movie {
  constructor(url) {
    this.url = url;
  }
  getMovieData(cb) {
    this.cb = cb;
    util.http(this.url, this.processDoubanData.bind(this))
  }
  processDoubanData(data) {
    var movie = {};
    movie = {
      title: data.title,
      countries: data.countries[0],
      year: data.year,
      wishCount: data.wish_count,
      commentsCount: data.comments_count,
      movieImg: data.images ? data.images.large : '',
      originalTitle: data.original_title,
      stars: util.convertToStars(data.rating.stars),
      score: data.rating.average,
      director: data.directors ? data.directors[0].name : '',
      casts: util.convertToCastString(data.casts),
      genres: data.genres.join('、'),
      summary: data.summary,
      castsInfo: util.convertToCastInfos(data.casts),
    };
    //不能return啊
    // return movie;
    this.cb(movie);
  }
};
export {
  Movie
};