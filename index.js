const fs = require( "fs" )
const path = require( "path" )

const ansi_codes = require( "@stgdp/ansi-codes" )
const strip_ansi = require( "strip-ansi" )
const timestamp = require( "fecha" ).format

class Logger {
    constructor ( options ) {
        this.stdout = process.stdout
        this._options = options
        this._output = ""
        this._modifier = ""
        this._bright = false

        parse_options.call( this )

        if ( this._options.timestamp ) {
            write_timestamp.call( this )
        }

        set_modifiers.call( this )
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

        if ( typeof file !== "string" || !file ) {
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

function default_options() {
    return {
        timestamp: true,
        format: "HH:mm:ss",
        buffer: false,
        file: false,
        file_options: {},
        modifiers: {
            fg: false,
            bg: false,
            bright: {
                fg: false,
                bg: false,
            },
            decoration: {
                bold: false,
                dim: false,
                italic: false,
                underline: false,
                inverse: false,
                hidden: false,
                strike: false,
                frame: false,
                encircle: false,
                overline: false,
            }
        }
    }
}

function parse_options() {
    let options = this._options
    let parsed_options = default_options()

    if ( typeof options !== "object" || !options ) {
        this._options = parsed_options
        return
    }

    if ( typeof options.timestamp === "boolean" ) {
        parsed_options.timestamp = options.timestamp
    }

    if ( typeof options.format === "string" ) {
        parsed_options.format = options.format
    }

    if ( typeof options.buffer === "boolean" ) {
        parsed_options.buffer = options.buffer
    }

    if ( typeof options.file === "string" ) {
        parsed_options.file = options.file
    }

    if ( typeof options.file_options === "object" && options.file_options ) {
        parsed_options.file_options = options.file_options
    }

    parsed_options.modifiers = parse_modifiers.call( this )

    this._options = parsed_options
}

function parse_modifiers() {
    let modifiers = this._options.modifiers
    let parsed_modifiers = default_options().modifiers

    if ( typeof modifiers !== "object" || !modifiers ) {
        return parsed_modifiers
    }

    if ( typeof modifiers.fg === "string" ) {
        parsed_modifiers.fg = modifiers.fg
    }

    if ( typeof modifiers.bg === "string" ) {
        parsed_modifiers.bg = modifiers.bg
    }

    if ( Array.isArray( modifiers.bright ) || ( typeof modifiers.bright === "object" && modifiers.bright ) ) {
        if ( Array.isArray( modifiers.bright ) ) {
            modifiers.bright.forEach( function ( item ) {
                if ( item in parsed_modifiers.bright ) {
                    parsed_modifiers.bright[item] = true
                }
            } )
        } else {
            for ( let item in parsed_modifiers.bright ) {
                if ( typeof modifiers.bright[item] === "boolean" ) {
                    parsed_modifiers.bright[item] = modifiers.bright[item]
                }
            }
        }
    }

    if ( Array.isArray( modifiers.decoration ) || ( typeof modifiers.decoration === "object" && modifiers.decoration ) ) {
        if ( Array.isArray( modifiers.decoration ) ) {
            modifiers.decoration.forEach( function ( item ) {
                if ( item in parsed_modifiers.decoration ) {
                    parsed_modifiers.decoration[item] = true
                }
            } )
        } else {
            for ( let item in parsed_modifiers.decoration ) {
                if ( typeof modifiers.decoration[item] === "boolean" ) {
                    parsed_modifiers.decoration[item] = modifiers.decoration[item]
                }
            }
        }
    }

    return parsed_modifiers
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

function set_modifiers() {
    let modifiers = this._options.modifiers

    if ( !!modifiers.fg ) {
        if ( !!modifiers.bright.fg ) {
            this.bright
        }

        this.fg[modifiers.fg]
    }

    if ( !!modifiers.bg ) {
        if ( !!modifiers.bright.bg ) {
            this.bright
        }

        this.bg[modifiers.bg]
    }

    let that = this

    Object.keys( ansi_codes.modifier ).forEach( function( decoration ) {
        if ( !!modifiers.decoration[decoration] ) {
            that.decoration[decoration]
        }
    } )
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

        this._bright = false

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
