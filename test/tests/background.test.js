require( "mocha" )
const assert = require( "assert" )

const ansi_codes = require( "@stgdp/ansi-codes" )

const logger = require( "../../" )
const { capture_stream, set_expected } = require( "./helpers" )

describe( "background", function () {
    let output

    beforeEach( function () {
        output = capture_stream( process.stdout )
    } )

    afterEach( function () {
        output.unhook()
    } )

    Object.keys( ansi_codes.bg ).forEach( function ( color ) {
        if ( color != "bright" ) {
            it( `should be ${color}`, function () {
                var expected = set_expected( `${ansi_codes.bg[color]}Logger test` )

                logger()
                    .bg[color]
                    .write( "Logger test" )
                    .end
                assert.strictEqual( output.captured(), expected )
            } )
        } else {
            Object.keys( ansi_codes.bg.bright ).forEach( function ( bright ) {
                it( `should be bright ${bright}`, function () {
                    var expected = set_expected( `${ansi_codes.bg.bright[bright]}Logger test` )

                    logger()
                        .bg.bright[bright]
                        .write( "Logger test" )
                        .end
                    assert.strictEqual( output.captured(), expected )
                } )
            } )
        }
    } )
} )
