var app = getApp();

Page({
    data: {
        menuTapCurrent: 0,
        msNlist: [ {
            hidden: !0
        } ],
        msNumber: 0
    },
    onLoad: function(t) {
        this.openid = wx.getStorageSync("openid");
        var a = wx.getStorageSync("userInfo");
        this.setData({
            userInfo: a.wxInfo
        }), this.getMsn(0, this.openid);
    },
    delMsn: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/DelMessage",
            data: {
                mid: e
            },
            cachetime: 0,
            success: function(t) {
                1 == t.data.data && (wx.showToast({
                    title: "删除成功",
                    icon: "success",
                    duration: 1200
                }), setTimeout(function() {
                    a.onLoad({
                        op: a.openid
                    });
                }, 1200));
            }
        });
    },
    formSubmit: function(t) {
        var a = this, e = t.detail.value.content;
        t.detail.value;
        if (0 === e.length) return wx.showToast({
            title: "说点什么?",
            icon: "loading",
            duration: 1500
        }), !1;
        app.util.request({
            url: "entry/wxapp/Message",
            data: t.detail.value,
            cachetime: 0,
            success: function(t) {
                1 == t.data.data && (wx.showToast({
                    title: "回复成功",
                    icon: "success",
                    duration: 1200
                }), setTimeout(function() {
                    a.onLoad({
                        op: a.openid
                    });
                }, 1200));
            }
        });
    },
    menuTap: function(t) {
        var a = t.currentTarget.dataset.current;
        this.setData({
            menuTapCurrent: a,
            msNlist: []
        }), this.getMsn(a, this.openid);
    },
    getMsn: function(t, a) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/GetMesage",
            data: {
                openid: a,
                display: t
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data), e.setData({
                    msNlist: t.data.data,
                    msNumber: t.data.data.length
                });
            }
        });
    },
    displayDu: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = t.currentTarget.dataset.id;
        a.data.msNlist[e].hidden = !a.data.msNlist[e].hidden, 0 == a.data.msNlist[e].hidden && setTimeout(function() {
            a.onLoad({
                op: a.openid
            });
        }, 1200), app.util.request({
            url: "entry/wxapp/EdMesage",
            data: {
                mid: s,
                display: 1
            },
            cachetime: 0,
            success: function(t) {
                a.setData({
                    msNlist: a.data.msNlist
                });
            }
        });
    }
});