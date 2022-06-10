require( 'mocha' )
const assert = require( 'assert' )

const ansi_codes = require( '@stgdp/ansi-codes' )

const logger = require( '../../' )
const { capture_stream, set_expected } = require( './helpers' )

describe( 'chaining', () => {
    let output

    beforeEach( () => {
        output = capture_stream( process.stdout )
    } )

    afterEach( () => {
        output.unhook()
    } )

    it( 'should be bold, blue fg and yellow bg', () => {
        const expected = set_expected( `${ansi_codes.modifier.bold}${ansi_codes.fg.blue}${ansi_codes.bg.yellow}Logger test` )

        logger()
            .bold
            .blue
            .bg.yellow
            .write( 'Logger test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )
} )
