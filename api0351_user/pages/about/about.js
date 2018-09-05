var app = getApp();

Page({
    data: {
        footer: "",
        content: ""
    },
    onLoad: function(t) {
        var a = this;
        a.setData({
            loadingHide: !1
        }), setTimeout(function() {
            a.setData({
                loadingHide: !0
            });
        }, 1e3), this.getFooter();
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
                console.log(t.data.data), a.setData({
                    footer: t.data.data.copyt,
                    content: t.data.data.content
                });
            }
        });
    }
});