var app = getApp();

Page({
    data: {
        noServ: 0,
        latitude: 0,
        longitude: 0,
        markers: []
    },
    onLoad: function(a) {
        this.getShop(a.id);
    },
    serviceUrl: function(a) {
        var t = a.currentTarget.dataset.op;
        wx.navigateTo({
            url: "../serlist/serlist?op=" + t
        });
    },
    getShop: function(a) {
        var d = this;
        app.util.request({
            url: "entry/wxapp/ShopList",
            data: {
                did: a,
                s: 2,
                m: "api0351_user"
            },
            cachetime: 0,
            success: function(a) {
                console.log(a.data);
                var t = [], e = {
                    maps: a.data.data
                };
                for (var i in console.log(e), e) e[i].latitude = a.data.data.y, e[i].longitude = a.data.data.x, 
                e[i].name = a.data.data.dtitle, t.push(e[i]);
                d.setData({
                    shop: a.data.data,
                    latitude: a.data.data.y,
                    longitude: a.data.data.x,
                    markers: t
                }), wx.setNavigationBarTitle({
                    title: a.data.data.dtitle
                }), d.getService(a.data.data.openid);
            }
        });
    },
    getService: function(a) {
        var t = this;
        app.util.request({
            url: "entry/wxapp/GetShop",
            data: {
                openid: a,
                k: 2
            },
            cachetime: 30,
            success: function(a) {
                console.log(a.data.data), "null" != a.data.data && (0 == a.data.data.length ? t.setData({
                    service_list: 0,
                    noServ: 1
                }) : t.setData({
                    service_list: a.data.data,
                    noServ: 2
                }));
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.shop.dtitle,
            path: "/api0351_user/pages/shopView/shopView?id=" + this.data.shop.did
        };
    }
});