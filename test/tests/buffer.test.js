require( 'mocha' )
const assert = require( 'assert' )

const logger = require( '../../' )
const { capture_stream, set_expected } = require( './helpers' )

describe( 'buffer', () => {
    let output

    beforeEach( () => {
        output = capture_stream( process.stdout )
    } )

    afterEach( () => {
        output.unhook()
    } )

    it( 'should enable output - no option', () => {
        const expected = set_expected( 'Logger test' )

        logger()
            .write( 'Logger test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( 'should enable output - with option', () => {
        const expected = set_expected( 'Logger test' )

        logger( { buffer: false } )
            .write( 'Logger test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( 'should disable output', () => {
        const expected = set_expected( 'Logger test' )

        logger( { buffer: true } )
            .write( 'Logger test' )
            .end
        assert.notStrictEqual( output.captured(), expected )
    } )

    it( 'should return output', () => {
        const expected = set_expected( 'Logger test' )

        const actual = logger( { buffer: true } )
            .write( 'Logger test' )
            .end
            .return
        assert.strictEqual( actual, expected )
        assert.notStrictEqual( output.captured(), expected )
    } )

    it( 'should output part, return all', () => {
        const expected_output = set_expected( 'Logger', 'HH:mm:ss', false )
        const expected_return = set_expected( 'Logger test' )

        const actual = logger( { buffer: true } )
            .write( 'Logger' )
            .output
            .write( ' test' )
            .end
            .return
        assert.strictEqual( output.captured(), expected_output )
        assert.strictEqual( actual, expected_return )

        // Vanity purposes, puts result on next line
        console.log()
    } )
} )
