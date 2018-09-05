var app = getApp();

Page({
    data: {
        conmment_list: [],
        noMoreData: !1,
        loadingMore: !1,
        currentPageNumber: 1
    },
    onLoad: function(a) {
        this.openid = a.op, this.pullUpLoad();
    },
    onShow: function() {},
    pullUpLoad: function() {
        var o = this;
        this.setData({
            loadingMore: !0
        }), wx.showNavigationBarLoading();
        var a = this.openid;
        app.util.request({
            url: "entry/wxapp/GetShop",
            data: {
                openid: a,
                page: o.data.currentPageNumber
            },
            cachetime: 0,
            success: function(a) {
                var t = a.data.data, e = a.data.message;
                0 == e ? o.setData({
                    noMoreData: 3
                }) : (o.setData({
                    conmment_list: o.data.conmment_list.concat(t)
                }), o.data.conmment_list.length == e && o.setData({
                    noMoreData: 2
                }));
            },
            complete: function() {
                o.setData({
                    loadingMore: !1
                }), wx.hideNavigationBarLoading();
            }
        });
    },
    onReachBottom: function() {
        2 != this.data.noMoreData && (this.setData({
            currentPageNumber: this.data.currentPageNumber + 1
        }), this.pullUpLoad());
    }
});