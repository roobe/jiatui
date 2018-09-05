var app = getApp();
var util = require("../../resource/js/util.js");

Page({
    data: {
        hasLocation: !1,
        mapGps: "位置信息尚未获取",
        phoneNumber: 0,
        openid: 0,
        footer: "",
        classMav: [],
        brands: [],
        sid: 0,
        brandindex: 0,
        index: 0,
        sessionKey:''
    },
    onLoad: function(a) {
        this.uid = a.op, this.getData(a.op);
        var t = wx.getStorageSync("footer"), e = wx.getStorageSync("userInfo");
        console.log(e.wxInfo), this.setData({
            openid: a.op,
            footer: t,
            userInfo: e.wxInfo,
          sessionKey: wx.getStorageSync("sessionKey")
        }), this.getClass();
        var n = this;
        setTimeout(function() {
            for (var a = n.data.classMav, t = n.data.brandindex, e = [], o = 0; o < a.length; o++) e.push(a[o].csname);
            n.setData({
                brands: e,
                sid: a[t].id
            });
        }, 1e3);
    },
    bindPickerChange: function(a) {
        var t = this;
        t.setData({
            brandindex: a.detail.value,
            index: a.detail.value
        });
        var e = t.data.classMav, o = t.data.brandindex;
        t.setData({
            sid: e[o].id
        });
    },
    getClass: function() {
        var t = this;
        app.util.request({
            url: "entry/wxapp/GetClass",
            cachetime: 0,
            success: function(a) {
                console.log(a.data.data), t.setData({
                    classMav: a.data.data
                });
            }
        });
    },
    getData: function(a) {
        var o = this;
        wx.showToast({
            title: "加载中",
            icon: "loading",
            duration: 3e3
        }), wx.showNavigationBarLoading(), app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                openid: a,
                mod: 1
            },
            cachetime: 0,
            success: function(a) {
                console.log(a.data.data);
                var t = a.data.data.longitude, e = a.data.data.latitude;
                if (null == a.data.data.longitude && null == a.data.data.latitude) t = "X", e = "Y"; else t = a.data.data.longitude, 
                e = a.data.data.latitude;
                null == a.data.data.cid ? o.setData({
                    userData: a.data.data,
                    location: {
                        longitude: t,
                        latitude: e,
                       name: a.data.data.address
                    }
                }) : (o.setData({
                    userData: a.data.data,
                    sid: a.data.data.cid,
                    index: a.data.data.indes,
                    location: {
                        longitude: t,
                        latitude: e,
                      name: a.data.data.address
                    }
                }), setTimeout(function() {
                    o.setData({
                        brandindex: a.data.data.indes
                    });
                }, 1e3));
            },
            complete: function() {
                wx.hideToast(), wx.hideNavigationBarLoading();
            }
        });
    },
    formSubmit: function(t) {
        var e = this, a = (this.uid, e.data.location.longitude), o = e.data.openid, n = e.data.index, i = t.detail.value;
        console.log(i), 0 == n ? wx.showModal({
            title: "操作提示",
            content: "请先选择所属行业分类",
            showCancel: !1
        }) : "" == i.nickname ? wx.showModal({
            title: "操作提示",
            content: "姓名不能为空",
            showCancel: !1
        }) : "" == i.mobile ? wx.showModal({
            title: "操作提示",
            content: "手机号没有填写",
            showCancel: !1
        }) : "" == i.user_gs ? wx.showModal({
            title: "操作提示",
            content: "没有公司名称可直接填写地址",
            showCancel: !1
        }) : "" == i.user_zc ? wx.showModal({
            title: "操作提示",
            content: "头衔没有填写",
            showCancel: !1
        }) : a ? app.util.request({
            url: "entry/wxapp/AddUser",
            data: t.detail.value,
            cachetime: 0,
            success: function(a) {
                e.formId(o, t.detail.formId), wx.showToast({
                    title: "更新成功",
                    icon: "loading",
                    duration: 1500
                }), wx.showModal({
                    title: "操作提示",
                    content: "基础信息完善成功，即将跳转",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.reLaunch({
                            url: "../index/index"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideToast(), wx.hideNavigationBarLoading();
            }
        }) : wx.showModal({
            content: "坐标位置还没有获取",
            showCancel: !1,
            success: function(a) {}
        });
    },
    formId: function(a, t) {
        app.util.request({
            url: "entry/wxapp/formId",
            data: {
                openid: a,
                formid: t
            },
            cachetime: 0,
            success: function(a) {
                console.log(a);
            }
        });
    },
    getPhoneNumber: function(t) {
      var that = this
      wx.checkSession({
        success:function(res){
          console.log(1)
          app.util.request({
            url: "entry/wxapp/GetMobile",
            data: {
              encryptedData: t.detail.encryptedData,
              iv: t.detail.iv,
              code: wx.getStorageSync("sessionKey")
            },
            cachetime: 0,
            success: function (a) {
              var t = a.data.data.phoneNumber;
              wx.showModal({
                title: "获取成功",
                showCancel: !1,
                content: "您的号码是：" + t,
                success: function (a) {
                  that.setData({
                    phoneNumber: t
                  });
                }
              });
            }
          });
        },
        fail:function(res){
          console.log(2)
          wx.login({
            success: function (o) {
              o.code ? wx.getUserInfo({
                success: function (e) {
                  util.request({
                    url: "entry/wxapp/Login",
                    data: {
                      code: o.code,
                      rawData: e.rawData
                    },
                    cachetime: 30,
                    success: function (e) {
                      console.log(e.data.data.session_key),
                      wx.setStorageSync("openid", e.data.data.openid),
                      wx.setStorageSync("sessionKey", e.data.data.session_key),
                      wx.setStorageSync("userInfo", e.data.data),
                      console.log("app ------------------------------------ 缓存写入成功");
                      app.util.request({
                        url: "entry/wxapp/GetMobile",
                        data: {
                          encryptedData: t.detail.encryptedData,
                          iv: t.detail.iv,
                          code: wx.getStorageSync("sessionKey")
                        },
                        cachetime: 0,
                        success: function (a) {
                          var t = a.data.data.phoneNumber;
                          wx.showModal({
                            title: "获取成功",
                            showCancel: !1,
                            content: "您的号码是：" + t,
                            success: function (a) {
                              that.setData({
                                phoneNumber: t
                              });
                            }
                          });
                        }
                      });


                    }
                  });
                },
                fail: function (e) {
                  console.log("app --- x"), e.showLoginModal(n);
                }
              }) : (console.log("app --- a"), e.showLoginModal(n));
            }
          });

        }
      });
    },
    chooseLocation: function(a) {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
              console.log(a)
                t.setData({
                    hasLocation: !0,
                    mapGps: "位置信息标注成功",
                    location: {
                      longitude: a.longitude,
                      latitude: a.latitude,
                      name: a.name,
                      address: a.address
                    }
                });
            },
            complete: function() {}
        });
    }
});