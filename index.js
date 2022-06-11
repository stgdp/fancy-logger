// Core dependencies
const fs = require( 'fs' )
const path = require( 'path' )

// External dependencies
const ansi_codes = require( '@stgdp/ansi-codes' )
const strip_ansi = require( 'strip-ansi' )
const timestamp = require( 'fecha' ).format

/**
 * Logger default options
 * @typedef {object} LoggerDefaultOptions
 * @property {boolean} timestamp - Enables the timestamp
 * @property {string} format - Sets the format for the timestamp
 * @property {boolean} buffer - Buffers the output to be returned or outputted at a later
 * @property {boolean|string} file - Sets a file to store the current log buffer to when `to_file` is called
 * @property {object} file_options - Sets the file options for the `to_file` method. Gets passed to `fs.writeFileSync`
 * @property {object} modifiers - Sets the default modifiers for the logger to run with
 * @property {boolean|string} modifiers.fg - The foreground color for the logger
 * @property {boolean|string} modifiers.bg - The background color for the logger
 * @property {object} modifiers.bright - The brightness options for the foreground and background
 * @property {boolean} modifiers.bright.fg - Whether the foreground should be bright
 * @property {boolean} modifiers.bright.bg - Whether the foreground should be bright
 * @property {object} modifiers.decoration - The decoration options for the logger
 * @property {boolean} modifiers.decoration.bold - Sets the logger to be bold
 * @property {boolean} modifiers.decoration.bold - Sets the logger to be bold
 * @property {boolean} modifiers.decoration.dim - Sets the logger to be dim
 * @property {boolean} modifiers.decoration.italic - Sets the logger to be italic
 * @property {boolean} modifiers.decoration.underline - Sets the logger to be underline
 * @property {boolean} modifiers.decoration.inverse - Sets the logger to be inverse
 * @property {boolean} modifiers.decoration.hidden - Sets the logger to be hidden
 * @property {boolean} modifiers.decoration.strike - Sets the logger to be strike
 * @property {boolean} modifiers.decoration.frame - Sets the logger to be frame
 * @property {boolean} modifiers.decoration.encircle - Sets the logger to be encircle
 * @property {boolean} modifiers.decoration.overline - Sets the logger to be overline
 */

/**
 * Logger default options w/ reset options
 * @typedef {object} LoggerDefaultOptionsReset
 * @property {boolean} timestamp - Enables the timestamp
 * @property {string} format - Sets the format for the timestamp
 * @property {boolean} buffer - Buffers the output to be returned or outputted at a later
 * @property {boolean|string} file - Sets a file to store the current log buffer to when `to_file` is called
 * @property {object} file_options - Sets the file options for the `to_file` method. Gets passed to `fs.writeFileSync`
 * @property {object} modifiers - Sets the default modifiers for the logger to run with
 * @property {boolean|string} modifiers.fg - The foreground color for the logger
 * @property {boolean|string} modifiers.bg - The background color for the logger
 * @property {object} modifiers.bright - The brightness options for the foreground and background
 * @property {boolean} modifiers.bright.fg - Whether the foreground should be bright
 * @property {boolean} modifiers.bright.bg - Whether the foreground should be bright
 * @property {object} modifiers.decoration - The decoration options for the logger
 * @property {boolean} modifiers.decoration.bold - Sets the logger to be bold
 * @property {boolean} modifiers.decoration.bold - Sets the logger to be bold
 * @property {boolean} modifiers.decoration.dim - Sets the logger to be dim
 * @property {boolean} modifiers.decoration.italic - Sets the logger to be italic
 * @property {boolean} modifiers.decoration.underline - Sets the logger to be underline
 * @property {boolean} modifiers.decoration.inverse - Sets the logger to be inverse
 * @property {boolean} modifiers.decoration.hidden - Sets the logger to be hidden
 * @property {boolean} modifiers.decoration.strike - Sets the logger to be strike
 * @property {boolean} modifiers.decoration.frame - Sets the logger to be frame
 * @property {boolean} modifiers.decoration.encircle - Sets the logger to be encircle
 * @property {boolean} modifiers.decoration.overline - Sets the logger to be overline
 * @property {object} modifiers.reset - The reset options for the logger
 * @property {boolean} modifiers.reset.all - Resets the modifiers in the logger
 * @property {boolean} modifiers.reset.bold - Resets the bold decoration in the logger
 * @property {boolean} modifiers.reset.dim - Resets the dim decoration in the logger
 * @property {boolean} modifiers.reset.italic - Resets the italic decoration in the logger
 * @property {boolean} modifiers.reset.underline - Resets the underline decoration in the logger
 * @property {boolean} modifiers.reset.inverse - Resets the inverse decoration in the logger
 * @property {boolean} modifiers.reset.hidden - Resets the hidden decoration in the logger
 * @property {boolean} modifiers.reset.strike - Resets the strike decoration in the logger
 * @property {boolean} modifiers.reset.reset_fg - Resets the foreground modifier in the logger
 * @property {boolean} modifiers.reset.reset_bg - Resets the background modifier in the logger
 * @property {boolean} modifiers.reset.frame - Resets the frame decoration in the logger
 * @property {boolean} modifiers.reset.encircle - Resets the encircle decoration in the logger
 * @property {boolean} modifiers.reset.overline - Resets the overline decoration in the logger
 */

/**
 * Class representing the logger
 * @property {object} stdout - Reference to `process.stdout`
 * @property {object} _options - The parsed logger options
 * @property {string} _output - The output, stored to a string
 * @property {string} _modifier - The modifier type to apply
 * @property {boolean} _bright - Whether the foreground/background should be bright
 */
class Logger {
    /**
     * Create a logger instance
     * @param {LoggerDefaultOptions} options - The logger options
     */
    constructor( options ) {
        this.stdout = process.stdout
        this._options = parse_options.call( this, options )
        this._output = ''
        this._modifier = ''
        this._bright = false

        if ( this._options.timestamp ) {
            write_timestamp.call( this )
        }

        set_modifiers.call( this, this._options.modifiers )
    }

    /**
     * Outputs provided content
     * @param {string|string[]} data - The content to write out
     * @param {object} modifiers - Modifiers to set for the logger. See https://github.com/stgdp/fancy-logger#default-modifiers and https://github.com/stgdp/fancy-logger#reset
     * @returns {Logger}
     */
    write( data, modifiers = {} ) {
        // Parse & output any set modifiers
        modifiers = parse_modifiers.call( this, modifiers, true )
        set_modifiers.call( this, modifiers )

        // Joins array to string for output
        if ( Array.isArray( data ) ) {
            data = data.join( ' ' )
        }

        this._output += data

        if ( !this._options.buffer ) {
            this.stdout.write( data )
        }

        return this
    }

    /**
     * Resets the modifiers and writes a newline
     * @returns {Logger}
     */
    get end() {
        this.all.write( '\n' )
        return this
    }

    /**
     * Outputs the buffer to file if the buffer is enabled
     * @returns {Logger}
     */
    get output() {
        if ( this._options.buffer ) {
            this.stdout.write( this._output )
        }

        return this
    }

    /**
     * Returns the logger output
     * @returns {string}
     */
    get return() {
        return this._output
    }

    /**
     * Write the output to a file
     * @param {string} file - The location to save the file
     * @returns {Logger}
     */
    to_file( file = false ) {
        if ( !file ) {
            file = this._options.file
        }

        if ( typeof file !== 'string' || !file ) {
            return this
        }

        try {
            write_file.call( this, file )
        } catch ( error ) {
            throw error
        }

        return this
    }

    /**
     * Sets the foreground/background modifier to be bright
     * @return {Logger}
     */
    get bright() {
        this._bright = !this._bright
        return this
    }
}

/**
 * Returns the default options for the logger
 * @param {boolean} reset - Adds the reset options to the default options
 * @returns {LoggerDefaultOptions|LoggerDefaultOptionsReset}
 */
function default_options( reset = false ) {
    let options = {
        timestamp: true,
        format: 'HH:mm:ss',
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
            },
        },
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

/**
 * Parses the options supplied with the default options
 * @param {LoggerDefaultOptions|LoggerDefaultOptionsReset} options - The options to be parsed
 * @param {boolean} reset - Whether to parse the reset options
 * @returns {LoggerDefaultOptions|LoggerDefaultOptionsReset}
 */
function parse_options( options, reset = false ) {
    let parsed_options = default_options()

    if ( typeof options !== 'object' || !options ) {
        return parsed_options
    }

    if ( typeof options.timestamp === 'boolean' ) {
        parsed_options.timestamp = options.timestamp
    }

    if ( typeof options.format === 'string' ) {
        parsed_options.format = options.format
    }

    if ( typeof options.buffer === 'boolean' ) {
        parsed_options.buffer = options.buffer
    }

    if ( typeof options.file === 'string' ) {
        parsed_options.file = options.file
    }

    if ( typeof options.file_options === 'object' && options.file_options ) {
        parsed_options.file_options = options.file_options
    }

    parsed_options.modifiers = parse_modifiers.call( this, options.modifiers, reset )

    return parsed_options
}

/**
 * Parses the modifier supplied with the default options
 * @param {LoggerDefaultOptions.modifiers|LoggerDefaultOptionsReset.modifiers} modifiers - The modifiers to be parsed
 * @param {boolean} reset - Whether to parse the reset options
 * @returns {LoggerDefaultOptions.modifiers|LoggerDefaultOptionsReset.modifiers}
 */
function parse_modifiers( modifiers, reset ) {
    let parsed_modifiers = default_options( reset ).modifiers

    if ( typeof modifiers !== 'object' || !modifiers ) {
        return parsed_modifiers
    }

    if ( typeof modifiers.fg === 'string' ) {
        parsed_modifiers.fg = modifiers.fg
    }

    if ( typeof modifiers.bg === 'string' ) {
        parsed_modifiers.bg = modifiers.bg
    }

    if ( Array.isArray( modifiers.bright ) || ( typeof modifiers.bright === 'object' && modifiers.bright ) ) {
        if ( Array.isArray( modifiers.bright ) ) {
            modifiers.bright.forEach( ( item ) => {
                if ( item in parsed_modifiers.bright ) {
                    parsed_modifiers.bright[item] = true
                }
            } )
        } else {
            for ( let item in parsed_modifiers.bright ) {
                if ( typeof modifiers.bright[item] === 'boolean' ) {
                    parsed_modifiers.bright[item] = modifiers.bright[item]
                }
            }
        }
    }

    if ( Array.isArray( modifiers.decoration ) || ( typeof modifiers.decoration === 'object' && modifiers.decoration ) ) {
        if ( Array.isArray( modifiers.decoration ) ) {
            modifiers.decoration.forEach( ( item ) => {
                if ( item in parsed_modifiers.decoration ) {
                    parsed_modifiers.decoration[item] = true
                }
            } )
        } else {
            for ( let item in parsed_modifiers.decoration ) {
                if ( typeof modifiers.decoration[item] === 'boolean' ) {
                    parsed_modifiers.decoration[item] = modifiers.decoration[item]
                }
            }
        }
    }

    if ( reset && ( Array.isArray( modifiers.reset ) || ( typeof modifiers.reset === 'object' && modifiers.reset ) ) ) {
        if ( Array.isArray( modifiers.reset ) ) {
            modifiers.reset.forEach( ( item ) => {
                if ( item in parsed_modifiers.reset ) {
                    parsed_modifiers.reset[item] = true
                }
            } )
        } else {
            for ( let item in parsed_modifiers.reset ) {
                if ( typeof modifiers.reset[item] === 'boolean' ) {
                    parsed_modifiers.reset[item] = modifiers.reset[item]
                }
            }
        }
    }

    return parsed_modifiers
}

/**
 * Writes the timestamp to the logger
 */
function write_timestamp() {
    this
        .all
        .write( '[' )
        .write( timestamp( new Date(), this._options.format ), {
            fg: 'black',
            bright: {
                fg: true,
            },
        } )
        .write( '] - ', {
            reset: {
                all: true
            }
        } )
}

/**
 * Sets the modifiers in the logger
 * @param {LoggerDefaultOptions.modifiers|LoggerDefaultOptionsReset.modifiers} modifiers - The modifiers to set
 */
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

    Object.keys( ansi_codes.modifier ).forEach( ( decoration ) => {
        if ( modifiers.decoration[decoration] ) {
            that.decoration[decoration]
        }
    } )

    if ( modifiers.reset ) {
        Object.keys( ansi_codes.reset ).forEach( ( reset ) => {
            if ( reset == 'fg' || reset == 'bg' ) {
                reset = `reset_${reset}`
            }

            if ( modifiers.reset[reset] ) {
                that.reset[reset]
            }
        } )
    }
}

/**
 * Defines a getter method on the Logger
 * @param {string} name - The name of the getter
 * @param {function} callback - The callback for the getter
 * @returns {null}
 */
function define_get( name, callback ) {
    if ( name === null || typeof name !== 'string' ) {
        return
    }

    if ( callback === null || typeof callback !== 'function' ) {
        return
    }

    Object.defineProperty( Logger.prototype, name, {
        get: callback,
    } )
}

/**
 * Writes the output to a file
 * @async
 * @param {string} file - The location to save the file
 */
async function write_file( file ) {
    fs.mkdirSync( path.dirname( file ), {
        recursive: true,
    } )

    const file_options = Object.assign( this._options.file_options, {
        flag: 'a',
    } )

    await fs.writeFileSync( path.resolve( file ), strip_ansi( this._output ), file_options )
}

/**
 * Defines the foreground, background, decoration and reset getters
 */
['fg', 'bg', 'modifier', 'reset'].forEach( ( area ) => {
    let name = area

    if ( name == 'modifier' ) {
        name = 'decoration'
    }

    define_get( name, function() {
        this._modifier = area
        return this
    } )
} )

/**
 * Loops through the foreground colors and sets the getters for them
 * Sets both foreground & background color getters
 */
Object.keys( ansi_codes.fg ).forEach( ( color ) => {
    if ( color == 'bright' ) {
        return
    }

    define_get( color, function() {
        if ( this._modifier != 'fg' && this._modifier != 'bg' ) {
            this._modifier = 'fg'
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

/**
 * Loops through the reset modifiers and sets the getters for them
 * Sets both decoration & reset modifier getters
 */
Object.keys( ansi_codes.reset ).forEach( ( decoration ) => {
    if ( decoration == 'fg' || decoration == 'bg' || decoration == 'all' ) {
        let name = decoration

        if ( decoration != 'all' ) {
            name = `reset_${decoration}`
        }

        define_get( name, function() {
            this._modifier = 'reset'
            this.write( ansi_codes[this._modifier][decoration] )
            this._modifier = ''
            this._bright = false
            return this
        } )
        return
    }

    define_get( decoration, function() {
        if ( this._modifier != 'modifier' && this._modifier != 'reset' ) {
            this._modifier = 'modifier'
        }

        this.write( ansi_codes[this._modifier][decoration] )

        if ( this._modifier == 'reset' ) {
            this._modifier = ''
            this._bright = false
        }

        return this
    } )
} )

// eslint-disable-next-line no-multi-assign
module.exports = exports = function( options ) {
    return new Logger( options )
}
