// pages/posts/post-details/post-details.js
var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
  data: {
    isPlaying: false,
  },
  onLoad: function(option) {
    var postId = option.id;
    console.log(app);
    console.log(postId);
    this.setData({
      currentId: postId
    });
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });
    var postsCollected = wx.getStorageSync('postsCollected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      if (postCollected) {
        this.setData({
          collected: postCollected
        })
      } else {
        postsCollected[postId] = false;
        postCollected = postsCollected[postId];
        wx.setStorageSync('postsCollected', postsCollected)
        this.setData({
          collected: postCollected
        })
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('postsCollected', postsCollected)
    };
    if (app.globalData.g_isPlayingMusic && (app.globalData.g_currentMusicPostId===postId)) {
      this.setData({
        isPlaying: true,
      });
    }
    this.setMusicMonitor();
  },
  //监听音乐的播放与暂停
  setMusicMonitor: function() {
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    var that = this;
    backgroundAudioManager.onPlay(
      function() {
        that.setData({
          isPlaying: true
        });
        app.globalData.g_isPlayingMusic = true;
        app.globalData.g_currentMusicPostId= that.data.postData.postId;

      }
    )
    backgroundAudioManager.onPause(
      function() {
        that.setData({
          isPlaying: false
        });
        app.globalData.g_isPlayingMusic = false;
        app.globalData.g_currentMusicPostId = "";
      }
    )
  },
  onCollection: function(event) {
    // this.getPostsCollected();
    this.getPostsCollectedSync();
  },
  //同步调用方法,会阻塞get后的UI
  getPostsCollectedSync: function() {
    var postsCollected = wx.getStorageSync('postsCollected');
    //收藏的变成未收藏，未收藏变成收藏的
    postsCollected[this.data.currentId] = !postsCollected[this.data.currentId];
    this.showToast(postsCollected);
    // this.showModal(postsCollected);
  },
  //异步调用方法，方法先走完
  getPostsCollected: function() {
    var that = this;
    wx.getStorage({
      key: 'postsCollected',
      success: function(res) {
        var postsCollected = res.data;
        //收藏的变成未收藏，未收藏变成收藏的
        postsCollected[that.data.currentId] = !postsCollected[that.data.currentId];
        that.showToast(postsCollected);
        // this.showModal(postsCollected);
      },
    })
  },
  showToast: function(postsCollected) {
    //更新收藏状态的缓存数组
    wx.setStorageSync('postsCollected', postsCollected);
    //更新页面状态
    this.setData({
      collected: postsCollected[this.data.currentId]
    });
    wx.showToast({
      title: postsCollected[this.data.currentId] ? "收藏成功" : "取消成功",
      duration: 1500,
      icon: 'success'
    });
  },
  // showModal: function(postsCollected) {
  //   var that = this;
  //   wx.showModal({
  //     title: '收藏',
  //     content: postsCollected[this.data.currentId] ? '收藏此文章？' : "取消收藏此文章？",
  //     showCancel: true,
  //     cancelText: '取消',
  //     confirmText: '确认',
  //     success: function(res) {
  //       if (res.confirm) { //更新收藏状态的缓存数组
  //         wx.setStorageSync('postsCollected', postsCollected);
  //         //更新页面状态
  //         that.setData({
  //           collected: postsCollected[that.data.currentId]
  //         });
  //       }
  //     }
  //   })
  // },
  onShare: function(event) {
    var itemList = ['分享给微信好友', '分享到朋友圈', '分享到qq']
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#333',
      success(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: "小程序现在还没有实现分享功能😯",
        })
      }
    })
  },
  onMusic: function(event) {
    var isPlaying = this.data.isPlaying;
    isPlaying = !isPlaying;
    this.setData({
      isPlaying: isPlaying
    });
    var postData = this.data.postData;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.title = postData.music.title;
    backgroundAudioManager.coverImgUrl = postData.music.coverImg;
    if (isPlaying) {
      backgroundAudioManager.src = postData.music.url;
    } else {
      backgroundAudioManager.pause();
      // app.globalData.g_coverMusicImgUrl ='';
    };

    // if(played){
    //   wx.playBackgroundAudio({
    //     dataUrl: postData.music.url,
    //     title: postData.music.title,
    //     coverImgUrl: postData.music.coverImg
    //   })
  }

})