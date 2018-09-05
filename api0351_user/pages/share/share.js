var app = getApp();

Page({
    data: {
        imagePath: ""
    },
    onLoad: function(t) {
        this.uid = t.uid, this.uid ? this.getUser() : wx.redirectTo({
            url: "../index/index"
        });
    },
    getUser: function() {
        var e = this;
        app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                uid: this.uid,
                mod: 2
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data);
                t.data.data.avatarUrl;
                var a = t.data.data.nickName;
                t.data.data.user_zc;
                null == a ? wx.showModal({
                    title: "提示",
                    content: "您的姓名尚未设置(基础信息-姓名)",
                    showCancel: !1,
                    success: function(t) {
                        wx.redirectTo({
                            url: "../user/user"
                        });
                    }
                }) : e.Share();
            }
        });
    },
    saveImgToPhotosAlbumTap: function() {
        var a = this.data.imagePath;
        a ? wx.getSetting({
            success: function(t) {
                t.authSetting["scope.record"] || wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        wx.saveImageToPhotosAlbum({
                            filePath: a,
                            success: function(t) {
                                "saveImageToPhotosAlbum:ok" == t.errMsg ? wx.showToast({
                                    title: "成功保存",
                                    icon: "success",
                                    duration: 1e3
                                }) : wx.showToast({
                                    title: "保存失败",
                                    icon: "loading",
                                    duration: 1e3
                                });
                            }
                        });
                    }
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "图片绘制中，请稍后重试",
            showCancel: !1
        });
    },
    Share: function(t) {
        var s = this, a = this.uid;
        wx.showLoading({
            title: "生产中"
        }), app.util.request({
            url: "entry/wxapp/CodePic",
            data: {
                uid: a
            },
            cachetime: 0,
            success: function(t) {
                console.log("-----------------------------------------------------"), console.log(t.data.data);
                var e = t.data.data;
                if (1 == e) wx.showModal({
                    title: "提示",
                    content: "生成失败,请重试",
                    showCancel: !1,
                    success: function(t) {
                        s.onLoad();
                    }
                }); else {
                    var a = app.util.wxPromisify(wx.getImageInfo);
                    Promise.all([ a({
                        src: e.avatarUrl
                    }), a({
                        src: e.shareurl
                    }) ]).then(function(t) {
                        var a = wx.createCanvasContext("shareCanvas");
                        a.drawImage("../../image/code_bg.jpg", 0, 0, 327, 486);
                        a.drawImage(t[1].path, 83.5, 250, 160, 160), a.setFillStyle("#333333"), a.setFontSize(16), 
                        a.setTextAlign("center"), a.fillText(e.nickName, 163.5, 180), a.fillText(e.user_gs, 163.5, 200);
                        a.beginPath(), a.arc(165, 110, 45, 0, 2 * Math.PI, !1), a.clip(), a.drawImage(t[0].path, 120, 65, 90, 90), 
                        a.stroke(), wx.hideLoading(), wx.showToast({
                            title: "生产成功",
                            icon: "success",
                            duration: 1e3
                        }), a.draw(!1, setTimeout(function() {
                            wx.canvasToTempFilePath({
                                canvasId: "shareCanvas",
                                destWidth: 327,
                                destHeight: 500,
                                fileType: "png",
                                quality: 1,
                                success: function(t) {
                                    var a = t.tempFilePath;
                                    console.log(a), s.setData({
                                        imagePath: a
                                    }), wx.hideToast();
                                },
                                fail: function(t) {
                                    console.log("生成失败"), onLoad({
                                        uid: s.uid
                                    });
                                }
                            });
                        }, 1e3));
                    });
                }
            }
        });
    }
});