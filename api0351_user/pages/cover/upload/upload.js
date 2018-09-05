var _weCropper = require("/../../../we-cropper/we-cropper.js"), _weCropper2 = _interopRequireDefault(_weCropper);

function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var device = wx.getSystemInfoSync(), width = device.windowWidth, height = device.windowHeight - 50;

Page({
    data: {
        cropperOpt: {
            id: "cropper",
            width: width,
            height: height,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: (width - 348) / 2,
                y: (height - 360) / 2,
                width: 348,
                height: 360
            }
        }
    },
    touchStart: function(e) {
        this.wecropper.touchStart(e);
    },
    touchMove: function(e) {
        this.wecropper.touchMove(e);
    },
    touchEnd: function(e) {
        this.wecropper.touchEnd(e);
    },
    getCropperImage: function() {
        var o = this;
        this.wecropper.getCropperImage(function(e) {
            e ? wx.redirectTo({
                url: "../index/index?avatar=" + e + "&op=" + o.uid
            }) : console.log("获取图片失败，请稍后重试");
        });
    },
    uploadTap: function() {
        var t = this;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                var o = e.tempFilePaths[0];
                t.wecropper.pushOrign(o);
            }
        });
    },
    onLoad: function(e) {
        this.uid = e.op;
        var o = this.data.cropperOpt;
        e.src && (o.src = e.src, new _weCropper2.default(o).on("ready", function(e) {
            console.log("wecropper is ready for work!");
        }).on("beforeImageLoad", function(e) {
            wx.showToast({
                title: "上传中",
                icon: "loading",
                duration: 2e4
            });
        }).on("imageLoad", function(e) {
            wx.hideToast();
        }).on("beforeDraw", function(e, o) {}).updateCanvas());
    }
});