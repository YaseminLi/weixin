// pages/posts/posts.js
var postsData = require('../../data/posts-data.js')
// console.log(postsData)
Page({
  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-details/post-details?id=' + postId
    })
  },
  onLoad: function(options) {
    //onShow的代码本来在这里面，但是从详情页返回时，页面不再加载
  },
  onShow: function() {
    var postsReading = wx.getStorageSync('postsReading')
    if (postsReading) {
      for (var i = 0; i < postsData.postList.length; i++) {
        if (postsReading[i]) {
          postsData.postList[i].reading = postsReading[i];
        } else {
          postsReading[i] = postsData.postList[i].reading
        }
      }
    }
    this.setData({
      posts_key: postsData.postList,
      postsReading: postsReading
    });
  },
  onSwiperTap: function(event) {
    //target和currentTarget
    //target指当前点击的组件image，currentTarget指的是事件捕获的组件swiper
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-details/post-details?id=' + postId
    })
  }
})