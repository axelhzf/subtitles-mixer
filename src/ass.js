var fs = require("fs");
var path = require("path");
var _s = require("underscore.string");
var _ = require("underscore");

var MAX_MILLISECONDS = 1000;
var SECONDS = 1000;
var MAX_SECONDS = 60;
var MINUTES = 60 * SECONDS;
var MAX_MINUTES = 60;
var HOURS = 60 * MINUTES;
var MAX_HOURS = 24;

function assHeader() {
  var filePath = path.join(__dirname, "ass-header.txt");
  return fs.readFileSync(filePath).toString();
}

function formatTimePart(value) {
  return _s.pad(value.toString().substring(0, 2), 2, "0");
}

function extractTimePart(milliseconds, div, mod) {
  var result = Math.floor(milliseconds / div);
  if (mod) {
    result = result % mod;
  }
  return result;
}

function timePart(milliseconds, div, mod) {
  return formatTimePart(extractTimePart(milliseconds, div, mod));
}

function formatToAssTime(totalMilliseconds) {
  var milliseconds = timePart(totalMilliseconds, 1, MAX_MILLISECONDS);
  var seconds = timePart(totalMilliseconds, SECONDS, MAX_SECONDS);
  var minutes = timePart(totalMilliseconds, MINUTES, MAX_MINUTES);
  var hours = timePart(totalMilliseconds, HOURS, MAX_HOURS);
  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function writeAss(srtData, out) {
  out.write(assHeader() + "\n");
  srtData.forEach(function (segment) {
    var dialogue = [
      "Dialogue: 0",
      formatToAssTime(segment.startTime),
      formatToAssTime(segment.endTime),
      segment.style,
      "",
      "0000",
      "0000",
      "0000",
      "",
      segment.text.replace(/\n/g, "\\n")
    ].join(",");
    out.write(dialogue + "\n");
  });
}

exports.writeAss = writeAss;
exports.formatToAssTime = formatToAssTime;