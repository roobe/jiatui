var app = getApp();

Page({
    data: {
        viewData: []
    },
    onLoad: function(t) {
        this.id = t.id, this.getSerData(this.id);
    },
    goHome: function() {
        wx.navigateTo({
            url: "../index/index"
        });
    },
    getSerData: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/GetShop",
            data: {
                id: t
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data), wx.showToast({
                    title: "加载中",
                    icon: "loading",
                    duration: 5e3
                }), a.setData({
                    viewData: t.data.data[0]
                });
            },
            complete: function() {
                wx.hideToast();
            }
        });
    },
    onShareAppMessage: function(t) {
        var a = this.id;
        return {
            title: this.data.viewData.title,
            path: "/api0351_user/pages/serview/serview?id=" + a
        };
    }
});