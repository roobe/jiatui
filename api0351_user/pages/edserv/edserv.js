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
    onLoad: function(e) {
        this.openid = wx.getStorageSync("openid"), this.openid ? (this.getData(e.id), app.pageConfig(this), 
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
    getData: function(e) {
        var t = this, a = this.openid;
        app.util.request({
            url: "entry/wxapp/GetShop",
            data: {
                openid: a,
                id: e
            },
            cachetime: 0,
            success: function(e) {
                console.log(e.data), t.setData({
                    markers: e.data.data[0]
                });
            }
        });
    },
    formSubmit: function(e) {
        var i = this, o = i.data.imglist, t = e.detail.value.content, a = e.detail.value.title, n = e.detail.value.id, s = this.openid;
        0 === a.length ? wx.showToast({
            title: "标题没写",
            icon: "loading",
            duration: 2e3
        }) : 0 === t.length ? wx.showToast({
            title: "内容没写",
            icon: "loading",
            duration: 2e3
        }) : (i.formId(s, e.detail.formId), wx.showToast({
            title: "请稍后",
            icon: "loading",
            duration: 4e3
        }), app.util.request({
            url: "entry/wxapp/ShopEdit",
            data: {
                id: n,
                title: a,
                content: t
            },
            cachetime: 0,
            success: function(t) {
                if (0 == o.length) wx.showModal({
                    title: "操作提示",
                    showCancel: !1,
                    content: "修改成功，确认跳转",
                    success: function(e) {
                        wx.redirectTo({
                            url: "../shops/shops?op=" + s
                        });
                    }
                }); else if (1 == i.data.wxConfig[1].value) for (var e = app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=ShopPic&m=api0351_user", a = 0; a < o.length; a++) wx.uploadFile({
                    url: e,
                    filePath: o[0],
                    name: "files",
                    formData: {
                        id: t.data.message
                    },
                    success: function(e) {
                        console.log(e), 1 == JSON.parse(e.data).data && wx.showModal({
                            title: "操作提示",
                            showCancel: !1,
                            content: "修改成功，确认跳转",
                            success: function(e) {
                                wx.redirectTo({
                                    url: "../user/user"
                                });
                            }
                        });
                    },
                    fail: function(e) {}
                }); else qiniuUploader.upload(o[0], function(e) {
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
                                content: "修改成功，确认跳转",
                                success: function(e) {
                                    wx.redirectTo({
                                        url: "../user/user"
                                    });
                                }
                            });
                        }
                    });
                }, function(e) {
                    console.log("error: " + e);
                }, {
                    region: i.data.wxConfig[2].value,
                    domain: i.data.wxConfig[6].value,
                    uptoken: i.data.upToken
                });
            }
        }));
    },
    checkimg: function() {
        self = this, wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
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