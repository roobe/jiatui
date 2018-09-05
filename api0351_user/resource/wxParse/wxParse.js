var _showdown = require("./showdown.js"), _showdown2 = _interopRequireDefault(_showdown), _html2json = require("./html2json.js"), _html2json2 = _interopRequireDefault(_html2json);

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var realWindowWidth = 0, realWindowHeight = 0;

function wxParse() {
    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "wxParseData", a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "html", t = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : '<div class="color:red;">数据不能为空</div>', i = arguments[3], r = arguments[4], o = i, n = {};
    if ("html" == a) n = _html2json2.default.html2json(t, e); else if ("md" == a || "markdown" == a) {
        var d = new _showdown2.default.Converter().makeHtml(t);
        n = _html2json2.default.html2json(d, e);
    }
    n.view = {}, void (n.view.imagePadding = 0) !== r && (n.view.imagePadding = r);
    var s = {};
    s[e] = n, o.setData(s), o.wxParseImgLoad = wxParseImgLoad, o.wxParseImgTap = wxParseImgTap;
}

function wxParseImgTap(e) {
    var a = e.target.dataset.src, t = e.target.dataset.from;
    void 0 !== t && 0 < t.length && wx.previewImage({
        current: a,
        urls: this.data[t].imageUrls
    });
}

function wxParseImgLoad(e) {
    var a = e.target.dataset.from, t = e.target.dataset.idx;
    void 0 !== a && 0 < a.length && calMoreImageInfo(e, t, this, a);
}

function calMoreImageInfo(e, a, t, i) {
    var r = t.data[i];
    if (r && 0 != r.images.length) {
        var o = r.images, n = (wxAutoImageCal(e.detail.width, e.detail.height, t, i), o[a].index), d = !0, s = !1, l = void 0;
        try {
            for (var m, w = n.split(".")[Symbol.iterator](); !(d = (m = w.next()).done); d = !0) {
                ".nodes[" + m.value + "]";
            }
        } catch (e) {
            s = !0, l = e;
        } finally {
            try {
                !d && w.return && w.return();
            } finally {
                if (s) throw l;
            }
        }
    }
}

function wxAutoImageCal(e, a, t, i) {
    var r, o = 0, n = 0, d = {}, s = t.data[i].view.imagePadding;
    return realWindowHeight, (r = realWindowWidth - 2 * s) < e ? (n = (o = r) * a / e, 
    d.imageWidth = o, d.imageheight = n) : (d.imageWidth = e, d.imageheight = a), d;
}

function wxParseTemArray(e, a, t, i) {
    for (var r = [], o = i.data, n = null, d = 0; d < t; d++) {
        var s = o[a + d].nodes;
        r.push(s);
    }
    e = e || "wxParseTemArray", (n = JSON.parse('{"' + e + '":""}'))[e] = r, i.setData(n);
}

function emojisInit() {
    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "", a = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", t = arguments[2];
    _html2json2.default.emojisInit(e, a, t);
}

wx.getSystemInfo({
    success: function(e) {
        realWindowWidth = e.windowWidth, realWindowHeight = e.windowHeight;
    }
}), module.exports = {
    wxParse: wxParse,
    wxParseTemArray: wxParseTemArray,
    emojisInit: emojisInit
};