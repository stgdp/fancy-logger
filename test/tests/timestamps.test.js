require( 'mocha' )
const assert = require( 'assert' )

const logger = require( '../../' )
const { capture_stream, set_expected } = require( './helpers' )

describe( 'timestamps', () => {
    let output

    beforeEach( () => {
        output = capture_stream( process.stdout )
    } )

    afterEach( () => {
        output.unhook()
    } )

    it( 'should have a timestamp - no option', () => {
        const expected = set_expected( 'Logger test' )

        logger()
            .write( 'Logger test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( 'should have a timestamp - with option', () => {
        const expected = set_expected( 'Logger test' )

        logger( { timestamp: true } )
            .write( 'Logger test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( 'should not have a timestamp', () => {
        const expected = set_expected( 'Logger test', false )

        logger( { timestamp: false } )
            .write( 'Logger test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( 'should change the timestamp format', () => {
        const expected = set_expected( 'Logger test', 'YYYY-MM-DD HH:mm:ss' )

        logger( { format: 'YYYY-MM-DD HH:mm:ss' } )
            .write( 'Logger test' )
            .end
        assert.strictEqual( output.captured(), expected )
    } )
} )
