require( 'mocha' )
const assert = require( 'assert' )

const ansi_codes = require( '@stgdp/ansi-codes' )

const logger = require( '../../' )
const { capture_stream, set_expected } = require( './helpers' )

describe( 'decorations', () => {
    let output

    beforeEach( () => {
        output = capture_stream( process.stdout )
    } )

    afterEach( () => {
        output.unhook()
    } )

    Object.keys( ansi_codes.modifier ).forEach( ( decoration ) => {
        it( `should be ${decoration} - with decoration`, () => {
            const expected = set_expected( `${ansi_codes.modifier[decoration]}Logger test` )

            logger()
                .decoration[decoration]
                .write( 'Logger test' )
                .end
            assert.strictEqual( output.captured(), expected )
        } )

        it( `should be ${decoration} - without decoration`, () => {
            const expected = set_expected( `${ansi_codes.modifier[decoration]}Logger test` )

            /* eslint-disable no-unexpected-multiline */
            logger()
                [decoration]
                .write( 'Logger test' )
                .end
            /* eslint-enable no-unexpected-multiline */
            assert.strictEqual( output.captured(), expected )
        } )
    } )
} )
