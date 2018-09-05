var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

!function(t, e) {
    "object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.WeCropper = e();
}(void 0, function() {
    var o = void 0, e = [ "touchstarted", "touchmoved", "touchended" ];
    function i(o) {
        for (var n = [], t = arguments.length - 1; 0 < t--; ) n[t] = arguments[t + 1];
        e.forEach(function(t, e) {
            void 0 !== n[e] && (o[t] = n[e]);
        });
    }
    function h(t) {
        return "function" == typeof t;
    }
    var n = {}, c = {
        id: {
            default: "cropper",
            get: function() {
                return n.id;
            },
            set: function(t) {
                "string" != typeof t && console.error("id：" + t + " is invalid"), n.id = t;
            }
        },
        width: {
            default: 750,
            get: function() {
                return n.width;
            },
            set: function(t) {
                "number" != typeof t && console.error("width：" + t + " is invalid"), n.width = t;
            }
        },
        height: {
            default: 750,
            get: function() {
                return n.height;
            },
            set: function(t) {
                "number" != typeof t && console.error("height：" + t + " is invalid"), n.height = t;
            }
        },
        scale: {
            default: 2.5,
            get: function() {
                return n.scale;
            },
            set: function(t) {
                "number" != typeof t && console.error("scale：" + t + " is invalid"), n.scale = t;
            }
        },
        zoom: {
            default: 5,
            get: function() {
                return n.zoom;
            },
            set: function(t) {
                "number" != typeof t ? console.error("zoom：" + t + " is invalid") : (t < 0 || 10 < t) && console.error("zoom should be ranged in 0 ~ 10"), 
                n.zoom = t;
            }
        },
        src: {
            default: "cropper",
            get: function() {
                return n.src;
            },
            set: function(t) {
                "string" != typeof t && console.error("id：" + t + " is invalid"), n.src = t;
            }
        },
        cut: {
            default: {},
            get: function() {
                return n.cut;
            },
            set: function(t) {
                "object" !== (void 0 === t ? "undefined" : _typeof(t)) && console.error("id：" + t + " is invalid"), 
                n.cut = t;
            }
        },
        onReady: {
            default: null,
            get: function() {
                return n.ready;
            },
            set: function(t) {
                n.ready = t;
            }
        },
        onBeforeImageLoad: {
            default: null,
            get: function() {
                return n.beforeImageLoad;
            },
            set: function(t) {
                n.beforeImageLoad = t;
            }
        },
        onImageLoad: {
            default: null,
            get: function() {
                return n.imageLoad;
            },
            set: function(t) {
                n.imageLoad = t;
            }
        },
        onBeforeDraw: {
            default: null,
            get: function() {
                return n.beforeDraw;
            },
            set: function(t) {
                n.beforeDraw = t;
            }
        }
    };
    var t = {
        touchStart: function(t) {
            var e = t.touches, o = e[0], n = e[1];
            i(this, !0, null, null), this.__oneTouchStart(o), 2 <= t.touches.length && this.__twoTouchStart(o, n);
        },
        touchMove: function(t) {
            var e = t.touches, o = e[0], n = e[1];
            i(this, null, !0), 1 === t.touches.length && this.__oneTouchMove(o), 2 <= t.touches.length && this.__twoTouchMove(o, n);
        },
        touchEnd: function(t) {
            i(this, !1, !1, !0), this.__xtouchEnd();
        }
    };
    var r = function(t) {
        var e, o, n = this, i = {};
        return e = n, o = c, Object.defineProperties(e, o), Object.keys(c).forEach(function(t) {
            i[t] = c[t].default;
        }), Object.assign(n, i, t), n.prepare(), n.attachPage(), n.createCtx(), n.observer(), 
        n.cutt(), n.methods(), n.init(), n.update(), n;
    };
    return r.prototype.init = function() {
        var t = this, e = t.src;
        return t.version = "1.1.5", "function" == typeof t.onReady && t.onReady(t.ctx, t), 
        e && t.pushOrign(e), i(t, !1, !1, !1), t.oldScale = 1, t.newScale = 1, t;
    }, Object.assign(r.prototype, t), r.prototype.prepare = function() {
        var e = this, t = (o || (o = wx.getSystemInfoSync()), o).windowWidth;
        e.attachPage = function() {
            var t = getCurrentPages();
            t[t.length - 1].wecropper = e;
        }, e.createCtx = function() {
            var t = e.id;
            t ? e.ctx = wx.createCanvasContext(t) : console.error("constructor: create canvas context failed, 'id' must be valuable");
        }, e.deviceRadio = t / 750;
    }, r.prototype.observer = function() {
        var n = this, i = [ "ready", "beforeImageLoad", "beforeDraw", "imageLoad" ];
        n.on = function(t, e) {
            var o;
            return -1 < i.indexOf(t) ? "function" == typeof e && ("ready" === t ? e(n) : n["on" + (o = t, 
            o.charAt(0).toUpperCase() + o.slice(1))] = e) : console.error("event: " + t + " is invalid"), 
            n;
        };
    }, r.prototype.methods = function() {
        var r = this, a = r.deviceRadio, t = r.width, e = r.height, o = r.cut, u = o.x;
        void 0 === u && (u = 0);
        var s = o.y;
        void 0 === s && (s = 0);
        var d = o.width;
        void 0 === d && (d = t);
        var l = o.height;
        void 0 === l && (l = e), r.updateCanvas = function() {
            return r.croperTarget && r.ctx.drawImage(r.croperTarget, r.imgLeft, r.imgTop, r.scaleWidth, r.scaleHeight), 
            h(r.onBeforeDraw) && r.onBeforeDraw(r.ctx, r), r.setBoundStyle(), r.ctx.draw(), 
            r;
        }, r.pushOrign = function(t) {
            return r.src = t, h(r.onBeforeImageLoad) && r.onBeforeImageLoad(r.ctx, r), wx.getImageInfo({
                src: t,
                success: function(t) {
                    var e = t.width / t.height;
                    r.croperTarget = t.path, console.log(u, s), e < d / l ? (r.rectX = u, r.baseWidth = d, 
                    r.baseHeight = d / e, r.rectY = s - Math.abs((l - r.baseHeight) / 2)) : (r.rectY = s, 
                    r.baseWidth = l * e, r.baseHeight = l, r.rectX = u - Math.abs((d - r.baseWidth) / 2)), 
                    r.imgLeft = r.rectX, r.imgTop = r.rectY, r.scaleWidth = r.baseWidth, r.scaleHeight = r.baseHeight, 
                    r.updateCanvas(), h(r.onImageLoad) && r.onImageLoad(r.ctx, r);
                }
            }), r.update(), r;
        }, r.getCropperImage = function() {
            for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
            var o = r.id, n = toString.call(t[0]), i = t[t.length - 1];
            switch (n) {
              case "[object Object]":
                var c = t[0].quality;
                void 0 === c && (c = 10), "number" != typeof c ? console.error("quality：" + c + " is invalid") : (c < 0 || 10 < c) && console.error("quality should be ranged in 0 ~ 10"), 
                wx.canvasToTempFilePath({
                    canvasId: o,
                    x: u,
                    y: s,
                    width: d,
                    height: l,
                    destWidth: d * c / (10 * a),
                    destHeight: l * c / (10 * a),
                    success: function(t) {
                        h(i) && i.call(r, t.tempFilePath);
                    },
                    fail: function(t) {
                        h(i) && i.call(r, null);
                    }
                });
                break;

              case "[object Function]":
                wx.canvasToTempFilePath({
                    canvasId: o,
                    x: u,
                    y: s,
                    width: d,
                    height: l,
                    destWidth: d / a,
                    destHeight: l / a,
                    success: function(t) {
                        h(i) && i.call(r, t.tempFilePath);
                    },
                    fail: function(t) {
                        h(i) && i.call(r, null);
                    }
                });
            }
            return r;
        };
    }, r.prototype.cutt = function() {
        var i = this, c = i.width, r = i.height, t = i.cut, a = t.x;
        void 0 === a && (a = 0);
        var u = t.y;
        void 0 === u && (u = 0);
        var s = t.width;
        void 0 === s && (s = c);
        var d = t.height;
        void 0 === d && (d = r), i.outsideBound = function(t, e) {
            i.imgLeft = a <= t ? a : i.scaleWidth + t - a <= s ? a + s - i.scaleWidth : t, i.imgTop = u <= e ? u : i.scaleHeight + e - u <= d ? u + d - i.scaleHeight : e;
        }, i.setBoundStyle = function(t) {
            void 0 === t && (t = {});
            var e = t.color;
            void 0 === e && (e = "#04b00f");
            var o = t.mask;
            void 0 === o && (o = "rgba(0, 0, 0, 0.3)");
            var n = t.lineWidth;
            void 0 === n && (n = 1), i.ctx.beginPath(), i.ctx.setFillStyle(o), i.ctx.fillRect(0, 0, a, r), 
            i.ctx.fillRect(a, 0, s, u), i.ctx.fillRect(a, u + d, s, r - u - d), i.ctx.fillRect(a + s, 0, c - a - s, r), 
            i.ctx.fill(), i.ctx.beginPath(), i.ctx.setStrokeStyle(e), i.ctx.setLineWidth(n), 
            i.ctx.moveTo(a - n, u + 10 - n), i.ctx.lineTo(a - n, u - n), i.ctx.lineTo(a + 10 - n, u - n), 
            i.ctx.stroke(), i.ctx.beginPath(), i.ctx.setStrokeStyle(e), i.ctx.setLineWidth(n), 
            i.ctx.moveTo(a - n, u + d - 10 + n), i.ctx.lineTo(a - n, u + d + n), i.ctx.lineTo(a + 10 - n, u + d + n), 
            i.ctx.stroke(), i.ctx.beginPath(), i.ctx.setStrokeStyle(e), i.ctx.setLineWidth(n), 
            i.ctx.moveTo(a + s - 10 + n, u - n), i.ctx.lineTo(a + s + n, u - n), i.ctx.lineTo(a + s + n, u + 10 - n), 
            i.ctx.stroke(), i.ctx.beginPath(), i.ctx.setStrokeStyle(e), i.ctx.setLineWidth(n), 
            i.ctx.moveTo(a + s + n, u + d - 10 + n), i.ctx.lineTo(a + s + n, u + d + n), i.ctx.lineTo(a + s - 10 + n, u + d + n), 
            i.ctx.stroke();
        };
    }, r.prototype.update = function() {
        var s = this;
        s.src && (s.__oneTouchStart = function(t) {
            s.touchX0 = t.x, s.touchY0 = t.y;
        }, s.__oneTouchMove = function(t) {
            var e, o;
            if (s.touchended) return s.updateCanvas();
            e = t.x - s.touchX0, o = t.y - s.touchY0;
            var n = s.rectX + e, i = s.rectY + o;
            s.outsideBound(n, i), s.updateCanvas();
        }, s.__twoTouchStart = function(t, e) {
            var o, n, i;
            s.touchX1 = s.rectX + s.scaleWidth / 2, s.touchY1 = s.rectY + s.scaleHeight / 2, 
            o = e.x - t.x, n = e.y - t.y, i = Math.sqrt(o * o + n * n), s.oldDistance = i;
        }, s.__twoTouchMove = function(t, e) {
            var o, n, i, c = s.scale, r = s.zoom;
            o = e.x - t.x, n = e.y - t.y, i = Math.sqrt(o * o + n * n), s.newScale = s.oldScale + .001 * r * (i - s.oldDistance), 
            s.newScale <= 1 && (s.newScale = 1), s.newScale >= c && (s.newScale = c), s.scaleWidth = s.newScale * s.baseWidth, 
            s.scaleHeight = s.newScale * s.baseHeight;
            var a = s.touchX1 - s.scaleWidth / 2, u = s.touchY1 - s.scaleHeight / 2;
            s.outsideBound(a, u), s.updateCanvas();
        }, s.__xtouchEnd = function() {
            s.oldScale = s.newScale, s.rectX = s.imgLeft, s.rectY = s.imgTop;
        });
    }, r;
});