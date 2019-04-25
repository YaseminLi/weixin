App({
globalData:{
  // g_isPlayingMusic:false,
  g_currentMusicPostId:null
},
onLaunch:function(){
    wx.setStorageSync('isPlayingMusic', false)
  }
})
