var expect = require("chai").expect;
var ass = require("../src/ass");

describe("formatToAssTime", function () {

  it("should convert milliseconds to assTime", function () {
    var milliseconds = 124;
    var seconds = 21;
    var minutes = 12;
    var hours = 1;

    var totalMilliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
    expect(ass.formatToAssTime(totalMilliseconds)).to.eql("01:12:21.12")
  });

});