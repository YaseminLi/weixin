Page({
  onTap:function(){
    // console.log('onTap')
    //跳转到其他页面，可以返回上一页面,此页面hide
    // wx:wx.navigateTo({
    //   url: '../posts/posts',
    // })
    //跳转到其他页面，但不能返回，此页面unload
    wx:wx.redirectTo({
      url: '../posts/posts',
    })
  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    // console.log('welcome hide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log('welcome unload')
  },
})