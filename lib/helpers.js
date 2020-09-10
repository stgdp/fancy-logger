const ansi_codes = require( "@stgdp/ansi-codes" )

function _set_prototype( name, code ) {
    this[name] = function () {
        this.write( code )
        return this
    }
}

function _set_fg() {
    var that = this
    Object.keys( ansi_codes.fg ).forEach( function ( color ) {

        if ( color !== "bright" ) {
            let name = `fg_${color}`
            that._set_prototype( name, ansi_codes.fg[color] )
            that[color] = function () {
                return that[name]()
            }
        } else {
            Object.keys( ansi_codes.fg.bright ).forEach( function ( color ) {
                let name = `fg_bright_${color}`
                that._set_prototype( name, ansi_codes.fg.bright[color] )
                that[`bright_${color}`] = function () {
                    return that[name]()
                }
            } )
        }

    } )
}

function _set_bg() {
    var that = this
    Object.keys( ansi_codes.bg ).forEach( function ( color ) {

        if ( color !== "bright" ) {
            that._set_prototype( `bg_${color}`, ansi_codes.bg[color] )
        } else {
            Object.keys( ansi_codes.bg.bright ).forEach( function ( color ) {
                that._set_prototype( `bg_bright_${color}`, ansi_codes.bg.bright[color] )
            } )
        }

    } )
}

function _set_mods() {
    var that = this
    Object.keys( ansi_codes.modifier ).forEach( function ( mod ) {
        let name = `mod_${mod}`
        that._set_prototype( name, ansi_codes.modifier[mod] )
        that[mod] = function () {
            return that[name]()
        }
    } )
}

function _set_reset() {
    var that = this
    Object.keys( ansi_codes.reset ).forEach( function ( reset ) {
        that._set_prototype( `reset_${reset}`, ansi_codes.reset[reset] )
    } )
}

module.exports = exports = {
    _set_prototype,
    _set_fg,
    _set_bg,
    _set_mods,
    _set_reset
}