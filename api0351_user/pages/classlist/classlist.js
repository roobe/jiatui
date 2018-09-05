var app = getApp();

Page({
    data: {
        currentPageNumber: 1,
        listData: [],
        loadingMore: !1,
        noMoreData: 1,
        cid: 0
    },
    onLoad: function(a) {
        console.log(a.id), this.setData({
            cid: a.id
        }), this.getData(a.id);
    },
    getData: function(a) {
        var o = this;
        this.setData({
            loadingMore: !0
        }), wx.showNavigationBarLoading(), app.util.request({
            url: "entry/wxapp/GetDataClas",
            data: {
                page: o.data.currentPageNumber,
                cid: a
            },
            cachetime: 0,
            success: function(a) {
                console.log(a);
                var t = a.data.data;
                console.log(t);
                var e = a.data.message;
                0 == e || 0 == t.length ? o.setData({
                    noMoreData: 3,
                    loadingMore: !1
                }) : (o.setData({
                    listData: o.data.listData.concat(t)
                }), o.data.listData.length >= e && o.setData({
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
            console.log("下拉后获取的CID = " + a), this.getData(a);
        }
    }
});