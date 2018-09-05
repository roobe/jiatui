var app = getApp(), qiniuUploader = require("../../../resource/js/qiniuUploader");

Page({
    data: {
        src: "",
        footer: "",
        upToken: ""
    },
    onLoad: function(a) {
        app.pageConfig(this), this.uid = a.op;
        var t = wx.getStorageSync("footer");
        this.setData({
            footer: t
        });
        var e = a.avatar;
        e ? this.setData({
            src: e,
            uid: this.uid
        }) : this.getData(), this.upToken();
    },
    upToken: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/QiniuUptoke",
            data: {},
            cachetime: 0,
            success: function(a) {
                t.setData({
                    upToken: a.data.data
                });
            }
        });
    },
    getData: function() {
        wx.showToast({
            title: "加载中",
            icon: "loading",
            duration: 3e3
        }), wx.showNavigationBarLoading();
        var e = this;
        app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                openid: this.uid,
                mod: 1
            },
            cachetime: 30,
            success: function(a) {
                if (null == a.data.data.avatarUrl || "" == a.data.data.avatarUrl || null == a.data.data.avatarUrl) var t = "../../../image/upload.png"; else t = a.data.data.avatarUrl;
                e.setData({
                    src: t
                });
            },
            complete: function() {
                wx.hideToast(), wx.hideNavigationBarLoading();
            }
        });
    },
    upload: function() {
        var e = this.uid;
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album" ],
            success: function(a) {
                var t = a.tempFilePaths[0];
                wx.redirectTo({
                    url: "../upload/upload?src=" + t + "&op=" + e
                });
            }
        });
    },
    saveAvatar: function(a) {
      wx.showToast({
        title: "正在保存",
        icon: "loading",
        duration: 3e3
      }), wx.showNavigationBarLoading();

        var t = this, e = a.currentTarget.dataset.avatar, o = a.currentTarget.dataset.uid;
        if (1 == t.data.wxConfig[1].value) {
            var i = app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&t=0&v=" + app.siteInfo.version + "&from=wxapp&c=entry&a=wxapp&do=PostAvatar&m=api0351_user";
            wx.uploadFile({
                url: i,
                filePath: e,
                name: "files",
                formData: {
                    openid: o
                },
                success: function(a) {
                  wx.hideToast(), wx.hideNavigationBarLoading();
                    var t = JSON.parse(a.data);
                    console.log(t), t.data && wx.showModal({
                        title: "操作提示",
                        showCancel: !1,
                        content: "头像信息完善成功,确认跳转",
                        success: function(a) {
                            wx.reLaunch({
                                url: "/api0351_user/pages/index/index"
                            });
                        }
                    });
                },
                fail: function(a) {
                    "uploadFile:fail createUploadTask:fail file not found" == a.errMsg && wx.showModal({
                        title: "无效操作",
                        showCancel: !1,
                        content: "点击封面头像即可选择裁剪新的图片!",
                        success: function(a) {}
                    });
                }
            });
        } else {
            var n = t.data.src;
            qiniuUploader.upload(n, function(a) {
                console.log(a.key), a.key && app.util.request({
                    url: "entry/wxapp/QiniuUpload",
                    data: {
                        openid: o,
                        avatarUrl: a.key
                    },
                    cachetime: 0,
                    success: function(a) {
                        console.log(a.data.data), wx.showModal({
                            title: "操作提示",
                            showCancel: !1,
                            content: "头像信息完善成功,确认跳转",
                            success: function(a) {
                                wx.redirectTo({
                                    url: "/api0351_user/pages/index/index"
                                });
                            }
                        });
                    }
                });
            }, function(a) {
                console.log("error: " + a);
            }, {
                region: t.data.wxConfig[2].value,
                domain: t.data.wxConfig[6].value,
                uptoken: t.data.upToken
            });
        }
    }
});