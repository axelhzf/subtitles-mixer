var fs = require("fs");
var _ = require("underscore");
var program = require("commander");
var srt = require("./../src/srt");
var ass = require("./../src/ass");

function setAll (arr, property, value) {
  _.each(arr, function (item) {
    item[property] = value;
  });
}

function validateParameters(object, params) {
  _.each(params, function (param) {
    if (_.isUndefined(object[param])) {
      console.error("Parameter --%s required", param);
      process.exit(1);
    }
  });
}

var version = require("./../package.json").version;
program
  .version(version)
  .option("-t, --top <path>", "Top subtitle path")
  .option("-b, --bottom <path>", "Bottom subtitle path")
  .option("-o, --out <path>", "Output path")
  .parse(process.argv);

validateParameters(program, ["top", "bottom", "out"]);

var topContent = fs.readFileSync(program.top).toString();
var bottomContent = fs.readFileSync(program.bottom).toString();

var topData = srt.parse(topContent);
var bottomData = srt.parse(bottomContent);

setAll(topData, "style", "Top");
setAll(bottomData, "style", "Bot");

var out = fs.createWriteStream(program.out);
ass.writeAss(srt.merge(topData, bottomData), out);
out.end();