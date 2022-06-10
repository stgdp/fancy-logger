require( 'mocha' )
const assert = require( 'assert' )

const ansi_codes = require( '@stgdp/ansi-codes' )

const logger = require( '../../' )
const { capture_stream, set_expected } = require( './helpers' )

describe( 'Foreground modifiers', () => {
    let output

    beforeEach( () => {
        output = capture_stream( process.stdout )
    } )

    afterEach( () => {
        output.unhook()
    } )

    Object.keys( ansi_codes.fg ).forEach( ( color ) => {
        if ( color != 'bright' ) {
            it( `should be ${color} - with fg`, () => {
                const expected = set_expected( `${ansi_codes.fg[color]}Logger test` )

                logger()
                    .fg[color]
                    .write( 'Logger test' )
                    .end
                assert.strictEqual( output.captured(), expected )
            } )

            it( `should be ${color} - without fg`, () => {
                const expected = set_expected( `${ansi_codes.fg[color]}Logger test` )

                /* eslint-disable no-unexpected-multiline */
                logger()
                    [color]
                    .write( 'Logger test' )
                    .end
                /* eslint-enable no-unexpected-multiline */
                assert.strictEqual( output.captured(), expected )
            } )
        } else {
            Object.keys( ansi_codes.fg.bright ).forEach( ( bright ) => {
                it( `should be bright ${bright} - with fg`, () => {
                    const expected = set_expected( `${ansi_codes.fg.bright[bright]}Logger test` )

                    logger()
                        .fg.bright[bright]
                        .write( 'Logger test' )
                        .end
                    assert.strictEqual( output.captured(), expected )
                } )

                it( `should be bright ${bright} - without fg`, () => {
                    const expected = set_expected( `${ansi_codes.fg.bright[bright]}Logger test` )

                    logger()
                        .bright[bright]
                        .write( 'Logger test' )
                        .end
                    assert.strictEqual( output.captured(), expected )
                } )
            } )
        }
    } )
} )
