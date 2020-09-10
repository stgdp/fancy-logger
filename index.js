const ansi_codes = require( "@stgdp/ansi-codes" )

class Logger {

    constructor( options ) {
        this.stdout = process.stdout
        this.options = options

        this._set_fg()
        this._set_bg()
        this._set_mods()
        this._set_reset()

        this._write_timestamp()
    }

    fg( color ) {

        if ( color == "bright" || !( color in ansi_codes.fg ) ) {
            return this
        }

        let name = `fg_${color}`
        this[name]()

        return this
    }

    bg( color ) {

        if ( color == "bright" || !( color in ansi_codes.bg ) ) {
            return this
        }

        let name = `bg_${color}`
        this[name]()

        return this
    }

    modifier( options ) {
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

    reset( options = {} ) {

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

    write( data ) {
        this.stdout.write.apply( this.stdout, arguments )
        return this
    }

    end() {
        this.write( ansi_codes.reset.all )
        this.write( "\n" )
    }

    _write_timestamp() {
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

    _set_prototype( name, code ) {
        this[name] = function() {
            this.write( code )
            return this
        }
    }

    _set_fg() {
        var that = this
        Object.keys( ansi_codes.fg ).forEach( function( color ) {

            if ( color !== "bright" ) {
                let name = `fg_${color}`
                that._set_prototype( name, ansi_codes.fg[color] )
                that[color] = function() {
                    return that[name]()
                }
            } else {
                Object.keys( ansi_codes.fg.bright ).forEach( function( color ) {
                    let name = `fg_bright_${color}`
                    that._set_prototype( name, ansi_codes.fg.bright[color] )
                    that[`bright_${color}`] = function() {
                        return that[name]()
                    }
                } )
            }

        } )
    }

    _set_bg() {
        var that = this
        Object.keys( ansi_codes.bg ).forEach( function( color ) {

            if ( color !== "bright" ) {
                that._set_prototype( `bg_${color}`, ansi_codes.bg[color] )
            } else {
                Object.keys( ansi_codes.bg.bright ).forEach( function( color ) {
                    that._set_prototype( `bg_bright_${color}`, ansi_codes.bg.bright[color] )
                } )
            }

        } )
    }

    _set_mods() {
        var that = this
        Object.keys( ansi_codes.modifier ).forEach( function( mod ) {
            let name = `mod_${mod}`
            that._set_prototype( name, ansi_codes.modifier[mod] )
            that[mod] = function() {
                return that[name]()
            }
        } )
    }

    _set_reset() {
        var that = this
        Object.keys( ansi_codes.reset ).forEach( function( reset ) {
            that._set_prototype( `reset_${reset}`, ansi_codes.reset[reset] )
        } )
    }
}

module.exports = exports = function( options ) {
    return new Logger( options )
}
