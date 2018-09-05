var app = getApp();

Page({
    data: {
        sopenid: ""
    },
    onLoad: function(t) {
        this.openid = wx.getStorageSync("openid"), this.userInfo = wx.getStorageSync("userInfo"), 
        this.openid ? (console.log(t.op), console.log(this.openid), this.setData({
            userInfo: this.userInfo.wxInfo,
            sopenid: t.op
        }), this.getReward(), this.getUser(t.op)) : wx.redirectTo({
            url: "../index/index"
        });
    },
    getReward: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/GetReward",
            data: {
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                e.setData({
                    RewardList: t.data.data
                });
            }
        });
    },
    getUser: function(t) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                mod: 1,
                openid: t,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                e.setData({
                    userOther: t.data.data
                });
            }
        });
    },
    pay: function(t) {
        var e = this, a = Math.random(), n = e.data.userInfo.nickName, s = Number(t.currentTarget.dataset.pay), o = t.currentTarget.dataset.title, r = t.currentTarget.dataset.sid, i = t.currentTarget.dataset.img, c = t.currentTarget.dataset.hotnum, d = e.data.sopenid;
        console.log(d), app.util.request({
            url: "entry/wxapp/pay",
            data: {
                orderid: a,
                openid: e.openid,
                username: n,
                shopNum: 2,
                price: s,
                sopenid: d,
                hotnum: c,
                stitle: o,
                sid: r,
                img: i
            },
            cachetime: "0",
            success: function(t) {
                t.data && t.data.data && !t.data.errno && wx.requestPayment({
                    timeStamp: t.data.data.timeStamp,
                    nonceStr: t.data.data.nonceStr,
                    package: t.data.data.package,
                    signType: "MD5",
                    paySign: t.data.data.paySign,
                    success: function(t) {
                        "requestPayment:ok" == t.errMsg && wx.showModal({
                            title: "提示",
                            content: "打赏成功，确认跳转",
                            showCancel: !1,
                            success: function(t) {
                                "showModal:ok" == t.errMsg && (wx.reLaunch({
                                    url: "../index/index?op=" + d
                                }), e.postShang(d, c));
                            }
                        });
                    },
                    fail: function() {
                        wx.showModal({
                            title: "提示",
                            content: "确定要放弃打赏吗？",
                            cancel: !1,
                            success: function(t) {
                                1 != t.cancel && 0 != t.cancel || wx.reLaunch({
                                    url: "../index/index?op=" + d
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    postShang: function(t, e) {
        app.util.request({
            url: "entry/wxapp/AddShang",
            data: {
                openid: t,
                hotnum: e,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data);
            }
        });
    }
});