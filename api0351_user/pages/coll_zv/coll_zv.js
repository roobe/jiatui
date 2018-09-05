var app = getApp();

Page({
    data: {
        getCdrList: []
    },
    onLoad: function(t) {
        this.openid = wx.getStorageSync("openid"), this.uid = t.uid, this.openid ? this.getCdrList(this.uid) : wx.redirectTo({
            url: "../index/index"
        });
    },
    callPhoto: function(t) {
        wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.mobile
        });
    },
    getCdrList: function(t) {
        var e = this, i = this.openid;
        app.util.request({
            url: "entry/wxapp/GetViewCdr",
            data: {
                openid: i,
                uid: t
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data), e.setData({
                    getCdrList: t.data.data
                });
            }
        });
    }
});