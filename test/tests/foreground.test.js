require( "mocha" )
const assert = require( "assert" )

const ansi_codes = require( "@stgdp/ansi-codes" )

const logger = require( "../../" )
const { capture_stream, set_expected } = require( "./helpers" )

describe( "foreground", function () {
    let output

    beforeEach( function () {
        output = capture_stream( process.stdout )
    } )

    afterEach( function () {
        output.unhook()
    } )

    Object.keys( ansi_codes.fg ).forEach( function ( color ) {
        if ( color != "bright" ) {
            it( `should be ${color} - with fg`, function () {
                var expected = set_expected( `${ansi_codes.fg[color]}Logger test` )

                logger()
                    .fg[color]
                    .write( "Logger test" )
                    .end
                assert.strictEqual( output.captured(), expected )
            } )

            it( `should be ${color} - without fg`, function () {
                var expected = set_expected( `${ansi_codes.fg[color]}Logger test` )

                logger()
                [color]
                    .write( "Logger test" )
                    .end
                assert.strictEqual( output.captured(), expected )
            } )
        } else {
            Object.keys( ansi_codes.fg.bright ).forEach( function ( bright ) {
                it( `should be bright ${bright} - with fg`, function () {
                    var expected = set_expected( `${ansi_codes.fg.bright[bright]}Logger test` )

                    logger()
                        .fg.bright[bright]
                        .write( "Logger test" )
                        .end
                    assert.strictEqual( output.captured(), expected )
                } )

                it( `should be bright ${bright} - without fg`, function () {
                    var expected = set_expected( `${ansi_codes.fg.bright[bright]}Logger test` )

                    logger()
                        .bright[bright]
                        .write( "Logger test" )
                        .end
                    assert.strictEqual( output.captured(), expected )
                } )
            } )
        }
    } )
} )
