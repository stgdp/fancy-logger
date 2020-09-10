const ansi_codes = require( "@stgdp/ansi-codes" )

function fg( color ) {
    let name = `fg_${color}`

    if ( typeof this[name] !== "function" ) {
        return this
    }

    this[name]()

    return this
}

function bg( color ) {
    let name = `bg_${color}`

    if ( typeof this[name] !== "function" ) {
        return this
    }

    this[name]()

    return this
}

function modifier( options ) {

    if ( typeof options === "string" ) {

        if ( !( options in ansi_codes.modifier ) ) {
            options = {}
        } else {
            this[`mod_${options}`]()
            return this
        }

    }

    if ( options == null || typeof options !== "object" || Object.keys( options ).length === 0 ) {
        return this
    }

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

    Object.keys( options ).forEach( function ( mod ) {

        if ( !( mod in default_options ) ) {
            return
        }

        if ( !!options[mod] ) {
            _this[mod]()
        }

    } )

    return this
}

function reset( options = {} ) {

    if ( typeof options === "string" ) {

        if ( !( options in ansi_codes.reset ) ) {
            options = {}
        } else {
            this[`reset_${options}`]()
            return this
        }

    }

    if ( options == null || typeof options !== "object" ) {
        options = {}
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

    Object.keys( options ).forEach( function ( option ) {

        if ( !( option in default_options ) ) {
            return
        }

        if ( !!options[option] ) {
            _this[`reset_${option}`]()
        }


    } )

    return this
}

module.exports = exports = {
    fg,
    bg,
    modifier,
    reset
}