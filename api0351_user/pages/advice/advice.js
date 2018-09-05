var app = getApp();

Page({
    data: {
        loading: !1,
        disabled: !1,
        footer: ""
    },
    onLoad: function(a) {
        var t = wx.getStorageSync("footer"), e = wx.getStorageSync("openid"), n = wx.getStorageSync("userInfo");
        this.setData({
            footer: t,
            openid: e,
            nickName: n.wxInfo.nickName,
            avatarUrl: n.wxInfo.avatarUrl
        });
    },
    formSubmit: function(a) {
        var t = a.detail.value.content, e = a.detail.value;
        this.uid;
        if (0 === t.length) return wx.showToast({
            title: "内容不能为空",
            icon: "loading",
            duration: 1500
        }), !1;
        app.util.request({
            url: "entry/wxapp/PsOpinion",
            data: {
                content: t,
                openid: e.openid,
                nickName: e.nickName,
                avatarUrl: e.avatarUrl,
                m: "api0351_user"
            },
            success: function(a) {
                wx.showModal({
                    content: "感谢您的信息反馈",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.redirectTo({
                            url: "../index/index"
                        });
                    }
                });
            }
        });
    }
});