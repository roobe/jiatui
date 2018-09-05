var app = getApp();

Page({
    data: {
        isChecked: !0,
        isChecksd: !1,
        mNumber: 0,
        zuNum: 1,
        shoPay: 0,
        mapGps: "尚未标注位置",
        deng: 0,
        mxNumber: 0,
        service: 0,
        location: {
            longitude: 0,
            latitude: 0
        },
        Minimum: 0
    },
    onLoad: function(t) {
        this.openid = wx.getStorageSync("openid");
        var a = wx.getStorageSync("userInfo");
        this.setData({
            avatarUrl: a.wxInfo.avatarUrl,
            nickName: a.wxInfo.nickName,
            openid: this.openid
        }), t.payNum ? (console.log("1"), this.setData({
            payDis: !0,
            payNum: t.payNum,
            pay: t.pay
        }), this.getShopOnline(t.op)) : (console.log("2"), this.getNum(), this.getShopOnline(this.openid), 
        this.setData({
            payDis: !1
        }));
    },
    getShopOnline: function(t) {
        var a = this;
        app.util.request({
            url: "entry/wxapp/ShopOnline",
            data: {
                openid: t,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                console.log(t.data.data), a.setData({
                    userBye: t.data.data
                });
            }
        });
    },
    formSubmit: function(t) {
        var e = this, n = (e.data.service, this.openid), a = e.data.location.longitude, i = e.data.location.latitude, o = e.data.avatarUrl, s = e.data.nickName, c = e.data.Minimum;
        Number(t.detail.value.miNum) < c ? wx.showModal({
            title: "提示",
            content: "平米数必须大于" + c + "㎡",
            showCancel: !1
        }) : "" == t.detail.value.miNum ? wx.showModal({
            title: "提示",
            content: "平米数不能为空",
            showCancel: !1
        }) : "" == t.detail.value.title ? wx.showModal({
            title: "提示",
            content: "店铺名称不能为空",
            showCancel: !1
        }) : "" == t.detail.value.content ? wx.showModal({
            title: "提示",
            content: "店铺用途说明不能为空",
            showCancel: !1
        }) : 0 == i ? wx.showModal({
            title: "提示",
            content: "尚未标注店铺坐标",
            showCancel: !1
        }) : app.util.request({
            url: "entry/wxapp/Shop",
            data: {
                dtitle: t.detail.value.title,
                dnumber: t.detail.value.miNum,
                x: a,
                y: i,
                openid: n,
                avatar: o,
                nickname: s,
                seid: e.data.service,
                dmoney: e.data.deng,
                dcontent: t.detail.value.content,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                if (null == e.data.userBye.pay) var a = 0; else a = e.data.userBye.pay;
                0 == a ? wx.showModal({
                    title: "下一步",
                    content: "确认信息并支付租金",
                    showCancel: !1,
                    success: function(t) {
                        wx.redirectTo({
                            url: "../shop/shop?payNum=" + e.data.deng + "&pay=" + a + "&op=" + n
                        });
                    }
                }) : 1 == a && wx.showModal({
                    title: "提示",
                    content: "信息提交并进入审核状态",
                    showCancel: !1,
                    success: function(t) {
                        e.onLoad({
                            op: e.openid
                        });
                    }
                });
            }
        });
    },
    diushi: function(t) {
        this.setData({
            isChecksd: !1,
            isChecked: !0,
            service: t.target.dataset.id
        });
    },
    jiandao: function(t) {
        this.setData({
            isChecked: !1,
            isChecksd: !0,
            service: t.target.dataset.id
        });
    },
    InputEvent: function(t) {
        var a = this.data.shoPay, e = this.data.mNumber, n = e - t.detail.value, i = t.detail.value * a, o = this.data.Minimum;
        "" != t.detail.value ? n < 0 ? wx.showModal({
            title: "提示",
            content: "貌似没有那么多地啊",
            showCancel: !1
        }) : 0 == n ? wx.showModal({
            title: "提示",
            content: "超出规划面积大小,减少平米数试试",
            showCancel: !1
        }) : Number(t.detail.value) < o ? wx.showModal({
            title: "提示",
            content: "最少购入平米数得" + o + "㎡",
            showCancel: !1
        }) : this.setData({
            deng: i.toFixed(2),
            mxNumber: n
        }) : this.setData({
            deng: i.toFixed(2),
            mxNumber: e
        });
    },
    getNum: function() {
        var a = this;
        app.util.request({
            url: "entry/wxapp/ShopNum",
            data: {
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                null != t.data.data[0].num ? (a.setData({
                    smNumber: t.data.data[0].num
                }), a.getFooter(t.data.data[0].num)) : (a.setData({
                    smNumber: 0
                }), a.getFooter(0));
            }
        });
    },
    getFooter: function(a) {
        var e = this;
        app.util.request({
            url: "entry/wxapp/Footer",
            data: {
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                e.setData({
                    mNumber: t.data.data.mNumber - a,
                    zuNum: t.data.data.zuNum,
                    shoPay: t.data.data.shoPay,
                    Currency: t.data.data.Currency,
                    Minimum: t.data.data.Minimum
                });
            }
        });
    },
    chooseLocation: function(t) {
        var a = this;
        wx.chooseLocation({
            success: function(t) {
                a.setData({
                    mapGps: "标注成功",
                    location: {
                        longitude: t.longitude,
                        latitude: t.latitude
                    }
                });
            },
            complete: function() {}
        });
    },
    pay: function(t) {
        var a = this, e = Math.random(), n = t.currentTarget.dataset.pay, i = a.data.nickName, o = Number(t.currentTarget.dataset.num);
        console.log(n), 1 == n ? wx.showModal({
            title: "提示",
            content: "请勿重复支付",
            showCancel: !1,
            success: function(t) {}
        }) : app.util.request({
            url: "entry/wxapp/pay",
            data: {
                orderid: e,
                openid: a.openid,
                username: i,
                shopNum: 1,
                price: o
            },
            cachetime: "0",
            success: function(t) {
                console.log(t.data), t.data && t.data.data && !t.data.errno && wx.requestPayment({
                    timeStamp: t.data.data.timeStamp,
                    nonceStr: t.data.data.nonceStr,
                    package: t.data.data.package,
                    signType: "MD5",
                    paySign: t.data.data.paySign,
                    success: function(t) {
                        "requestPayment:ok" == t.errMsg && wx.showModal({
                            title: "提示",
                            content: "支付成功，确认跳转",
                            showCancel: !1,
                            success: function(t) {
                                wx.redirectTo({
                                    url: "../user/user"
                                });
                            }
                        });
                    },
                    fail: function() {
                        wx.showModal({
                            title: "提示",
                            content: "确定要放弃支付吗？",
                            cancel: !1,
                            success: function(t) {
                                1 != t.cancel && 0 != t.cancel || a.delDisplay(a.openid);
                            }
                        });
                    }
                });
            },
            fail: function(t) {
                wx.showModal({
                    title: "系统提示",
                    content: t.data.message ? t.data.message : "错误",
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                });
            }
        });
    },
    delDisplay: function(t) {
        app.util.request({
            url: "entry/wxapp/delDisplay",
            data: {
                openid: t
            },
            cachetime: 0,
            success: function(t) {
                wx.redirectTo({
                    url: "../user/user"
                });
            }
        });
    }
});