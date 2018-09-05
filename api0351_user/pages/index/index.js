function _defineProperty(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var app = getApp();

Page({
    data: {
        userInfo: {},
        onHides: !1,
        noMoreData: 0,
        menuTapCurrent: 0,
        okuid: 0,
        latitude: 0,
        longitude: 0,
        sdisplay: 0,
        nulls: 1,
        gzNumber: 0,
        noServ: 0,
        addOpenid: 0,
        addAvatarUrl: 0,
        addNnickName: 0,
        is_login: !1,
        currentNoteLen: 0,
        backgroId: 0,
        userMber: !1
    },
    onLoad: function(t) {
        app.util.footer(this), this.openid = wx.getStorageSync("openid"), this.setData({
            addOpenid: this.openid
        }), null != t.op ? (console.log("----------------0"), this.getUserMore(t.op, 1)) : null != t.uid ? (console.log("----------------1"), 
        this.getUserMore(t.uid, 2)) : this.loadData(), this.openid && this.getGuan(), app.pageConfig(this);
    },
    getGuan: function() {
        var t = this;
        setTimeout(function() {
            t.getGuanzhu(2);
        }, 500), setTimeout(function() {
            t.getGuanzhu(1);
        }, 1e3), setTimeout(function() {
            t.getGuanzhu(2);
        }, 1500);
    },
    loadData: function() {
        var t = this;
        if (this.openid) {
            if (console.log("执行了 that.getUserMore(this.openid, 1)"), this.openid) {
                var e = wx.getStorageSync("userInfo");
                t.setData({
                    nulls: 1,
                    userInfo: e.wxInfo
                });
            }
            t.getUserMore(this.openid, 1);
        } else console.log("index -- 0 --"), t.setData({
            is_login: !0
        }), setTimeout(function() {
            t.setData({
                gologin: "bottom: 45%; opacity: 1; z-index: 999999"
            });
        }, 100);
    },
    onShow: function() {
        var e = this;
        1 != e.data.is_login && setTimeout(function() {
            var t = e.data.userInfo;
            e.backgro(t);
        }, 500);
    },
    backgro: function(t) {
        var e = this;
        0 == e.data.userMber ? e.setData({
            backgroId: 1
        }) : app.util.request({
            url: "entry/wxapp/GetBack",
            data: {
                openid: t.openid
            },
            cachetime: 0,
            showLoading: !1,
            success: function(t) {
                null != t.data.data.backgro && e.setData({
                    backgroId: t.data.data.backgro
                });
            }
        });
    },
    updateUserInfo: function(t) {
        var e = this;
        "getUserInfo:ok" != t.detail.errMsg ? wx.showModal({
            title: "温馨提示",
            content: "你拒绝了授权登录,为了更好的为你提供服务,请重新进行登录",
            showCancel: !1,
            success: function(t) {
                t.confirm && (e.setData({
                    is_login: !0
                }), setTimeout(function() {
                    e.setData({
                        gologin: "bottom: 45%; opacity: 1; z-index: 999999"
                    });
                }, 100));
            }
        }) : app.login(function(t) {
            console.log(t), e.setData({
                userInfo: t
            }), t.wxInfo.nickName && wx.setNavigationBarTitle({
                title: t.wxInfo.nickName
            }), e.pullDown(t.openid), e.backgro(t);
        });
    },
    pullDown: function(t) {
        this.onLoad("op=" + t), this.setData({
            is_login: !1
        });
    },
    userInfo: function() {
        var t = wx.getStorageSync("userInfo");
        this.setData({
            userInfo: t.wxInfo
        });
    },
    getUserMore: function(e, t) {
        console.log("index - getUserMore: openid:" + e), console.log("index - getUserMore: n:" + t);
        var a = this, o = a.data.userInfo;
        1 == t ? app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                openid: e,
                mod: t,
                avatarUrl: o.avatarUrl,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                a.getDataImg(e), null == t.data.data.nickName ? (console.log("没有OP - getUserMore ----- 1"), 
                a.setData({
                    userMber: !1
                }), a.userInfo(), wx.setNavigationBarTitle({
                    title: "尚未完善信息"
                })) : (console.log("没有OP - getUserMore ----- 2"), 0 != t.data.data && (a.setData({
                    userInfo: t.data.data,
                    latitude: t.data.data.latitude,
                    longitude: t.data.data.longitude,
                    address: t.data.data.address,
                    nulls: 1,
                    userMber: !0
                }), null == t.data.data.nickName ? wx.setNavigationBarTitle({
                    title: "尚未创建信息"
                }) : wx.setNavigationBarTitle({
                    title: t.data.data.nickName + "的名片"
                })));
            }
        }) : 2 == t && (console.log("请求有UID信息2"), app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                uid: e,
                mod: t,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data.openid), a.getDataImg(t.data.data.openid), 0 != t.data.data && (a.setData({
                    userInfo: t.data.data,
                    latitude: t.data.data.latitude,
                    longitude: t.data.data.longitude,
                    userMber: !0
                }), null == t.data.data.nickName ? wx.setNavigationBarTitle({
                    title: "尚未完善信息"
                }) : wx.setNavigationBarTitle({
                    title: t.data.data.nickName + " 的个人名片"
                }));
            }
        }));
    },
    getDataImg: function(t) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/GetImg",
            data: {
                openid: t
            },
            cachetime: 0,
            success: function(t) {
                0 != t.data.data.length && e.setData({
                    upload_picture_list: t.data.data
                });
            }
        });
    },
    previewImage: function(t) {
        t.target.dataset.src;
        for (var e = t.currentTarget.dataset.index, a = [], o = Object.keys(this.data.upload_picture_list), n = 0; n < o.length; n++) a.push(this.data.upload_picture_list[n].imgUrl);
        wx.previewImage({
            current: a[e],
            urls: a
        });
    },
    menuTap: function(t) {
        var e = t.currentTarget.dataset.current;
        1 == e && (this.setData({
            service_list: []
        }), this.getService()), this.setData({
            menuTapCurrent: e
        });
    },
    getService: function() {
        var e = this, t = e.data.userInfo.openid;
        app.util.request({
            url: "entry/wxapp/GetShop",
            data: {
                openid: t,
                lmit: 4
            },
            cachetime: 30,
            success: function(t) {
                "null" != t.data.data && (0 == t.data.data.length ? e.setData({
                    service_list: 0,
                    noServ: 1
                }) : e.setData({
                    service_list: t.data.data,
                    noServ: 2
                }));
            }
        });
    },
    goUser: function() {
        wx.redirectTo({
            url: "../user/user"
        });
    },
    loginUser: function(t, e, a) {
        var o = this;
        if (0 == o.data.userMber) return wx.showModal({
            title: "提示",
            content: "请先完善个人基本信息",
            showCancel: !1
        }), !1;
        var n = wx.getStorageSync("userInfo");
        if (null == n.openid) o.setData({
            is_login: !0
        }), setTimeout(function() {
            o.setData({
                gologin: "bottom: 45%; opacity: 1; z-index: 999999"
            });
        }, 100); else {
            var i = o.data.userInfo.openid, s = n.openid;
            if (s == i || 0 == s) wx.showToast({
                title: "自身无效!",
                icon: "loading",
                duration: 1e3
            }); else if (1 == t) setTimeout(function() {
                o.setData({
                    goreply: "bottom: 45%; opacity: 1; z-index: 999999",
                    addOpenid: n.openid,
                    addAvatarUrl: n.wxInfo.avatarUrl,
                    addNnickName: n.wxInfo.nickName
                });
            }, 100), o.setData({
                is_Reply: !0
            }); else if (2 == t) setTimeout(function() {
                o.setData({
                    goreply: "bottom: 45%; opacity: 1; z-index: 999999"
                });
            }, 100), o.setData({
                is_Report: !0
            }); else if (3 == t) {
                var r = this.data.userInfo.id;
                i = n.openid;
                o.Colle(r, i);
            } else if (4 == t) {
                if (null == n.wxInfo.avatarUrl) ; else n.wxInfo.avatarUrl;
                "" == e.content ? wx.showToast({
                    title: "没说的吗",
                    icon: "loading",
                    duration: 1500
                }) : app.util.request({
                    url: "entry/wxapp/AddMsn",
                    data: {
                        uid: o.data.userInfo.id,
                        content: e.content,
                        nickname: n.wxInfo.nickName,
                        avatar: n.wxInfo.avatarUrl,
                        openid: n.openid,
                        op: o.data.userInfo.openid,
                        m: "api0351_user"
                    },
                    cachetime: 0,
                    success: function(t) {
                        o.formId(n.openid, a), wx.showToast({
                            title: "提交成功",
                            icon: "success",
                            duration: 1500
                        }), o.setData({
                            content: "",
                            currentNoteLen: 0
                        });
                    }
                });
            }
        }
    },
    getGuanzhu: function(t) {
        var e = this, a = wx.getStorageSync("userInfo");
        if (a) {
            var o = a.wxInfo.avatarUrl, n = a.openid;
            null != n ? 1 == t ? app.util.request({
                url: "entry/wxapp/PostGz",
                data: {
                    avatar: o,
                    openid: n,
                    uid: e.data.userInfo.id,
                    cid: 1,
                    m: "api0351_user"
                },
                cachetime: 0,
                showLoading: !1,
                success: function(t) {}
            }) : 2 == t && app.util.request({
                url: "entry/wxapp/PostGz",
                data: {
                    uid: e.data.userInfo.id,
                    cid: 2,
                    m: "api0351_user"
                },
                cachetime: 0,
                showLoading: !1,
                success: function(t) {
                    t.data.data.length;
                    e.setData({
                        gzNumber: t.data.message.length
                    });
                }
            }) : app.util.request({
                url: "entry/wxapp/PostGz",
                data: {
                    uid: e.data.userInfo.id,
                    cid: 2,
                    m: "api0351_user"
                },
                cachetime: 0,
                showLoading: !1,
                success: function(t) {
                    t.data.data.length;
                    e.setData({
                        gzNumber: t.data.message.length
                    });
                }
            });
        } else e.setData({
            is_login: !0
        }), setTimeout(function() {
            e.setData({
                gologin: "bottom: 45%; opacity: 1; z-index: 999999"
            });
        }, 100);
    },
    close_login: function() {
        var t = this;
        t.setData({
            gologin: "bottom: -45%; opacity: 0; z-index: 999999"
        }), setTimeout(function() {
            t.setData({
                is_login: !1
            });
        }, 500);
    },
    Reward: function() {
        if (0 == this.data.userMber) return wx.showModal({
            title: "提示",
            content: "请先完善个人基本信息",
            showCancel: !1
        }), !1;
        wx.navigateTo({
            url: "../reward/reward?op=" + this.data.userInfo.openid
        });
    },
    replyComm: function(t) {
        this.loginUser(1, 0, 0);
    },
    close_bind: function() {
        var t = this;
        t.setData({
            goreply: "bottom: -45%; opacity: 0; z-index: 999999"
        }), setTimeout(function() {
            t.setData({
                is_Reply: !1,
                currentNoteLen: 0
            });
        }, 500);
    },
    Collection: function(t) {
        this.loginUser(3, 0, 0);
    },
    Colle: function(e, a) {
        app.util.request({
            url: "entry/wxapp/GetUser",
            data: {
                openid: a,
                mod: 1,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                null != t.data.data.id ? null == t.data.data.nickName ? wx.showModal({
                    title: "提示",
                    content: "请先完善自己的基本信息",
                    showCancel: !0,
                    success: function(t) {
                        1 == t.confirm && wx.navigateTo({
                            url: "../user/user"
                        });
                    }
                }) : app.util.request({
                    url: "entry/wxapp/Collection",
                    data: {
                        tid: t.data.data.id,
                        uid: e,
                        openid: a
                    },
                    cachetime: 0,
                    success: function(t) {
                        0 == t.data.data ? wx.showToast({
                            title: t.data.message,
                            icon: "loading",
                            duration: 1e3
                        }) : wx.showToast({
                            title: t.data.message,
                            icon: "success",
                            duration: 1e3
                        });
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: "请先创建自己的名片",
                    showCancel: !0,
                    success: function(t) {
                        1 == t.confirm && wx.navigateTo({
                            url: "../user/user"
                        });
                    }
                });
            }
        });
    },
    bindWordLimit: function(t) {
        var e = t.detail.value, a = parseInt(e.length);
        a > this.data.noteMaxLen || this.setData({
            currentNoteLen: a
        });
    },
    formSubmit: function(t) {
        var e = t.detail.value, a = t.detail.formId;
        this.loginUser(4, e, a);
    },
    formReport: function(e) {
      var a = this, o = wx.getStorageSync("userInfo");
        "" != e.detail.value.content ? app.util.request({
            url: "entry/wxapp/PostReport",
            data: e.detail.value,
            cachetime: 0,
            success: function(t) {
                a.formId(o.openid, e.detail.formId), 1 == t.data.data && (wx.showToast({
                    title: "举报成功",
                    icon: "success",
                    duration: 1200
                }), a.close_report());
            }
        }) : wx.showToast({
            title: "说点什么?",
            icon: "loading",
            duration: 1200
        });
    },
    formReply: function(e) {
      var a = this, o = wx.getStorageSync("userInfo");
        "" != e.detail.value.content ? app.util.request({
            url: "entry/wxapp/Message",
            data: e.detail.value,
            cachetime: 0,
            success: function(t) {
                a.formId(o.openid, e.detail.formId), 1 == t.data.data && (wx.showToast({
                    title: "发送成功",
                    icon: "success",
                    duration: 1200
                }), a.close_bind());
            }
        }) : wx.showToast({
            title: "说点什么?",
            icon: "loading",
            duration: 1200
        });
    },
    Report: function(t) {
        this.loginUser(2, 0, 0);
    },
    close_report: function() {
        var t = this;
        t.setData({
            goreply: "bottom: -45%; opacity: 0; z-index: 999999"
        }), setTimeout(function() {
            t.setData({
                is_Report: !1,
                currentNoteLen: 0
            });
        }, 500);
    },
    formId: function(t, e) {
        app.util.request({
            url: "entry/wxapp/formId",
            data: {
                openid: t,
                formid: e
            },
            cachetime: 0,
            success: function(t) {
                console.log(t);
            }
        });
    },
    addHotNum: function() {
        var t = this.data.userInfo.openid;
        app.util.request({
            url: "entry/wxapp/AddShang",
            data: {
                openid: t,
                hotnum: 1
            },
            cachetime: 60,
            success: function(t) {
                console.log(t);
            }
        });
    },
    getMaps: function() {
        var t = Number(this.data.latitude), e = Number(this.data.longitude), a = this.data.userInfo.user_gs;
      console.log(this.data)
        wx.openLocation({
            latitude: t,
            longitude: e,
            name: this.data.address,
            scale: 16
        });
    },
    copyWx: function(t) {
        wx.setClipboardData({
            data: t.currentTarget.dataset.wx,
            success: function(t) {}
        });
    },
    addPhoto: function(t) {
        if (0 == this.data.userMber) return wx.showModal({
            title: "提示",
            content: "请先完善个人基本信息",
            showCancel: !1
        }), !1;
        wx.addPhoneContact(_defineProperty({
            firstName: t.detail.value.firstName,
            title: t.detail.value.title,
            weChatNumber: t.detail.value.weChatNumber,
            mobilePhoneNumber: t.detail.value.mobilePhoneNumber,
            remark: t.detail.value.remark,
            organization: t.detail.value.organization
        }, "weChatNumber", t.detail.value.weChatNumber));
    },
    callPhoto: function(t) {
        wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.mobile
        });
    },
    navMenu: function() {
        if (0 == this.data.userMber) return wx.showModal({
            title: "提示",
            content: "请先完善个人基本信息",
            showCancel: !1
        }), !1;
        console.log(this.data.userInfo), wx.navigateTo({
            url: "../share/share?uid=" + this.data.userInfo.id
        });
    },
    collUrl: function() {
        if (0 == this.data.userMber) return wx.showModal({
            title: "提示",
            content: "请先完善个人基本信息",
            showCancel: !1
        }), !1;
        wx.navigateTo({
            url: "../collection/collection?op=" + this.data.userInfo.openid
        });
    },
    BackGro: function() {
        if (0 == this.data.userMber) return wx.showModal({
            title: "提示",
            content: "请先完善个人基本信息",
            showCancel: !1
        }), !1;
        wx.navigateTo({
            url: "../backgro/backgro?op=" + this.data.userInfo.openid
        });
    },
    serviceUrl: function() {
        var t = this.data.userInfo.openid;
        wx.navigateTo({
            url: "../serlist/serlist?op=" + t
        });
    },
    onShareAppMessage: function(t) {
        return {
            title: "您好，请惠存",
            path: "/api0351_user/pages/index/index?uid=" + this.data.userInfo.id,
            success: function(t) {
                console.log("--------------------------------");
            }
        };
    },

  close_crd: function () {
    var t = this;
    t.setData({
      gocodisplay: "bottom: -35%; opacity: 0; z-index: 999999"
    }), setTimeout(function () {
      t.setData({
        codisplay: !1
      });
    }, 500);
  },
  formSubmit: function (a) {
    var e = this, i = this.openid, t = a.detail.value;
    console.log(i)
    
    console.log(t), app.util.request({
      url: "entry/wxapp/AddCdr",
      data: a.detail.value,
      cachetime: 0,
      success: function (t) {
        e.formId(i, a.detail.formId), wx.showModal({
          title: "操作提示",
          content: "纸质名片新增成功",
          showCancel: !1,
          success: function (t) {
            t.confirm && (e.setData({
              gocodisplay: "bottom: -35%; opacity: 0; z-index: 999999"
            }), setTimeout(function () {
              e.setData({
                codisplay: !1
              });
            }, 500), setTimeout(function () {
              wx.redirectTo({
                url: '../collection/collection?menuTap=cdr',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            }, 600));
          }
        });
      }
    });
  },  

  getDao: function () {
    var s = this;
    s.setData({
      codisplay: !1
    }), wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (t) {
        var a = t.tempFilePaths;
        if (1 == s.data.wxConfig[1].value) {
          var e = app.siteInfo.siteroot + "?i=" + app.siteInfo.uniacid + "&c=entry&a=wxapp&do=PostCdr&m=api0351_user";
          wx.uploadFile({
            url: e,
            filePath: a[0],
            name: "files",
            success: function (t) {
              var a = JSON.parse(t.data);
              s.setData({
                imgUrl: a.data.path,
                openid: wx.getStorageSync("openid"),
              }), 1 == a.data.success && app.util.request({
                url: "entry/wxapp/Cdrsb",
                data: {
                  image: a.data.path,
                  d: 1
                },
                cachetime: 0,
                success: function (t) {
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
                    }), setTimeout(function () {
                      s.setData({
                        gocodisplay: "bottom: 35%; opacity: 1; z-index: 999999"
                      });
                    }, 100);
                    s.setData({
                      codisplay: !0
                    });
                  }
                },
                complete: function (t) {
                  console.log(t);
                }
              });
            }
          });
        } else qiniuUploader.upload(a[0], function (t) {
          console.log(t), s.setData({
            imgUrl: t.key,
            openid: wx.getStorageSync("openid"),
          }), t.key && app.util.request({
            url: "entry/wxapp/Cdrsb",
            data: {
              image: t.key,
              d: 2
            },
            cachetime: 0,
            success: function (t) {
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
                }), setTimeout(function () {
                  s.setData({
                    gocodisplay: "bottom: 35%; opacity: 1; z-index: 999999"
                  });
                }, 100);
                s.setData({
                  codisplay: !0
                });
              }
            },
            complete: function (t) {
              console.log(t);
            }
          });
        }, function (t) {
          console.log("error: " + t);
        }, {
            region: s.data.wxConfig[2].value,
            domain: s.data.wxConfig[6].value,
            uptoken: s.data.upToken
          });
      }
    });
  },
});