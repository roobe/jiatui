var app = getApp();

Page({
    data: {
        listData: [],
        listDisplay: !0
    },
    onLoad: function(a) {
        console.log(a), this.searchList(a.keywords, a.searchid);
    },
    goTo: function() {
        wx.navigateBack({
            url: "../business/business"
        });
    },
    searchList: function(a, t) {
        var s = this;
        app.util.request({
            url: "entry/wxapp/Kewords",
            data: {
                keyword: a,
                searchid: t
            },
            cachetime: 0,
            success: function(a) {
                console.log(a.data.data), 0 == a.data.data.length ? s.setData({
                    listDisplay: !0
                }) : s.setData({
                    listData: a.data.data,
                    listDisplay: !1
                });
            }
        });
    }
});