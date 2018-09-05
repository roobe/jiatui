var app = getApp();

Page({
    data: {
        conmment_list: [],
        uid: 0,
        loadingMore: !1,
        noMoreData: 1,
        currentPageNumber: 1,
        is_Reply: !1,
        reply_id: 0,
        currentNoteLen: 0
    },
    onLoad: function(t) {
        this.uid = t.op, this.openid = wx.getStorageSync("openid");
    },
    onShow: function() {
        var e = this;
        this.pullUpLoad(), wx.getSystemInfo({
            success: function(t) {
                e.setData({
                    windowHeight: t.windowHeight,
                    windowWidth: t.windowWidth
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
    pullUpLoad: function() {
        var o = this;
        this.setData({
            loadingMore: !0
        }), wx.showNavigationBarLoading(), app.util.request({
            url: "entry/wxapp/EdGetMsn",
            data: {
                page: o.data.currentPageNumber,
                op: o.uid,
                m: "api0351_user"
            },
            cachetime: 30,
            success: function(t) {
                var e = t.data.data, a = t.data.message;
                0 == a ? o.setData({
                    noMoreData: 3
                }) : (o.setData({
                    conmment_list: o.data.conmment_list.concat(e)
                }), o.data.conmment_list.length == a && o.setData({
                    noMoreData: 2
                }));
            },
            complete: function() {
                o.setData({
                    loadingMore: !1
                }), wx.hideNavigationBarLoading();
            }
        });
    },
    replyComm: function(t) {
        var e = this;
        setTimeout(function() {
            e.setData({
                goreply: "bottom: 45%; opacity: 1; z-index: 999999"
            });
        }, 100), e.setData({
            is_Reply: !0,
            reply_id: t.currentTarget.dataset.id
        });
    },
    close_bind: function() {
        var t = this;
        setTimeout(function() {
            t.setData({
                goreply: "bottom: -45%; opacity: 0; z-index: 999999"
            });
        }, 300), t.setData({
            is_Reply: !1
        });
    },
    formReply: function(e) {
        var a = this, t = a.data.reply_id, o = this.openid;
        "" != e.detail.value.r_content ? app.util.request({
            url: "entry/wxapp/ReplyMsn",
            data: {
                r_content: e.detail.value.r_content,
                mid: t,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                a.formId(o, e.detail.formId), wx.showToast({
                    title: "回复成功",
                    icon: "success",
                    duration: 1500
                }), a.setData({
                    r_content: "",
                    is_Reply: !1,
                    currentNoteLen: 0
                }), setTimeout(function() {
                    a.getDataRefresh();
                }, 1500);
            }
        }) : wx.showToast({
            title: "没写内容",
            icon: "loading",
            duration: 1500
        });
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
    getDataRefresh: function() {
        var a = this;
        this.setData({
            loadingMore: !0
        }), app.util.request({
            url: "entry/wxapp/EdGetMsn",
            data: {
                page: 1,
                op: this.uid,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                var e = t.data.data;
                a.setData({
                    conmment_list: e,
                    noMoreData: 1,
                    currentPageNumber: 1
                }), a.getMore();
            }
        });
    },
    getMore: function() {
        2 != this.data.noMoreData && (this.setData({
            currentPageNumber: this.data.currentPageNumber + 1
        }), this.pullUpLoad());
    },
    goTop: function(t) {
        this.setData({
            scroll_Top: -Math.random()
        });
    },
    scroll: function(t) {
        this.data.windowHeight < t.detail.scrollTop ? this.setData({
            goTopId: "bottom: 15%; opacity: 1;"
        }) : this.setData({
            goTopId: "bottom: -15%; opacity: 0;"
        });
    },
    delMes: function(t) {
        var e = this, a = t.currentTarget.dataset.id;
        app.util.request({
            url: "entry/wxapp/DelMsn",
            data: {
                mid: a,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(t) {
                wx.showToast({
                    title: "删除成功",
                    icon: "success",
                    duration: 1500
                }), setTimeout(function() {
                    e.getDataRefresh();
                }, 1500);
            }
        });
    }
});