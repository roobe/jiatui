var app = getApp();

Page({
    data: {
        userInfo: {},
        footer: "",
        uid: 0,
        user_vip: 0,
        payStart: 1,
        wxpay: 0,
        loadingMore: !1,
        display: 0,
        switchStar: !1,
        switchTxt: "已公开我的名片信息",
        displayStart: 0,
        checked: !1,
        cycle: 0,
        paytime: "",
        report: 0,
        MesLength: 0
    },
    onLoad: function(t) {
        this.openid = wx.getStorageSync("openid");
        var a = wx.getStorageSync("userInfo"), e = this;
        this.openid ? (this.addUser(), setTimeout(function() {
            e.getFooter(), e.getUserAdmin();
        }, 1e3), this.getMes(this.openid), this.setData({
            userInfo: a.wxInfo
        })) : wx.showModal({
            title: "无权查看",
            content: "请先允许微信授权登录",
            showCancel: !1,
            success: function(t) {
                1 == t.confirm && wx.redirectTo({
                    url: "../index/index"
                });
            }
        }), app.util.footer(e), app.pageConfig(this);
    },
    cShare: function() {
        var t = this.openid;
        wx.navigateTo({
            url: "../share/share?op=" + t
        });
    },
    Private: function() {
        var t = this.openid;
        wx.navigateTo({
            url: "../private/private?op=" + t
        });
    },
    Rewardlog: function() {
        var t = this.openid;
        wx.navigateTo({
            url: "../rewardlog/rewardlog?op=" + t
        });
    },
    switchChange: function(t) {
        1 == t.detail.value ? (app.util.request({
            url: "entry/wxapp/EditDis",
            data: {
                openid: this.openid,
                display: 1
            },
            cachetime: 0,
            success: function(t) {
                wx.showToast({
                    title: "已开启",
                    icon: "success",
                    duration: 1e3
                });
            }
        }), this.setData({
            switchStar: t.detail.value,
            switchTxt: "已公开我的名片信息"
        })) : 0 == t.detail.value && (app.util.request({
            url: "entry/wxapp/EditDis",
            data: {
                openid: this.openid,
                display: 0
            },
            cachetime: 0,
            success: function(t) {
                wx.showToast({
                    title: "已关闭",
                    icon: "success",
                    duration: 1e3
                });
            }
        }), this.setData({
            switchStar: t.detail.value,
            switchTxt: "已隐藏我的名片信息"
        }));
    },
    addUser: function() {
        var a = this;
        a.setData({
            loadingMore: !0
        }), app.util.request({
            url: "entry/wxapp/UserData",
            data: {
                openid: this.openid
            },
            cachetime: 0,
            success: function(t) {
                setTimeout(function() {
                    a.setData({
                        loadingMore: !1,
                        display: 1
                    });
                }, 1200);
            }
        });
    },
    pay: function() {
        var a = this, t = Math.random(), e = a.data.user_vip, i = a.data.userInfo.nickName;
        1 == e ? wx.showModal({
            title: "提示",
            content: "请勿重复支付",
            showCancel: !1,
            success: function(t) {
                a.onLoad();
            }
        }) : app.util.request({
            url: "entry/wxapp/pay",
            data: {
                orderid: t,
                openid: this.openid,
                username: i
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
                            content: "支付成功，确认跳转",
                            showCancel: !1,
                            success: function(t) {
                                a.onLoad();
                            }
                        });
                    },
                    fail: function() {
                        wx.showModal({
                            title: "提示",
                            content: "确定要放弃支付吗？",
                            cancel: !1,
                            success: function(t) {
                                1 != t.cancel && 0 != t.cancel || wx.reLaunch({
                                    url: "../index/index"
                                });
                            }
                        });
                    }
                });
            },
            fail: function(t) {
                wx.showModal({
                    title: "系统提示",
                    content: t.data.message ? t.data.message : "错误",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                });
            }
        });
    },
    getFooter: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/Footer",
            data: {
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                wx.setStorageSync("footer", t.data.data.copyt), a.setData({
                    footer: t.data.data.copyt,
                    payStart: t.data.data.payStart,
                    wxpay: t.data.data.wxpay,
                    cycle: t.data.data.cycle
                });
            }
        });
    },
    lookMe: function() {
        wx.reLaunch({
            url: "../index/index?op=" + this.openid
        });
    },
    basicsUrl: function() {
        var t = this, a = t.data.user_vip, e = t.data.payStart;
        1 == e ? wx.navigateTo({
            url: "../basics/basics?op=" + this.openid
        }) : 2 == e && (1 == a ? wx.navigateTo({
            url: "../basics/basics?op=" + this.openid
        }) : 0 == a && t.pay());
    },
    shopUrl: function() {
        var t = this, a = t.data.user_vip, e = t.data.payStart;
        1 == e ? wx.navigateTo({
            url: "../shop/shop?op=" + this.openid
        }) : 2 == e && (1 == a ? wx.navigateTo({
            url: "../shop/shop?op=" + this.openid
        }) : 0 == a && t.pay());
    },
    coverUrl: function() {
        var t = this.data.user_vip, a = this.data.payStart;
        1 == a ? wx.navigateTo({
            url: "../cover/index/index?op=" + this.openid
        }) : 2 == a && (1 == t ? wx.navigateTo({
            url: "../cover/index/index?op=" + this.openid
        }) : 0 == t && this.pay());
    },
    contactUrl: function() {
        var t = this.data.user_vip, a = this.data.payStart;
        1 == a ? wx.navigateTo({
            url: "../contact/contact?op=" + this.openid
        }) : 2 == a && (1 == t ? wx.navigateTo({
            url: "../contact/contact?op=" + this.openid
        }) : 0 == t && this.pay());
    },
    shops: function() {
        var t = this.data.user_vip, a = this.data.payStart;
        1 == a ? wx.navigateTo({
            url: "../shops/shops?op=" + this.openid
        }) : 2 == a && (1 == t ? wx.navigateTo({
            url: "../shops/shops?op=" + this.openid
        }) : 0 == t && this.pay());
    },
    Collection: function() {
        var t = this.data.user_vip, a = this.data.payStart;
        1 == a ? wx.navigateTo({
            url: "../collection/collection?op=" + this.openid
        }) : 2 == a && (1 == t ? wx.navigateTo({
            url: "../collection/collection?op=" + this.openid
        }) : 0 == t && this.pay());
    },
    Business: function () {
     wx.navigateTo({
       url: "../business/business"
      })
   },
    advice: function() {
        wx.navigateTo({
            url: "../advice/advice"
        });
    },
    aboutUrl: function() {
        wx.navigateTo({
            url: "../about/about"
        });
    },
    getUserAdmin: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                openid: this.openid,
                mod: 1
            },
            cachetime: 0,
            success: function(t) {
                if (0 != t.data.data.userMber) {
                  e.setData({
                        item: t.data.data,
                        user_vip: t.data.data.user_vip,
                        paytime: t.data.data.overtime,
                        displayStart: t.data.data.display,
                        report: t.data.data.report,
                        avatarUrl: t.data.data.avatarUrl
                    });
                    var a = t.data.data.display;
                    setTimeout(function() {
                        1 == a ? e.setData({
                            checked: !0,
                            switchTxt: "已公开我的名片信息"
                        }) : e.setData({
                            checked: !1,
                            switchTxt: "已隐藏我的名片信息"
                        });
                    }, 800);
                }
            }
        });
    },
    getMes: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/GetMesage",
            data: {
                openid: t,
                k: 3,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                a.setData({
                    MesLength: t.data.data.length
                });
            }
        });
    }
});