var _ = require("underscore");

function splitSegments(srt) {
  srt = srt.replace(/\r\n/g, "\n");
  return srt.split("\n\n");
}

function filterValidSegments(segments) {
  return segments.filter(function (segment) {
    return segment.length >= 3;
  });
}

function parseSegment(string) {
  var lines = string.split("\n");

  if (lines.length < 3) {
    return;
  }

  var number = parseInt(lines[0], 10);
  var times = lines[1].split(" --> ");
  var startTime = parseTime(times[0]);
  var endTime = parseTime(times[1]);
  var text = lines.slice(2).join("\n");

  var result = {
    number: number,
    startTimeStr : times[0],
    startTime: startTime,
    endTimeStr : times[1],
    endTime: endTime,
    text: text
  };

  return result;
}

function parseTime(timeString) {
  var chunks = timeString.split(":");
  var secondChunks = chunks[2].split(",");
  var hours = parseInt(chunks[0], 10);
  var minutes = parseInt(chunks[1], 10);
  var seconds = parseInt(secondChunks[0], 10);
  var milliSeconds = parseInt(secondChunks[1], 10);

  return 60 * 60 * 1000 * hours +
    60 * 1000 * minutes +
    1000 * seconds +
    milliSeconds;
}

function parse(srt) {
  var segments = splitSegments(srt);
  segments = filterValidSegments(segments);
  var segmentsData = segments.map(parseSegment);
  return segmentsData;
}

function merge(topData, bottomData) {
  var mergedData = topData.concat(bottomData);
  mergedData = _.compact(mergedData);
  var mergedDataSorted = _.sortBy(mergedData, function (data) {
    return data.startTime;
  });
  return mergedDataSorted;
}

exports.parse = parse;
exports.merge = merge;