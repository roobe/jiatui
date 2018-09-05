var app = getApp(), WxParse = require("../../resource/wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(e) {
        console.log(e.id), this.getViewNew(e.id);
    },
    getViewNew: function(e) {
        var t = this;
        app.util.request({
            url: "entry/wxapp/GetViewNew",
            data: {
                id: e,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(e) {
                console.log(e.data.data);
                var a = e.data.data.content;
                WxParse.wxParse("article", "html", a, t, 5), t.setData({
                    NewsView: e.data.data
                });
            }
        });
    },
    goHome: function() {
        wx.navigateTo({
            url: "../index/index"
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.NewsView.title,
            path: "/api0351_user/pages/newsView/newsView?id=" + this.data.NewsView.nid
        };
    }
});