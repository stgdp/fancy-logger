const fs = require( "fs" )
const ansi_codes = require( "@stgdp/ansi-codes" )
const fecha = require( "fecha" ).format

function capture_stream( stream ) {
    var originalWrite = stream.write
    var buffer = ""

    stream.write = function ( chunk ) {
        buffer += chunk.toString()
        originalWrite.apply( stream, arguments )
    }

    return {
        unhook: function () {
            stream.write = originalWrite
        },
        reset: function () {
            stream.write = originalWrite
            return capture_stream( stream )
        },
        captured: function () {
            return buffer
        }
    }
}

exports.capture_stream = capture_stream

function get_timestamp( format = "HH:mm:ss" ) {
    return `${ansi_codes.reset.all}[${ansi_codes.fg.bright.black}${fecha( new Date(), format )}${ansi_codes.reset.all}] - `
}

exports.get_timestamp = get_timestamp

function set_expected( content = "", timestamp = "HH:mm:ss", end = true ) {
    var expected = ""

    if ( typeof timestamp === "string" ) {
        expected += get_timestamp( timestamp )
    }

    expected += content

    if ( end ) {
        expected += ansi_codes.reset.all
        expected += "\n"
    }

    return expected
}

exports.set_expected = set_expected

function get_file( name ) {
    return fs.readFileSync( name, { encoding: "utf8" } )
}

exports.get_file = get_file
