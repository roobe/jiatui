var app = getApp();

Page({
    data: {
        conmment_list: [],
        noMoreData: !1,
        loadingMore: !1,
        currentPageNumber: 1
    },
    onLoad: function() {
        this.openid = wx.getStorageSync("openid"), this.openid ? (this.pullUpLoad(), app.pageConfig(this)) : wx.redirectTo({
            url: "../index/index"
        });
    },
    onShow: function() {},
    addServ: function() {
        wx.navigateTo({
            url: "../addserv/addserv?op=" + this.openid
        });
    },
    editServ: function(t) {
        var e = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../edserv/edserv?op=" + this.openid + "&id=" + e
        });
    },
    delServ: function(t) {
        var e = this, a = t.currentTarget.dataset.id;
        console.log(a), app.util.request({
            url: "entry/wxapp/DelShop",
            data: {
                id: a
            },
            cachetime: 0,
            success: function(t) {
                wx.showToast({
                    title: "删除成功",
                    icon: "success",
                    duration: 1500
                }), setTimeout(function() {
                    e.getPullRefresh();
                }, 1e3);
            }
        });
    },
    pullUpLoad: function() {
        var n = this;
        this.setData({
            loadingMore: !0
        }), wx.showNavigationBarLoading();
        var t = this.openid;
        app.util.request({
            url: "entry/wxapp/GetShop",
            data: {
                openid: t,
                page: n.data.currentPageNumber
            },
            cachetime: 0,
            success: function(t) {
                var e = t.data.data, a = t.data.message;
                0 == a ? n.setData({
                    noMoreData: 3
                }) : (n.setData({
                    conmment_list: n.data.conmment_list.concat(e)
                }), n.data.conmment_list.length == a && n.setData({
                    noMoreData: 2
                }));
            },
            complete: function() {
                n.setData({
                    loadingMore: !1
                }), wx.hideNavigationBarLoading();
            }
        });
    },
    getPullRefresh: function() {
        this.currentPageNumber = 1, this.setData({
            noMoreData: !1,
            noData: !1,
            conmment_list: []
        });
        var a = this, t = this.openid;
        app.util.request({
            url: "entry/wxapp/GetShop",
            data: {
                openid: t
            },
            success: function(t) {
                var e = t.data.data;
                null != e && (a.setData({
                    conmment_list: e
                }), 0 < e.length ? a.currentPageNumber++ : a.setData({
                    noMoreData: !0
                }), wx.stopPullDownRefresh());
            }
        });
    },
    onReachBottom: function() {
        2 != this.data.noMoreData && (this.setData({
            currentPageNumber: this.data.currentPageNumber + 1
        }), this.pullUpLoad());
    }
});