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

Logger.prototype.fg = function() {
    return this
}

function set_prototype( name, code ) {
    Logger.prototype[name] = function() {
        this.write( code )
        return this
    }
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

Object.keys( ansi_codes.bg ).forEach( function( color ) {

    if ( color !== "bright" ) {
        set_prototype( `bg_${color}`, ansi_codes.bg[color] )
    } else {
        Object.keys( ansi_codes.bg.bright ).forEach( function( color ) {
            set_prototype( `bg_bright_${color}`, ansi_codes.bg.bright[color] )
        } )
    }

} )

Object.keys( ansi_codes.modifier ).forEach( function( mod ) {
    let name = `mod_${mod}`
    set_prototype( name, ansi_codes.modifier[mod] )
    Logger.prototype[mod] = function() {
        return this[name]()
    }
} )

set_prototype( `reset`, ansi_codes.reset.all )

Object.keys( ansi_codes.reset ).forEach( function( reset ) {
    set_prototype( `reset_${reset}`, ansi_codes.reset[reset] )
} )
