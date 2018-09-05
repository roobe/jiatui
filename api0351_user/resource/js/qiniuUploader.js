!function() {
    var s = {
        qiniuRegion: "",
        qiniuImageURLPrefix: "",
        qiniuUploadToken: "",
        qiniuUploadTokenURL: "",
        qiniuUploadTokenFunction: null,
        qiniuShouldUseQiniuFileName: !1
    };
    function r(e) {
        e.region ? s.qiniuRegion = e.region : console.error("qiniu uploader need your bucket region"), 
        e.uptoken ? s.qiniuUploadToken = e.uptoken : e.uptokenURL ? s.qiniuUploadTokenURL = e.uptokenURL : e.uptokenFunc && (s.qiniuUploadTokenFunction = e.uptokenFunc), 
        e.domain && (s.qiniuImageURLPrefix = e.domain), s.qiniuShouldUseQiniuFileName = e.shouldUseQiniuFileName;
    }
    function t(e, u, a, n, i, o) {
        if (null == s.qiniuUploadToken && 0 < s.qiniuUploadToken.length) console.error("qiniu UploadToken is null, please check the init config or networking"); else {
            var l = function(e) {
                var n = null;
                switch (e) {
                  case "ECN":
                    n = "https://up.qbox.me";
                    break;

                  case "NCN":
                    n = "https://up-z1.qbox.me";
                    break;

                  case "SCN":
                    n = "https://up-z2.qbox.me";
                    break;

                  case "NA":
                    n = "https://up-na0.qbox.me";
                    break;

                  case "ASG":
                    n = "https://up-as0.qbox.me";
                    break;

                  default:
                    console.error("please make the region is with one of [ECN, SCN, NCN, NA, ASG]");
                }
                return n;
            }(s.qiniuRegion), r = e.split("//")[1];
            n && n.key && (r = n.key);
            var t = {
                token: s.qiniuUploadToken
            };
            s.qiniuShouldUseQiniuFileName || (t.key = r);
            var p = wx.uploadFile({
                url: l,
                filePath: e,
                name: "file",
                formData: t,
                success: function(e) {
                    var n = e.data;
                    e.data.hasOwnProperty("type") && "Buffer" === e.data.type && (n = String.fromCharCode.apply(null, e.data.data));
                    try {
                        var i = JSON.parse(n), o = s.qiniuImageURLPrefix + "/" + i.key;
                        i.imageURL = o, console.log(i), u && u(i);
                    } catch (e) {
                        console.log("parse JSON failed, origin String is: " + n), a && a(e);
                    }
                },
                fail: function(e) {
                    console.error(e), a && a(e);
                }
            });
            p.onProgressUpdate(function(e) {
                i && i(e);
            }), o && o(function() {
                p.abort();
            });
        }
    }
    module.exports = {
        init: function(e) {
            s = {
                qiniuRegion: "",
                qiniuImageURLPrefix: "",
                qiniuUploadToken: "",
                qiniuUploadTokenURL: "",
                qiniuUploadTokenFunction: null,
                qiniuShouldUseQiniuFileName: !1
            }, r(e);
        },
        upload: function(e, n, i, o, u, a) {
            if (null == e) return void console.error("qiniu uploader need filePath to upload");
            o && r(o);
            if (s.qiniuUploadToken) t(e, n, i, o, u, a); else if (s.qiniuUploadTokenURL) l = function() {
                t(e, n, i, o, u, a);
            }, wx.request({
                url: s.qiniuUploadTokenURL,
                success: function(e) {
                    var n = e.data.uptoken;
                    n && 0 < n.length ? (s.qiniuUploadToken = n, l && l()) : console.error("qiniuUploader cannot get your token, please check the uptokenURL or server");
                },
                fail: function(e) {
                    console.error("qiniu UploadToken is null, please check the init config or networking: " + e);
                }
            }); else {
                if (!s.qiniuUploadTokenFunction) return void console.error("qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]");
                if (s.qiniuUploadToken = s.qiniuUploadTokenFunction(), null == s.qiniuUploadToken && 0 < s.qiniuUploadToken.length) return void console.error("qiniu UploadTokenFunction result is null, please check the return value");
                t(e, n, i, o, u, a);
            }
            var l;
        }
    };
}();