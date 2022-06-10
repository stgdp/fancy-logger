const fs = require( "fs" )
const path = require( "path" )

const ansi_codes = require( "@stgdp/ansi-codes" )
const strip_ansi = require( "strip-ansi" )
const timestamp = require( "fecha" ).format

class Logger {
    constructor ( options ) {
        this.stdout = process.stdout
        this._options = parse_options.call( this, options )
        this._output = ""
        this._modifier = ""
        this._bright = false

        if ( this._options.timestamp ) {
            write_timestamp.call( this )
        }

        set_modifiers.call( this, this._options.modifiers )
    }

    write( data, modifiers = {} ) {
        modifiers = parse_modifiers.call( this, modifiers, true )

        set_modifiers.call( this, modifiers )

        if ( Array.isArray( data ) ) {
            data = data.join( ' ' )
        }

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
        if ( !file ) {
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

function default_options( reset = false ) {
    let options = {
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

    if ( reset ) {
        options.modifiers.reset = {
            all: false,
            bold: false,
            dim: false,
            italic: false,
            underline: false,
            inverse: false,
            hidden: false,
            strike: false,
            reset_fg: false,
            reset_bg: false,
            frame: false,
            encircle: false,
            overline: false,
        }
    }

    return options
}

function parse_options( options, reset = false ) {
    let parsed_options = default_options()

    if ( typeof options !== "object" || !options ) {
        return parsed_options
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

    parsed_options.modifiers = parse_modifiers.call( this, options.modifiers, reset )

    return parsed_options
}

function parse_modifiers( modifiers, reset ) {
    let parsed_modifiers = default_options( reset ).modifiers

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

    if ( reset ) {
        if ( Array.isArray( modifiers.reset ) || ( typeof modifiers.reset === "object" && modifiers.reset ) ) {
            if ( Array.isArray( modifiers.reset ) ) {
                modifiers.reset.forEach( function ( item ) {
                    if ( item in parsed_modifiers.reset ) {
                        parsed_modifiers.reset[item] = true
                    }
                } )
            } else {
                for ( let item in parsed_modifiers.reset ) {
                    if ( typeof modifiers.reset[item] === "boolean" ) {
                        parsed_modifiers.reset[item] = modifiers.reset[item]
                    }
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

function set_modifiers( modifiers ) {
    if ( modifiers.fg ) {
        if ( modifiers.bright && modifiers.bright.fg ) {
            this.bright
        }

        this.fg[modifiers.fg]
    }

    if ( modifiers.bg ) {
        if ( modifiers.bright && modifiers.bright.bg ) {
            this.bright
        }

        this.bg[modifiers.bg]
    }

    let that = this

    Object.keys( ansi_codes.modifier ).forEach( function( decoration ) {
        if ( modifiers.decoration[decoration] ) {
            that.decoration[decoration]
        }
    } )

    if ( modifiers.reset ) {
        Object.keys( ansi_codes.reset ).forEach( function( reset ) {
            if ( reset == "fg" || reset == "bg" ) {
                reset = `reset_${reset}`
            }

            if ( modifiers.reset[reset] ) {
                that.reset[reset]
            }
        } )
    }
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
