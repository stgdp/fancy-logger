const write = require( "./lib/write" )
const modifiers = require( "./lib/modifiers" )
const helpers = require( "./lib/helpers" )

class Logger {

    constructor ( options ) {
        this.stdout = process.stdout
        this._options = Object.assign( {
            timestamp: true,
            buffer: false,
        }, options )
        this._output = ""

        this._set_fg()
        this._set_bg()
        this._set_mods()
        this._set_reset()

        if ( this._options.timestamp ) {
            this._write_timestamp()
        }
    }

    write = write.write
    end = write.end
    output = write.output
    return = write.return
    _write_timestamp = write.write_timestamp

    fg = modifiers.fg
    bg = modifiers.bg
    modifier = modifiers.modifier
    reset = modifiers.reset

    _set_prototype = helpers._set_prototype
    _set_fg = helpers._set_fg
    _set_bg = helpers._set_bg
    _set_mods = helpers._set_mods
    _set_reset = helpers._set_reset
}

module.exports = exports = function ( options ) {
    return new Logger( options )
}
