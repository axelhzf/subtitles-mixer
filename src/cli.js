var _ = require("underscore");
var program = require("commander");
var mixer = require("./mixer");

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

mixer(program.top, program.bottom, program.out);