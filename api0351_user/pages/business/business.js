var app = getApp();

Page({
    data: {
        classMav: [],
        index: 0,
        brandindex: 0,
        branda: [],
        sid: 0,
        cid: 0,
        loadingMore: !1,
        noMoreData: 1,
        currentPageNumber: 1,
        listData: [],
        listDatas: [],
        menuTapCurrent: 0,
        searchTapCurrent: 0,
        splaceholder: "输入业务关键词检索名片",
        searchClass: !1,
        searchCltxt: "分类"
    },
    onLoad: function() {
        this.openid = wx.getStorageSync("openid"), this.openid ? (this.getClass(), this.getData(0, 0)) : wx.showModal({
            title: "无权查看",
            content: "请先允许微信授权登录",
            showCancel: !1,
            success: function(a) {
                1 == a.confirm && wx.redirectTo({
                    url: "../index/index"
                });
            }
        }), this.getBanner(), app.util.footer(this);
    },
    wxapp: function() {
        wx.navigateToMiniProgram({
            appId: "wx130bbaf327486123",
            path: "pages/index/index?id=123",
            extraData: {
                foo: "bar"
            },
            envVersion: "develop",
            success: function(a) {
                console.log(a);
            }
        });
    },
    searchTap: function(a) {
        var t = a.currentTarget.dataset.current;
        this.setData({
            searchTapCurrent: t
        }), 0 == t ? this.setData({
            splaceholder: "输入业务关键词检索名片",
            searchClass: !1,
            searchCltxt: "介绍"
        }) : 1 == t ? this.setData({
            splaceholder: "输入个人姓名进行名片检索",
            searchClass: !1,
            searchCltxt: "姓名"
        }) : 2 == t && this.setData({
            splaceholder: "输入公司名称进行名片检索",
            searchClass: !1,
            searchCltxt: "公司"
        });
    },
    searchCla: function() {
        this.setData({
            searchClass: !0
        });
    },
    menuTap: function(a) {
        var t = a.currentTarget.dataset.current;
        this.setData({
            menuTapCurrent: t,
            listDatas: [],
            listData: [],
            currentPageNumber: 1
        }), console.log(t), 0 == t ? this.getData(0, 0) : 1 == t && this.getDataHot(3);
    },
    getDataHot: function(a) {
        var s = this;
        this.setData({
            loadingMore: !0
        }), wx.showNavigationBarLoading(), app.util.request({
            url: "entry/wxapp/GetData",
            data: {
                page: 1,
                xid: a
            },
            cachetime: 30,
            success: function(a) {
                console.log(a.data);
                var t = a.data.data, e = a.data.message;
                0 == e || 0 == t.length ? s.setData({
                    noMoreData: 3,
                    loadingMore: !1
                }) : (s.setData({
                    listDatas: s.data.listDatas.concat(t)
                }), s.data.listData.length >= e && s.setData({
                    noMoreData: 2,
                    loadingMore: !1
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading();
            }
        });
    },
    getBanner: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/Banner",
            data: {
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(a) {
                t.setData({
                    BannerList: a.data.data
                });
            }
        });
    },
    swichNav: function(a) {
        var t = a.currentTarget.dataset.cid;
        this.getUserMore(this.openid, t, 2);
    },
    swichNavMore: function() {
        this.getUserMore(this.openid, 0, 0);
    },
    goods_search_bind: function(a) {
        var t = a.detail.value;
        this.getUserMore(this.openid, t, 3);
    },
    goUserMroe: function(a) {
        var t = a.currentTarget.dataset.id;
        this.getUserMore(this.openid, t, 1);
    },
    getUserMore: function(a, t, e) {
        var s = this;
        console.log("执行了1"), app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                openid: a,
                mod: 1,
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(a) {
                null == a.data.data.nickName ? wx.showModal({
                    title: "无权查看",
                    content: "个人信息还不完善,确认跳转",
                    showCancel: !1,
                    success: function(a) {
                        wx.redirectTo({
                            url: "../user/user"
                        });
                    }
                }) : 0 == e ? wx.navigateTo({
                    url: "../ification/ification"
                }) : 1 == e ? wx.navigateTo({
                    url: "../index/index?uid=" + t
                }) : 2 == e ? wx.navigateTo({
                    url: "../classlist/classlist?id=" + t
                }) : 3 == e && wx.navigateTo({
                    url: "../malllist/malllist?keywords=" + t + "&searchid=" + s.data.searchTapCurrent
                });
            }
        });
    },
    getData: function(a, t) {
        var s = this;
        this.setData({
            loadingMore: !0
        }), wx.showNavigationBarLoading(), app.util.request({
            url: "entry/wxapp/GetData",
            data: {
                page: s.data.currentPageNumber,
                cid: t,
                xid: a
            },
            cachetime: 30,
            success: function(a) {
                var t = a.data.data;
                console.log(t);
                var e = a.data.message;
                0 == e || 0 == t.length ? s.setData({
                    noMoreData: 3,
                    loadingMore: !1
                }) : (s.setData({
                    listData: s.data.listData.concat(t)
                }), s.data.listData.length >= e && s.setData({
                    noMoreData: 2,
                    loadingMore: !1
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading();
            }
        });
    },
    onReachBottom: function() {
        if (2 != this.data.noMoreData) {
            this.setData({
                currentPageNumber: this.data.currentPageNumber + 1
            });
            var a = this.data.cid;
            0 == a ? (console.log("======" + a), this.getData(0, a)) : (console.log("------" + a), 
            this.getData(2, a));
        }
    },
    getClass: function() {
        var i = this;
        wx.showNavigationBarLoading(), app.util.request({
            url: "entry/wxapp/ReClass",
            cachetime: 30,
            success: function(a) {
                for (var t = a.data.data, e = [], s = 0; s < t.length; s++) 1 == t[s].id && (t[0].csname = "全部"), 
                e.push(t[s]);
                i.setData({
                    classMav: e
                });
            }
        });
    },
    onShareAppMessage: function(a) {
        return {
            title: "建立我的名片加入商务合作",
            path: "/api0351_user/pages/business/business"
        };
    }
});