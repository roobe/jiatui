var app = getApp(), qiniuUploader = require("../../resource/js/qiniuUploader");

Page({
    data: {
        markers: [],
        imglist: [],
        item: "../../image/add.png",
        loading: !1,
        disabled: !1,
        loadingHide: !0,
        content: ""
    },
    onLoad: function() {
        this.openid = wx.getStorageSync("openid"), this.openid ? (app.pageConfig(this), 
        this.upToken()) : wx.redirectTo({
            url: "../index/index"
        });
    },
    onShow: function() {
        this.setData({
            disabled: !1,
            loading: !1
        });
    },
    upToken: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/QiniuUptoke",
            data: {},
            cachetime: 0,
            success: function(e) {
                console.log(e.data.data), t.setData({
                    upToken: e.data.data
                });
            }
        });
    },
    formSubmit: function(e) {
        var a = this, i = a.data.imglist, t = e.detail.value.content, o = e.detail.value.title, n = this.openid;
        0 === o.length ? wx.showToast({
            title: "标题没写",
            icon: "loading",
            duration: 2e3
        }) : 0 === t.length ? wx.showToast({
            title: "内容没写",
            icon: "loading",
            duration: 2e3
        }) : 0 === i.length ? wx.showToast({
            title: "上传封面",
            icon: "loading",
            duration: 2e3
        }) : (a.formId(n, e.detail.formId), wx.showToast({
            title: "请稍后",
            icon: "loading",
            duration: 4e3
        }), app.util.request({
            url: "entry/wxapp/ShopAdd",
            data: {
                title: o,
                content: t,
                openid: n
            },
            cachetime: 0,
            success: function(t) {
                if (1 == a.data.wxConfig[1].value) for (var e = app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=ShopPic&m=api0351_user", o = 0; o < i.length; o++) wx.uploadFile({
                    url: e,
                    filePath: i[0],
                    name: "files",
                    formData: {
                        id: t.data.message
                    },
                    success: function(e) {
                        1 == JSON.parse(e.data).data && wx.showModal({
                            title: "操作提示",
                            showCancel: !1,
                            content: "发布成功，确认跳转",
                            success: function(e) {
                                wx.redirectTo({
                                    url: "../shops/shops?op=" + n
                                });
                            }
                        });
                    },
                    fail: function(e) {}
                }); else qiniuUploader.upload(i[0], function(e) {
                    console.log(e.key), e.key && app.util.request({
                        url: "entry/wxapp/QiniuShop",
                        data: {
                            id: t.data.message,
                            photo: e.key
                        },
                        cachetime: 0,
                        success: function(e) {
                            wx.showModal({
                                title: "操作提示",
                                showCancel: !1,
                                content: "发布成功，确认跳转",
                                success: function(e) {
                                    wx.redirectTo({
                                        url: "../shops/shops?op=" + n
                                    });
                                }
                            });
                        }
                    });
                }, function(e) {
                    console.log("error: " + e);
                }, {
                    region: a.data.wxConfig[2].value,
                    domain: a.data.wxConfig[6].value,
                    uptoken: a.data.upToken
                });
            }
        }));
    },
    checkimg: function() {
        self = this, wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album" ],
            success: function(e) {
                var t = e.tempFilePaths;
                self.setData({
                    imglist: t
                });
            }
        });
    },
    formId: function(e, t) {
        app.util.request({
            url: "entry/wxapp/formId",
            data: {
                openid: e,
                formid: t
            },
            cachetime: 0,
            success: function(e) {
                console.log(e);
            }
        });
    }
});