require( "mocha" )
const assert = require( "assert" )

const logger = require( "../../" )
const { capture_stream, set_expected } = require( "./helpers" )

describe( "buffer", function () {
    let output

    beforeEach( function () {
        output = capture_stream( process.stdout )
    } )

    afterEach( function () {
        output.unhook()
    } )

    it( "should enable output - no option", function () {
        var expected = set_expected( "Logger test" )

        logger()
            .write( "Logger test" )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should enable output - with option", function () {
        var expected = set_expected( "Logger test" )

        logger( { buffer: false } )
            .write( "Logger test" )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should disable output", function () {
        var expected = set_expected( "Logger test" )

        logger( { buffer: true } )
            .write( "Logger test" )
            .end
        assert.notStrictEqual( output.captured(), expected )
    } )

    it( "should return output", function () {
        var expected = set_expected( "Logger test" )

        var actual = logger( { buffer: true } )
            .write( "Logger test" )
            .end
            .return
        assert.strictEqual( actual, expected )
        assert.notStrictEqual( output.captured(), expected )
    } )

    it( "should output part, return all", function () {
        var expected_output = set_expected( "Logger", "HH:mm:ss", false )
        var expected_return = set_expected( "Logger test" )

        var actual = logger( { buffer: true } )
            .write( "Logger" )
            .output
            .write( " test" )
            .end
            .return
        assert.strictEqual( output.captured(), expected_output )
        assert.strictEqual( actual, expected_return )

        // Vanity purposes, puts result on next line
        console.log()
    } )
} )
