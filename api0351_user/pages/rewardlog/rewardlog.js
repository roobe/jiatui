var app = getApp();

Page({
    data: {
        infoList: [],
        noData: 0
    },
    onLoad: function(a) {
        this.getDataIndex(a.op);
    },
    getDataIndex: function(a) {
        var t = this;
        app.util.request({
            url: "entry/wxapp/GetShang",
            data: {
                openid: a
            },
            cachetime: 0,
            success: function(a) {
                0 == a.data.data.length ? t.setData({
                    noData: 0
                }) : t.setData({
                    noData: 1,
                    infoList: a.data.data
                });
            }
        });
    }
});