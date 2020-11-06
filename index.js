const fs = require( "fs" )
const path = require( "path" )

const ansi_codes = require( "@stgdp/ansi-codes" )
const strip_ansi = require( "strip-ansi" )
const timestamp = require( "fecha" ).format

class Logger {
    constructor ( options ) {
        this.stdout = process.stdout
        this._options = Object.assign( {
            timestamp: true,
            format: "HH:mm:ss",
            buffer: false,
            file: false,
            file_options: {}
        }, options )
        this._output = ""
        this._modifier = ""
        this._bright = false

        if ( this._options.timestamp ) {
            write_timestamp.call( this )
        }
    }

    write( data ) {
        this._output += data

        if ( !this._options.buffer ) {
            this.stdout.write( data )
        }

        return this
    }

    get end() {
        this.all.write( "\n" )
        return this
    }

    get output() {
        if ( this._options.buffer ) {
            this.stdout.write( this._output )
        }

        return this
    }

    get return() {
        return this._output
    }

    to_file( file = false ) {
        if ( file == false ) {
            file = this._options.file
        }

        if ( file == false ) {
            return this
        }

        while ( true ) {
            try {
                write_file.call( this, file )
                break
            } catch ( err ) {
                throw err
            }
        }

        return this
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

async function write_file( file ) {
    fs.mkdirSync( path.dirname( file ), {
        recursive: true
    } )

    var file_options = Object.assign( this._options.file_options, {
        flag: "a"
    } )

    await fs.writeFileSync( path.resolve( file ), strip_ansi( this._output ), file_options )
}

["fg", "bg", "modifier", "reset"].forEach( function ( area ) {
    var name = area

    if ( name == "modifier" ) {
        name = "decoration"
    }

    define_get( name, function () {
        this._modifier = area
        return this
    } )
} )

Object.keys( ansi_codes.fg ).forEach( function ( color ) {
    if ( color == "bright" ) {
        return
    }

    define_get( color, function () {
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

        define_get( name, function () {
            this._modifier = "reset"
            this.write( ansi_codes[this._modifier][decoration] )
            this._modifier = ""
            this._bright = false
            return this
        } )
        return
    }

    define_get( decoration, function () {
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
