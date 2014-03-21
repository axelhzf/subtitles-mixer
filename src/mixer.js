var srt = require("./srt");
var ass = require("./ass");
var fs = require("fs");
var _ = require("underscore");
var jschardet = require("jschardet");
var iconv = require('iconv-lite');

module.exports = function mixer (topPath, bottomPath, outPath, cb) {
  readSrt(topPath, function (err, topData) {
    if (err) return cb(err);

    readSrt(bottomPath, function (err, bottomData) {
      if (err) return cb(err);

      setAll(topData, "style", "Top");
      setAll(bottomData, "style", "Bot");

      var out = fs.createWriteStream(outPath);
      ass.writeAss(srt.merge(topData, bottomData), out);
      out.end();

      out.on("finish", function () {
        if (cb) {
          cb()
        }
      });

    });
  });
};

function bufferToString (buffer) {
  var str = "";
  for (var i = 0; i < buffer.length; ++i)
    str += String.fromCharCode(buffer[i])
  return str;
}

function detectEncoding (content) {
  var str = bufferToString(content);
  str = str.replace(/[A-Za-z0-9 :\-\->,\n]+/g, "");
  var detect = jschardet.detect(str);
  return detect.encoding;
}

function readSrt(options, cb) {
  var path;
  var encoding;

  if (_.isString(options)) {
    path = options;
  } else {
    path = options.path;
    encoding = options.encoding;
  }

  fs.readFile(path, function (err, content) {
    if (err) return cb(err);

    if (!encoding) {
      encoding = detectEncoding(content);
    }

    var strContent;
    if (encoding !="utf-8" && encoding!="ascii") {
      strContent = iconv.fromEncoding(content, encoding);
    } else {
      strContent = content.toString();
    }

    var srtData = srt.parse(strContent);
    cb(null, srtData);
  });
}

function setAll (arr, property, value) {
  _.each(arr, function (item) {
    if (item) {
      item[property] = value;
    }
  });
}