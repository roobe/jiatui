var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        console.log(t.op), this.setData({
            openid: t.op
        });
    },
    imgBind: function(t) {
        var a = t.currentTarget.dataset.id, e = this.data.openid;
        app.util.request({
            url: "entry/wxapp/BackGro",
            data: {
                openid: e,
                backgro: a
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data), wx.showToast({
                    title: "设置成功",
                    icon: "success",
                    duration: 1200
                }), setTimeout(function() {
                    wx.reLaunch({
                        url: "../index/index"
                    });
                }, 1200);
            }
        });
    }
});