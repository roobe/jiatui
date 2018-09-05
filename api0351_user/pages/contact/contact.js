var app = getApp();

function upload_file_server(o, i, s, t) {
    console.log(i[s]);
    var a = app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=UploadWx&m=api0351_user";
    wx.uploadFile({
        url: a,
        filePath: i[s].path,
        name: "file",
        formData: {
            path: "wxchat",
            openid: t
        },
        success: function(t) {
            var a = JSON.parse(t.data);
            if (1 == a.Success) {
                var e = a.SaveName;
                i[s].path_server = e;
            }
            o.setData({
                upload_picture_list: i
            });
        }
    }).onProgressUpdate(function(t) {
        i[s].upload_percent = t.progress, o.setData({
            upload_picture_list: i
        });
    });
}

Page({
    data: {
        openid: 0,
        signature: "",
        footer: "",
        upload_picture_list: []
    },
    onLoad: function(t) {
        this.uid = t.op, this.getData(t.op);
        var a = wx.getStorageSync("footer");
        this.setData({
            openid: t.op,
            footer: a
        }), this.getDataImg(t.op), app.pageConfig(this);
    },
    getDataImg: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/GetImg",
            data: {
                openid: t
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data), a.setData({
                    upload_picture_list: t.data.data
                });
            }
        });
    },
    getData: function(t) {
        var a = this;
        wx.showToast({
            title: "加载中",
            icon: "loading",
            duration: 3e3
        }), wx.showNavigationBarLoading(), app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                openid: t,
                mod: 1
            },
            cachetime: 0,
            success: function(t) {
                0 != t.data.data.userMber && a.setData({
                    signature: t.data.data.signature
                });
            },
            complete: function() {
                wx.hideToast(), wx.hideNavigationBarLoading();
            }
        });
    },
    delImg: function(t) {
        var a = this, e = t.currentTarget.dataset.id, o = a.data.openid;
        wx.showModal({
            title: "删除提示",
            content: "确定要删除当前图片吗？",
            cancel: !1,
            success: function(t) {
                1 == t.confirm && app.util.request({
                    url: "entry/wxapp/DelImg",
                    data: {
                        openid: o,
                        id: e
                    },
                    cachetime: 0,
                    success: function(t) {
                        wx.showToast({
                            title: "删除成功",
                            icon: "success",
                            duration: 1200
                        }), setTimeout(function() {
                            a.onLoad({
                                op: o
                            });
                        }, 1200);
                    }
                });
            }
        });
    },
    formSubmit: function(a) {
        var e = this, o = this.data.openid;
        app.util.request({
            url: "entry/wxapp/UserUp",
            data: a.detail.value,
            cachetime: 0,
            success: function(t) {
                e.formId(o, a.detail.formId), wx.showToast({
                    title: "更新成功",
                    icon: "loading",
                    duration: 1500
                }), wx.showModal({
                    content: "信息更新成功，确定返回首页",
                    showCancel: !0,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "../index/index"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideToast(), wx.hideNavigationBarLoading();
            }
        });
    },
    formId: function(t, a) {
        app.util.request({
            url: "entry/wxapp/formId",
            data: {
                openid: t,
                formid: a
            },
            cachetime: 0,
            success: function(t) {
                console.log(t);
            }
        });
    },
    chooseimage: function() {
        var i = this, s = i.data.upload_picture_list, n = i.data.openid;
        wx.chooseImage({
            count: 4,
            sizeType: [ "compressed" ],
            sourceType: [ "album" ],
            success: function(t) {
                var a = t.tempFiles;
                for (var e in a) a[e].upload_percent = 0, a[e].path_server = "", s.push(a[e]);
                for (var o in i.setData({
                    upload_picture_list: s
                }), s) 0 == s[o].upload_percent && upload_file_server(i, s, o, n);
            }
        });
    }
});