require( 'mocha' )
const assert = require( 'assert' )

const ansi_codes = require( '@stgdp/ansi-codes' )

const logger = require( '../../' )
const { capture_stream, set_expected } = require( './helpers' )

describe( 'Background modifiers', () => {
    let output

    beforeEach( () => {
        output = capture_stream( process.stdout )
    } )

    afterEach( () => {
        output.unhook()
    } )

    Object.keys( ansi_codes.bg ).forEach( ( color ) => {
        if ( color != 'bright' ) {
            it( `should be ${color}`, () => {
                const expected = set_expected( `${ansi_codes.bg[color]}Logger test` )

                logger()
                    .bg[color]
                    .write( 'Logger test' )
                    .end
                assert.strictEqual( output.captured(), expected )
            } )
        } else {
            Object.keys( ansi_codes.bg.bright ).forEach( ( bright ) => {
                it( `should be bright ${bright}`, () => {
                    const expected = set_expected( `${ansi_codes.bg.bright[bright]}Logger test` )

                    logger()
                        .bg.bright[bright]
                        .write( 'Logger test' )
                        .end
                    assert.strictEqual( output.captured(), expected )
                } )
            } )
        }
    } )
} )
