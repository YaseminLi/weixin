// components/like/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLike:{
      type:Boolean,
      value:false
    },
    count: {
      type: Number,
      value: 999
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    yesSrc: 'images/like.png',
    noSrc: 'images/like@dis.png'
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLike: function(event) {
      let count = this.properties.count;
      let isLike = this.properties.isLike;
      count=isLike?count-1:count+1;
      this.setData({
        count: count,
        isLike:!isLike
      })
    }
    // http://bl.7yue.pro/v1/classic/latest?appkey=98HcsgdJ3mx4Ufcm
  }
})