App({
globalData:{
  // g_isPlayingMusic:false,
  g_currentMusicPostId:null,
  doubanbase:'http://t.yushu.im'
},
onLaunch:function(){
    wx.setStorageSync('isPlayingMusic', false)
  }
})
