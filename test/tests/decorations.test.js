require( "mocha" )
const assert = require( "assert" )

const ansi_codes = require( "@stgdp/ansi-codes" )

const logger = require( "../../" )
const { capture_stream, set_expected } = require( "./helpers" )

describe( "decorations", function () {
    let output

    beforeEach( function () {
        output = capture_stream( process.stdout )
    } )

    afterEach( function () {
        output.unhook()
    } )

    Object.keys( ansi_codes.modifier ).forEach( function ( decoration ) {
        it( `should be ${decoration} - with decoration`, function () {
            var expected = set_expected( `${ansi_codes.modifier[decoration]}Logger test` )

            logger()
                .decoration[decoration]
                .write( "Logger test" )
                .end
            assert.strictEqual( output.captured(), expected )
        } )

        it( `should be ${decoration} - without decoration`, function () {
            var expected = set_expected( `${ansi_codes.modifier[decoration]}Logger test` )

            logger()
            [decoration]
                .write( "Logger test" )
                .end
            assert.strictEqual( output.captured(), expected )
        } )
    } )
} )
