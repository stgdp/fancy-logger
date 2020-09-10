const ansi_codes = require( "@stgdp/ansi-codes" )

function write( data ) {

    if ( this._options.buffer ) {
        this._output += data
    } else {
        this.stdout.write( data )
    }

    return this
}

function end() {
    this.write( ansi_codes.reset.all )
    this.write( "\n" )

    return this
}

function output( end = false ) {

    if ( typeof end !== "boolean" ) {
        end = false
    }

    if ( end ) {
        this.end()
    }

    if ( this._options.buffer ) {
        this.stdout.write( this._output )
    }

    return this
}

function buffer_return() {

    if ( this._options.buffer ) {
        this.end()
    }

    return this._output
}

function write_timestamp() {
    var time = new Date()

    this.write( ansi_codes.reset.all )
    this.write( "[" )
    this.write( ansi_codes.fg.bright.black )
    this.write( ( "0" + time.getHours() ).slice( -2 ) + ":" )
    this.write( ( "0" + time.getMinutes() ).slice( -2 ) + ":" )
    this.write( ( "0" + time.getSeconds() ).slice( -2 ) )
    this.write( ansi_codes.reset.fg )
    this.write( "] - " )
}

module.exports = exports = {
    write,
    end,
    output,
    return: buffer_return,
    write_timestamp
}
