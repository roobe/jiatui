var app = getApp();

Page({
    data: {
        classMav: []
    },
    onLoad: function(a) {
        this.openid = wx.getStorageSync("openid"), this.getClass();
    },
    getClass: function() {
        var i = this;
        wx.showNavigationBarLoading(), app.util.request({
            url: "entry/wxapp/GetClass",
            cachetime: 0,
            success: function(a) {
                for (var t = a.data.data, s = [], e = 0; e < t.length; e++) 1 != t[e].id && s.push(t[e]);
                i.setData({
                    classMav: s
                });
            }
        });
    },
    channelRendered: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../classlist/classlist?id=" + t
        });
    }
});