#!/usr/bin/env node
const yargs = require("yargs/yargs");
const {hideBin} = require("yargs/helpers");
const start = require("./start");
const build = require("./build");
yargs(hideBin(process.argv))
    .command(
        "start [port]",
        "Build a project in development mode",
        yargs => {
            yargs.positional("port", {
                describe: "port to bind on",
                default: 8282
            });
        },
        argv => {
            // console.log(argv,'************************');
            start(argv);
        }
    )
    .command(
        "build [type]",
        "Build a project in development mode",
        yargs => {
            yargs.positional("type", {
                describe: "production environment set as",
                default: "beta"
            });
        },
        argv => {
            build(argv);
            // console.log(argv.port);
            // console.l)
        }
    )
    .option("verbose", {
        alias: "v",
        default: false
    })
    .parse();
// yargs.argv;
