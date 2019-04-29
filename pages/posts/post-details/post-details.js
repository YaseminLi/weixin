var postsData = require('../../../data/posts-data.js');
var app = getApp();//获取app.js上定义的全局变量
Page({
  data: {
    isPlayingMusic: false,
  },
  onLoad: function(option) {
    var postId = option.id;
    this.setData({
      currentPostId: postId
    });
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData,
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
    //全局变量记录音乐播放状态
    // if (app.globalData.g_isPlayingMusic && (app.globalData.g_currentMusicPostId===postId)) {
    //   this.setData({
    //     isPlayingMusic: true,
    //   });
    // }
    //利用缓存记录音乐播放状态
    if (wx.getStorageSync('isPlayingMusic') && (app.globalData.g_currentMusicPostId == postId)) {
      this.setData({
        isPlayingMusic: true,
      });
    }
    this.setMusicMonitor();
    //阅读数变化
    var postsReading = wx.getStorageSync('postsReading');
    if (postsReading ){
      if(postsReading[postId]){
        postsReading[postId]++;
      }else{
        postsReading[postId] = this.data.postData.reading+1;
      }
    }else{
      postsReading={};
      postsReading[postId] = Number(this.data.postData.reading) + 1;
    }
    wx.setStorageSync('postsReading', postsReading)
  },
  //监听音乐的播放与暂停
  setMusicMonitor: function() {
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    var that = this;
    backgroundAudioManager.onPlay(
      function() {
        if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
          // 播放当前页面音乐才改变图标
          that.setData({
            isPlayingMusic: true
          })
        }
        wx.setStorageSync('isPlayingMusic', true);
      }
    )
    backgroundAudioManager.onPause(
      function() {
        that.setData({
          isPlayingMusic: false
        });
        // app.globalData.g_isPlayingMusic = false;
        wx.setStorageSync('isPlayingMusic', false);
      }
    )
    backgroundAudioManager.onEnded(
      function () {
        that.setData({
          isPlayingMusic: false
        });
        // app.globalData.g_isPlayingMusic = false;
        wx.setStorageSync('isPlayingMusic', false);
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
    postsCollected[this.data.currentPostId] = !postsCollected[this.data.currentPostId];
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
        postsCollected[that.data.currentPostId] = !postsCollected[that.data.currentPostId];
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
      collected: postsCollected[this.data.currentPostId]
    });
    wx.showToast({
      title: postsCollected[this.data.currentPostId] ? "收藏成功" : "取消成功",
      duration: 1500,
      icon: 'success'
    });
  },
  // showModal: function(postsCollected) {
  //   var that = this;
  //   wx.showModal({
  //     title: '收藏',
  //     content: postsCollected[this.data.currentPostId] ? '收藏此文章？' : "取消收藏此文章？",
  //     showCancel: true,
  //     cancelText: '取消',
  //     confirmText: '确认',
  //     success: function(res) {
  //       if (res.confirm) { //更新收藏状态的缓存数组
  //         wx.setStorageSync('postsCollected', postsCollected);
  //         //更新页面状态
  //         that.setData({
  //           collected: postsCollected[that.data.currentPostId]
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
    var isPlayingMusic = this.data.isPlayingMusic;
    var postData = this.data.postData;
    var currentPostId = this.data.currentPostId;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    if (isPlayingMusic) {
      backgroundAudioManager.pause();
      this.setData({
        isPlayingMusic: false
      });
      wx.setStorageSync('isPlayingMusic', false)
    } else {
      backgroundAudioManager.title = postData.music.title;
      backgroundAudioManager.coverImgUrl = postData.music.coverImg;
      backgroundAudioManager.src = postData.music.url;
      this.setData({
        isPlayingMusic: true
      });
      wx.setStorageSync('isPlayingMusic', false);
      app.globalData.g_currentMusicPostId = this.data.currentPostId;
      console.log(app.globalData.g_currentMusicPostId)
    }
  }

})