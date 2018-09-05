var app = getApp();

Page({
    data: {
        BannerList: [],
        menuTapCurrent: 0,
        TongNum: 0,
        meNum: 0,
        noServ: 0,
        noServs: 0,
        noServx: 0,
        noServa: 0,
        userAdd: 0,
        topNum: 0
    },
    onLoad: function(t) {
        app.util.footer(this), this.getBanner(), this.openid = wx.getStorageSync("openid"), 
        this.getNews(), this.getShop(1), this.getTongji(), this.getUserShop(this.openid), 
        this.getFooter();
    },
    getFooter: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/Footer",
            data: {
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                a.setData({
                    payStart: t.data.data.payStart
                });
            }
        });
    },
    goTop: function(t) {
        console.log("返回顶部"), this.setData({
            topNum: this.data.topNum = 0
        });
    },
    getUserShop: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/getUserShop",
            data: {
                openid: t,
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                console.log(t.data.data), 0 == t.data.data && a.setData({
                    userAdd: 1
                });
            }
        });
    },
    getTongji: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/GetTong",
            data: {
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                a.setData({
                    TongNum: t.data.data.length,
                    meNum: t.data.message
                });
            }
        });
    },
    ShopinAdd: function() {
        var t = this.openid;
        1 != this.data.payStart ? this.getUserAdmin(t, 2) : wx.navigateTo({
            url: "../shops/shops?op=" + t
        });
    },
    ShopAdd: function() {
        var t = this.openid;
        1 != this.data.payStart ? this.getUserAdmin(t, 1) : wx.navigateTo({
            url: "../shop/shop?op=" + t
        });
    },
    getUserAdmin: function(a, e) {
        var s = this;
        app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                openid: a,
                mod: 1
            },
            cachetime: 30,
            success: function(t) {
                console.log(t.data.data), s.setData({
                    user_vip: t.data.data.user_vip
                }), 1 == t.data.data.user_vip ? 2 == e ? wx.navigateTo({
                    url: "../shops/shops?op=" + a
                }) : 1 == e && wx.navigateTo({
                    url: "../shop/shop?op=" + a
                }) : wx.showModal({
                    title: "提示",
                    content: "需先获取名片功能的使用权",
                    cancel: !0,
                    success: function(t) {
                        wx.redirectTo({
                            url: "../user/user"
                        });
                    }
                });
            }
        });
    },
    menuTap: function(t) {
        var a = t.currentTarget.dataset.current;
        this.setData({
            menuTapCurrent: a,
            shop: [],
            shopNlist: [],
            NewsList: [],
            shopNumber: [],
            noServ: 0,
            noServs: 0,
            noServx: 0,
            noServa: 0
        }), 0 == a ? (this.getNews(), this.getShop(1)) : 1 == a ? this.getShop(0) : 2 == a && this.getNewShop();
    },
    getBanner: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/Banner",
            data: {
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                a.setData({
                    BannerList: t.data.data
                });
            }
        });
    },
    goUserShop: function(t) {
        var a = t.currentTarget.dataset.op;
        wx.navigateTo({
            url: "../index/index?op=" + a
        });
    },
    getNews: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/GetNews",
            data: {
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                0 == t.data.data.length ? a.setData({
                    NewsList: 0,
                    noServs: 1
                }) : setTimeout(function() {
                    a.setData({
                        NewsList: t.data.data,
                        noServs: 2
                    });
                }, 1e3);
            }
        });
    },
    getNewShop: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/GetShop",
            data: {
                k: 1,
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                0 == t.data.data.length ? a.setData({
                    shopNlist: 0,
                    noServa: 1
                }) : setTimeout(function() {
                    a.setData({
                        shopNlist: t.data.data,
                        noServa: 2
                    });
                }, 1e3);
            }
        });
    },
    getShop: function(t) {
        var a = this;
        0 == t ? app.util.request({
            url: "entry/wxapp/ShopList",
            data: {
                s: t,
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                0 == t.data.data.length ? a.setData({
                    shop: 0,
                    noServx: 1
                }) : setTimeout(function() {
                    a.setData({
                        shop: t.data.data,
                        noServx: 2
                    });
                }, 1e3);
            }
        }) : app.util.request({
            url: "entry/wxapp/ShopList",
            data: {
                s: t,
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                console.log(t.data.data), 0 == t.data.data.length ? a.setData({
                    shopNumber: 0,
                    noServ: 1
                }) : setTimeout(function() {
                    a.setData({
                        shopNumber: t.data.data,
                        noServ: 2
                    });
                }, 500);
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "贸易街精选旺铺",
            path: "/api0351_user/pages/trade/trade"
        };
    }
});