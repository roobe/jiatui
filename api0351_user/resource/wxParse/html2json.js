var __placeImgeUrlHttps = "https", __emojisReg = "", __emojisBaseSrc = "", __emojis = {}, wxDiscode = require("./wxDiscode.js"), HTMLParser = require("./htmlparser.js"), empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr"), block = makeMap("br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"), inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var"), closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr"), fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected"), special = makeMap("wxxxcode-style,script,style,view,scroll-view,block");

function makeMap(e) {
    for (var t = {}, r = e.split(","), s = 0; s < r.length; s++) t[r[s]] = !0;
    return t;
}

function q(e) {
    return '"' + e + '"';
}

function removeDOCTYPE(e) {
    return e.replace(/<\?xml.*\?>\n/, "").replace(/<.*!doctype.*\>\n/, "").replace(/<.*!DOCTYPE.*\>\n/, "");
}

function trimHtml(e) {
    return e.replace(/\r?\n+/g, "").replace(/<!--.*?-->/gi, "").replace(/\/\*.*?\*\//gi, "").replace(/[ ]+</gi, "<");
}

function html2json(e, d) {
    e = trimHtml(e = removeDOCTYPE(e)), e = wxDiscode.strDiscode(e);
    var m = [], p = {
        node: d,
        nodes: [],
        images: [],
        imageUrls: []
    }, u = 0;
    return HTMLParser(e, {
        start: function(e, t, r) {
            var s, o = {
                node: "element",
                tag: e
            };
            0 === m.length ? (o.index = u.toString(), u += 1) : (void 0 === (s = m[0]).nodes && (s.nodes = []), 
            o.index = s.index + "." + s.nodes.length);
            if (block[e] ? o.tagType = "block" : inline[e] ? o.tagType = "inline" : closeSelf[e] && (o.tagType = "closeSelf"), 
            0 !== t.length && (o.attr = t.reduce(function(e, t) {
                var r = t.name, s = t.value;
                return "class" == r && (console.dir(s), o.classStr = s), "style" == r && (console.dir(s), 
                o.styleStr = s), s.match(/ /) && (s = s.split(" ")), e[r] ? Array.isArray(e[r]) ? e[r].push(s) : e[r] = [ e[r], s ] : e[r] = s, 
                e;
            }, {})), "img" === o.tag) {
                o.imgIndex = p.images.length;
                var a = o.attr.src;
                "" == a[0] && a.splice(0, 1), a = wxDiscode.urlToHttpUrl(a, __placeImgeUrlHttps), 
                o.attr.src = a, o.from = d, p.images.push(o), p.imageUrls.push(a);
            }
            if ("font" === o.tag) {
                var i = [ "x-small", "small", "medium", "large", "x-large", "xx-large", "-webkit-xxx-large" ], n = {
                    color: "color",
                    face: "font-family",
                    size: "font-size"
                };
                for (var l in o.attr.style || (o.attr.style = []), o.styleStr || (o.styleStr = ""), 
                n) if (o.attr[l]) {
                    var c = "size" === l ? i[o.attr[l] - 1] : o.attr[l];
                    o.attr.style.push(n[l]), o.attr.style.push(c), o.styleStr += n[l] + ": " + c + ";";
                }
            }
            ("source" === o.tag && (p.source = o.attr.src), r) ? (void 0 === (s = m[0] || p).nodes && (s.nodes = []), 
            s.nodes.push(o)) : m.unshift(o);
        },
        end: function(e) {
            var t = m.shift();
            if (t.tag !== e && console.error("invalid state: mismatch end tag"), "video" === t.tag && p.source && (t.attr.src = p.source, 
            delete p.source), 0 === m.length) p.nodes.push(t); else {
                var r = m[0];
                void 0 === r.nodes && (r.nodes = []), r.nodes.push(t);
            }
        },
        chars: function(e) {
            var t = {
                node: "text",
                text: e,
                textArray: transEmojiStr(e)
            };
            if (0 === m.length) t.index = u.toString(), u += 1, p.nodes.push(t); else {
                var r = m[0];
                void 0 === r.nodes && (r.nodes = []), t.index = r.index + "." + r.nodes.length, 
                r.nodes.push(t);
            }
        },
        comment: function(e) {}
    }), p;
}

function transEmojiStr(e) {
    var t = [];
    if (0 == __emojisReg.length || !__emojis) return (i = {
        node: "text"
    }).text = e, s = [ i ];
    e = e.replace(/\[([^\[\]]+)\]/g, ":$1:");
    for (var r = new RegExp("[:]"), s = e.split(r), o = 0; o < s.length; o++) {
        var a = s[o], i = {};
        __emojis[a] ? (i.node = "element", i.tag = "emoji", i.text = __emojis[a], i.baseSrc = __emojisBaseSrc) : (i.node = "text", 
        i.text = a), t.push(i);
    }
    return t;
}

function emojisInit() {
    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "", t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", r = arguments[2];
    __emojisReg = e, __emojisBaseSrc = t, __emojis = r;
}

module.exports = {
    html2json: html2json,
    emojisInit: emojisInit
};