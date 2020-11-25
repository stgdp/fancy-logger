require( "mocha" )
const assert = require( "assert" )

const logger = require( "../../" )
const { capture_stream, set_expected } = require( "./helpers" )

describe( "timestamps", function () {
    let output

    beforeEach( function () {
        output = capture_stream( process.stdout )
    } )

    afterEach( function () {
        output.unhook()
    } )

    it( "should have a timestamp - no option", function () {
        var expected = set_expected( "Logger test" )

        logger()
            .write( "Logger test" )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should have a timestamp - with option", function () {
        var expected = set_expected( "Logger test" )

        logger( { timestamp: true } )
            .write( "Logger test" )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should not have a timestamp", function () {
        var expected = set_expected( "Logger test", false )

        logger( { timestamp: false } )
            .write( "Logger test" )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should change the timestamp format", function () {
        var expected = set_expected( "Logger test", "YYYY-MM-DD HH:mm:ss" )

        logger( { format: "YYYY-MM-DD HH:mm:ss" } )
            .write( "Logger test" )
            .end
        assert.strictEqual( output.captured(), expected )
    } )
} )
