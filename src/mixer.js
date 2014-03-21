var srt = require("./srt");
var ass = require("./ass");
var fs = require("fs");
var _ = require("underscore");

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

function readSrt(path, cb) {
  fs.readFile(path, function (err, content) {
    if (err) return cb(err);

    var srtData = srt.parse(content.toString());
    cb(null, srtData);
  });
}

function setAll (arr, property, value) {
  _.each(arr, function (item) {
    item[property] = value;
  });
}