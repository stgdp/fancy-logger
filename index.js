const ansi_codes = require( "@stgdp/ansi-codes" )

function Logger( options ) {

    if ( !( this instanceof Logger ) ) {
        return new Logger( options )
    }

    this.stdout = process.stdout
    this.options = options

    this.write_timestamp()
}

module.exports = exports = Logger

Logger.prototype.write_timestamp = function() {
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

Logger.prototype.write = function( data ) {
    this.stdout.write.apply( this.stdout, arguments )
    return this
}

Logger.prototype.end = function() {
    this.write( ansi_codes.reset.all )
    this.write( "\n" )
}

function set_prototype( name, code ) {
    Logger.prototype[name] = function() {
        this.write( code )
        return this
    }
}

Logger.prototype.fg = function( color ) {

    if ( color == "bright" || !( color in ansi_codes.fg ) ) {
        return this
    }

    let name = `fg_${color}`
    this[name]()

    return this
}

Object.keys( ansi_codes.fg ).forEach( function( color ) {

    if ( color !== "bright" ) {
        let name = `fg_${color}`
        set_prototype( name, ansi_codes.fg[color] )
        Logger.prototype[color] = function() {
            return this[name]()
        }
    } else {
        Object.keys( ansi_codes.fg.bright ).forEach( function( color ) {
            let name = `fg_bright_${color}`
            set_prototype( name, ansi_codes.fg.bright[color] )
            Logger.prototype[`bright_${color}`] = function() {
                return this[name]()
            }
        } )
    }

} )

Logger.prototype.bg = function( color ) {

    if ( color == "bright" || !( color in ansi_codes.bg ) ) {
        return this
    }

    let name = `bg_${color}`
    this[name]()

    return this
}

Object.keys( ansi_codes.bg ).forEach( function( color ) {

    if ( color !== "bright" ) {
        set_prototype( `bg_${color}`, ansi_codes.bg[color] )
    } else {
        Object.keys( ansi_codes.bg.bright ).forEach( function( color ) {
            set_prototype( `bg_bright_${color}`, ansi_codes.bg.bright[color] )
        } )
    }

} )

Logger.prototype.modifier = function( options ) {
    let default_options = {
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

    options = Object.assign( default_options, options )

    let _this = this

    Object.keys( options ).forEach( function( mod ) {

        if ( !( mod in default_options ) ) {
            return
        }

        if ( !!options[mod] ) {
            _this[mod]()
        }

    } )

    return this
}

Object.keys( ansi_codes.modifier ).forEach( function( mod ) {
    let name = `mod_${mod}`
    set_prototype( name, ansi_codes.modifier[mod] )
    Logger.prototype[mod] = function() {
        return this[name]()
    }
} )

Logger.prototype.reset = function( options = {} ) {

    if ( typeof options === "string" ) {

        if ( !( options in ansi_codes.reset ) ) {
            options = {}
        } else {
            this[`reset_${options}`]()
            return this
        }

    }

    if ( Object.keys( options ).length === 0 ) {
        this.write( ansi_codes.reset.all )
        return this
    }


    let default_options = {
        all: false,
        bold: false,
        dim: false,
        italic: false,
        underline: false,
        inverse: false,
        hidden: false,
        strike: false,
        fg: false,
        bg: false,
        frame: false,
        encircle: false,
        overline: false,
    }

    options = Object.assign( default_options, options )

    let _this = this

    Object.keys( options ).forEach( function( option ) {

        if ( !( option in default_options ) ) {
            return
        }

        if ( !!options[option] ) {
            _this[`reset_${option}`]()
        }


    } )

    return this
}

Object.keys( ansi_codes.reset ).forEach( function( reset ) {
    set_prototype( `reset_${reset}`, ansi_codes.reset[reset] )
} )
