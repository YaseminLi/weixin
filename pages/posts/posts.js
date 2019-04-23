// pages/posts/posts.js
var postsData=require('../../data/posts-data.js')
// console.log(postsData)
Page({
  onPostTap:function(event){
    var postId=event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-details/post-details'
    })
  },
  onLoad: function(options) {
    this.setData({posts_key:postsData.postList});
  },
})