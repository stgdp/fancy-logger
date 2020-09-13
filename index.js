const ansi_codes = require( "@stgdp/ansi-codes" )
const timestamp = require( "fecha" ).format

class Logger {
    constructor ( options ) {
        this.stdout = process.stdout
        this._options = Object.assign( {
            timestamp: true,
            format: "HH:mm:ss",
            buffer: false,
        }, options )
        this._output = ""
        this._modifier = ""
        this._bright = false

        if ( this._options.timestamp ) {
            write_timestamp.call( this )
        }
    }

    write( data ) {
        if ( this._options.buffer ) {
            this._output += data
        } else {
            this.stdout.write( data )
        }

        return this
    }

    end() {
        this.all.write( "\n" )
        return this
    }

    output( end = false ) {
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

    return() {
        if ( this._options.buffer ) {
            this.end()
        }

        return this._output
    }

    get bright() {
        this._bright = !this._bright
        return this
    }
}

function write_timestamp() {
    this
        .all
        .write( "[" )
        .fg.bright.black
        .write( timestamp( new Date(), this._options.format ) )
        .all
        .write( "] - " )
}

function define_get( name, callback ) {
    if ( name === null || typeof name !== "string" ) {
        return
    }

    if ( callback === null || typeof callback !== "function" ) {
        return
    }

    Object.defineProperty( Logger.prototype, name, {
        get: callback
    } )
}

["fg", "bg", "modifier", "reset"].forEach( function ( area ) {
    var name = area

    if ( name == "modifier" ) {
        name = "decoration"
    }

    define_get( name, function() {
        this._modifier = area
        return this
    } )
} )

Object.keys( ansi_codes.fg ).forEach( function ( color ) {
    if ( color == "bright" ) {
        return
    }

    define_get( color, function() {
        if ( this._modifier != "fg" && this._modifier != "bg" ) {
            this._modifier = "fg"
        }

        if ( this._bright ) {
            this.write( ansi_codes[this._modifier].bright[color] )
        } else {
            this.write( ansi_codes[this._modifier][color] )
        }

        return this
    } )
} )

Object.keys( ansi_codes.reset ).forEach( function ( decoration ) {
    if ( decoration == "fg" || decoration == "bg" || decoration == "all" ) {
        var name = decoration

        if ( decoration != "all" ) {
            name = `reset_${decoration}`
        }

        define_get( name, function() {
            this._modifier = "reset"
            this.write( ansi_codes[this._modifier][decoration] )
            this._modifier = ""
            this._bright = false
            return this
        } )
        return
    }

    define_get( decoration, function() {
        if ( this._modifier != "modifier" && this._modifier != "reset" ) {
            this._modifier = "modifier"
        }

        this.write( ansi_codes[this._modifier][decoration] )

        if ( this._modifier == "reset" ) {
            this._modifier = ""
            this._bright = false
        }

        return this
    } )
} )

module.exports = exports = function ( options ) {
    return new Logger( options )
}
