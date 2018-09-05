var util = require("api0351_user/resource/js/util.js");

App({
    onLaunch: function(e) {
        this.onLogin();
    },
    onShow: function(e) {
        var o = this;
        wx.getSystemInfo({
            success: function(e) {
                -1 != e.model.search("iPhone X") && (o.globalData.isIphoneX = !0);
            }
        });
    },
    onHide: function() {},
    onError: function(e) {
        console.log(e);
    },
    pageConfig: function(o) {
        util.request({
            url: "entry/wxapp/Config",
            cachetime: 0,
            success: function(e) {
                o.setData({
                    wxConfig: e.data.data
                });
            }
        });
    },
    onLogin: function() {
        wx.checkSession({
            success: function(e) {
                console.log("处于登录态");
            },
            fail: function(e) {
                console.log("需要重新登录");
            }
        });
    },
    check: function(o) {
        var n = this;
        this.globalData.userInfo ? "function" == typeof o && o(this.globalData.userInfo) : wx.getSetting({
            success: function(e) {
                e.authSetting["scope.userInfo"] ? wx.getUserInfo({
                    withCredentials: !0,
                    success: function(e) {
                        n.login(o);
                    },
                    fail: function() {
                        n.showLoginModal(o);
                    }
                }) : n.showLoginModal(o);
            },
            fail: function() {
                n.showLoginModal(o);
            }
        });
    },
    login: function(n) {
        var s = this;
        wx.login({
            success: function(o) {
                o.code ? wx.getUserInfo({
                    success: function(e) {
                        util.request({
                            url: "entry/wxapp/Login",
                            data: {
                                code: o.code,
                                rawData: e.rawData
                            },
                            cachetime: 30,
                            success: function(e) {
                              console.log(e.data.data.session_key), wx.setStorageSync("openid", e.data.data.openid), wx.setStorageSync("sessionKey", e.data.data.session_key),
                                wx.setStorageSync("userInfo", e.data.data), s.globalData.userInfo = e.data.data, 
                                "function" == typeof n && n(s.globalData.userInfo), console.log("app ------------------------------------ 缓存写入成功");
                            }
                        });
                    },
                    fail: function(e) {
                        console.log("app --- x"), s.showLoginModal(n);
                    }
                }) : (console.log("app --- a"), s.showLoginModal(n));
            }
        });
    },
    showLoginModal: function(o) {
        var n = this;
        n.globalData.userInfo ? "function" == typeof o && o(n.globalData.userInfo) : wx.getSetting({
            success: function(e) {
                e.authSetting["scope.userInfo"] ? (n.login(o), console.log("app --- 1")) : (console.log("app --- 2"), 
                wx.reLaunch({
                    url: "/api0351_user/pages/index/index"
                }));
            }
        });
    },
    util: util,
    userInfo: {
        sessionid: null
    },
    tabBar: {
        color: "#ADADAD",
        selectedColor: "#FE9A81",
        borderStyle: "#F2F2F2",
        backgroundColor: "#FAFAFA",
        list: [ {
            pagePath: "/api0351_user/pages/index/index",
            iconPath: "/api0351_user/resource/icon/home.png",
            selectedIconPath: "/api0351_user/resource/icon/home-selected.png",
            text: "我的名片"
        }, {
            pagePath: "/api0351_user/pages/collection/collection",
            iconPath: "/api0351_user/image/c_8.png",
            selectedIconPath: "/api0351_user/resource/icon/category-selected.png",
            text: "名片夹"
        }, {
            pagePath: "/api0351_user/pages/trade/trade",
            iconPath: "/api0351_user/resource/icon/shop.png",
            selectedIconPath: "/api0351_user/resource/icon/shop-selected.png",
            text: "合作"
        }, {
            pagePath: "/api0351_user/pages/user/user",
            iconPath: "/api0351_user/resource/icon/user.png",
            selectedIconPath: "/api0351_user/resource/icon/user-selected.png",
            text: "我的账户"
        } ]
    },
    siteInfo: require("siteinfo.js"),
    globalData: {
        isIphoneX: !1,
        userInfo: null
    }
});