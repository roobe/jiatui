var app = getApp(), qiniuUploader = require("../../resource/js/qiniuUploader");

Page({
    data: {
        CollData: [],
        noMoreData: 0,
        menuTapCurrent: 1,
        codisplay: !1,
        imgUrl: ""
    },
    onLoad: function(t) {
      console.log(t.menuTap)
      if (this.openid = wx.getStorageSync("openid"), this.openid) {
        this.setData({
          openid: this.openid
        }), app.pageConfig(this), this.upToken();
        var a = this;
        if (t.menuTap == 'cdr'){
          this.setData({
            menuTapCurrent: 0
          }),
            setTimeout(function () {
              a.getCdrList();
            }, 500);
        }else{
          setTimeout(function () {
            a.loadingColl();
          }, 300);
        }
      } else wx.redirectTo({
        url: "../index/index"
      })

      app.util.footer(this)
        ;
    },
    upToken: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/QiniuUptoke",
            data: {},
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data), a.setData({
                    upToken: t.data.data
                });
            }
        });
    },
    conllUrl: function(t) {
        var a = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../../pages/index/index?uid=" + a
        });
    },
    delCar: function(t) {
        var a = this, e = t.currentTarget.dataset.id, i = t.currentTarget.dataset.n, s = this.openid;
        1 == i ? app.util.request({
            url: "entry/wxapp/DelCarlist",
            data: {
                oid: e,
                openid: s,
                mum: i
            },
            cachetime: 0,
            success: function(t) {
                wx.showToast({
                    title: "移除成功",
                    icon: "success",
                    duration: 1e3
                }), setTimeout(function() {
                    a.loadingColl();
                }, 1e3);
            }
        }) : 2 == i && app.util.request({
            url: "entry/wxapp/DelCarlist",
            data: {
                rid: e,
                openid: s,
                mum: i
            },
            cachetime: 0,
            success: function(t) {
                wx.showToast({
                    title: "移除成功",
                    icon: "success",
                    duration: 1e3
                }), setTimeout(function() {
                    a.getCdrList();
                }, 1e3);
            }
        });
    },
    lookCar: function(t) {
        var a = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "../../pages/coll_zv/coll_zv?uid=" + a
        });
    },
    menuTap: function(t) {
        var a = t.currentTarget.dataset.current;
        console.log(a)
        this.setData({
            menuTapCurrent: a,
            currentPageNumber: 1
        }), 0 == a ? (this.setData({
            getCdrList: []
        }), this.getCdrList()) : 1 == a && (this.setData({
            CollData: []
        }), this.loadingColl());
    },
    loadingColl: function() {
        var a = this, t = this.openid;
        app.util.request({
            url: "entry/wxapp/GetColl",
            data: {
                openid: t
            },
            cachetime: 0,
            success: function(t) {
              console.log(2)
              console.log(t.data.data)
                0 == t.data.data.length ? a.setData({
                    noMoreData: 3,
                    CollData: t.data.data
                }) : a.setData({
                    CollData: t.data.data
                });
            }
        });
    },
    getCdrList: function() {
        var a = this, t = this.openid;
      console.log(a.data.wxConfig)
        1 == a.data.wxConfig[1].value ? (console.log("--------------------"), app.util.request({
            url: "entry/wxapp/GetCdr",
            data: {
                openid: t,
                s: 0
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data), a.setData({
                    getCdrList: t.data.data
                });
            }
        })) : (console.log("++++++++++++++++++++++"), app.util.request({
            url: "entry/wxapp/GetCdr",
            data: {
                openid: t,
                s: 1
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data), a.setData({
                    getCdrList: t.data.data
                });
            }
        }));
    },
    getDao: function() {
        var s = this;
        s.setData({
            codisplay: !1
        }), wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var a = t.tempFilePaths;
                if (1 == s.data.wxConfig[1].value) {
                    var e = app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=PostCdr&m=api0351_user";
                    wx.uploadFile({
                        url: e,
                        filePath: a[0],
                        name: "files",
                        success: function(t) {
                            var a = JSON.parse(t.data);
                            s.setData({
                                imgUrl: a.data.path
                            }), 1 == a.data.success && app.util.request({
                                url: "entry/wxapp/Cdrsb",
                                data: {
                                    image: a.data.path,
                                    d: 1
                                },
                                cachetime: 0,
                                success: function(t) {
                                    var a = JSON.parse(t.data.data);
                                    if ("ok" == a.msg) {
                                        for (var e = a.data.item_list, i = 0; i < e.length; i++) "姓名" == e[i].item && s.setData({
                                            cdr_1: e[i].itemstring
                                        }), "公司" == e[i].item && s.setData({
                                            cdr_2: e[i].itemstring
                                        }), "职位" == e[i].item && s.setData({
                                            cdr_3: e[i].itemstring
                                        }), "电话" == e[i].item && s.setData({
                                            cdr_4: e[i].itemstring
                                        }), "手机" == e[i].item && s.setData({
                                            cdr_5: e[i].itemstring
                                        }), "邮箱" == e[i].item && s.setData({
                                            cdr_6: e[i].itemstring
                                        }), "微信" == e[i].item && s.setData({
                                            cdr_7: e[i].itemstring
                                        }), s.setData({
                                            codisplay: !0
                                        }), setTimeout(function() {
                                            s.setData({
                                                gocodisplay: "bottom: 35%; opacity: 1; z-index: 999999"
                                            });
                                        }, 100);
                                        s.setData({
                                            codisplay: !0
                                        });
                                    }
                                },
                                complete: function(t) {
                                    console.log(t);
                                }
                            });
                        }
                    });
                } else qiniuUploader.upload(a[0], function(t) {
                    console.log(t), s.setData({
                        imgUrl: t.key
                    }), t.key && app.util.request({
                        url: "entry/wxapp/Cdrsb",
                        data: {
                            image: t.key,
                            d: 2
                        },
                        cachetime: 0,
                        success: function(t) {
                            var a = JSON.parse(t.data.data);
                            if ("ok" == a.msg) {
                                for (var e = a.data.item_list, i = 0; i < e.length; i++) "姓名" == e[i].item && s.setData({
                                    cdr_1: e[i].itemstring
                                }), "公司" == e[i].item && s.setData({
                                    cdr_2: e[i].itemstring
                                }), "职位" == e[i].item && s.setData({
                                    cdr_3: e[i].itemstring
                                }), "电话" == e[i].item && s.setData({
                                    cdr_4: e[i].itemstring
                                }), "手机" == e[i].item && s.setData({
                                    cdr_5: e[i].itemstring
                                }), "邮箱" == e[i].item && s.setData({
                                    cdr_6: e[i].itemstring
                                }), "微信" == e[i].item && s.setData({
                                    cdr_7: e[i].itemstring
                                }), s.setData({
                                    codisplay: !0
                                }), setTimeout(function() {
                                    s.setData({
                                        gocodisplay: "bottom: 35%; opacity: 1; z-index: 999999"
                                    });
                                }, 100);
                                s.setData({
                                    codisplay: !0
                                });
                            }
                        },
                        complete: function(t) {
                            console.log(t);
                        }
                    });
                }, function(t) {
                    console.log("error: " + t);
                }, {
                    region: s.data.wxConfig[2].value,
                    domain: s.data.wxConfig[6].value,
                    uptoken: s.data.upToken
                });
            }
        });
    },
    close_crd: function() {
        var t = this;
        t.setData({
            gocodisplay: "bottom: -35%; opacity: 0; z-index: 999999"
        }), setTimeout(function() {
            t.setData({
                codisplay: !1
            });
        }, 500);
    },
    formSubmit: function(a) {
        var e = this, i = this.openid, t = a.detail.value;
        console.log(t), app.util.request({
            url: "entry/wxapp/AddCdr",
            data: a.detail.value,
            cachetime: 0,
            success: function(t) {
                e.formId(i, a.detail.formId), wx.showModal({
                    title: "操作提示",
                    content: "纸质名片新增成功",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && (e.setData({
                            gocodisplay: "bottom: -35%; opacity: 0; z-index: 999999"
                        }), setTimeout(function() {
                            e.setData({
                                codisplay: !1
                            });
                        }, 500), setTimeout(function() {
                            e.setData({
                                getCdrList: []
                            }), e.getCdrList();
                        }, 600));
                    }
                });
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
    }
});