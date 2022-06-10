require( 'mocha' )
const assert = require( 'assert' )

const ansi_codes = require( '@stgdp/ansi-codes' )

const logger = require( '../../' )
const { capture_stream, set_expected } = require( './helpers' )

describe( 'reset', () => {
    let output

    beforeEach( () => {
        output = capture_stream( process.stdout )
    } )

    afterEach( () => {
        output.unhook()
    } )

    it( 'should start bold and change to normal - all - with reset', () => {
        const expected = set_expected( `${ansi_codes.modifier.bold}Logger${ansi_codes.reset.all} test` )

        logger()
            .bold
            .write( 'Logger' )
            .reset.all
            .write( ' test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( 'should start bold and change to normal - all - without reset', () => {
        const expected = set_expected( `${ansi_codes.modifier.bold}Logger${ansi_codes.reset.all} test` )

        logger()
            .bold
            .write( 'Logger' )
            .all
            .write( ' test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    Object.keys( ansi_codes.reset ).forEach( ( reset ) => {
        if ( reset == 'all' ) {
            return
        }

        if ( reset == 'fg' || reset == 'bg' ) {
            it( `should start ${reset} red and change to normal - specific`, () => {
                const expected = set_expected( `${ansi_codes[reset].red}Logger${ansi_codes.reset[reset]} test` )

                /* eslint-disable no-unexpected-multiline */
                logger()
                    [reset].red
                    .write( 'Logger' )
                    [`reset_${reset}`]
                    .write( ' test' )
                    .end
                /* eslint-enable no-unexpected-multiline */
                assert.strictEqual( output.captured(), expected )
            } )
        } else {
            it( `should start ${reset} and change to normal - specific`, () => {
                const expected = set_expected( `${ansi_codes.modifier[reset]}Logger${ansi_codes.reset[reset]} test` )

                /* eslint-disable no-unexpected-multiline */
                logger()
                    [reset]
                    .write( 'Logger' )
                    .reset[reset]
                    .write( ' test' )
                    .end
                /* eslint-enable no-unexpected-multiline */
                assert.strictEqual( output.captured(), expected )
            } )
        }
    } )
} )
