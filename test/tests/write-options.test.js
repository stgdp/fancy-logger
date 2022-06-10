require( "mocha" )
const assert = require( "assert" )

const ansi_codes = require( "@stgdp/ansi-codes" )

const logger = require( "../../" )
const { capture_stream, set_expected } = require( "./helpers" )

describe( "write options", function () {
    let output

    beforeEach( function () {
        output = capture_stream( process.stdout )
    } )

    afterEach( function () {
        output.unhook()
    } )

    it( "should become bold", function () {
        var expected = set_expected( `Logger ${ansi_codes.modifier.bold}test` )

        logger()
            .write( "Logger " )
            .write( "test", { decoration: { bold: true } } )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should become bold then reset", function () {
        var expected = set_expected( `Logger ${ansi_codes.modifier.bold}test ${ansi_codes.reset.bold}unbold` )

        logger()
            .write( "Logger " )
            .write( "test ", { decoration: { bold: true } } )
            .write( "unbold", { reset: { bold: true } } )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should become bright", function () {
        var expected = set_expected( `${ansi_codes.fg.cyan}Logger ${ansi_codes.fg.bright.cyan}test` )

        logger( {
            modifiers: {
                fg: 'cyan'
            }
        } )
            .write( "Logger " )
            .write( "test", { fg: 'cyan', bright: { fg: true } } )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should become bright then reset", function () {
        var expected = set_expected( `${ansi_codes.fg.cyan}Logger ${ansi_codes.fg.bright.cyan}test ${ansi_codes.fg.cyan}unbright` )

        logger( {
            modifiers: {
                fg: 'cyan'
            }
        } )
            .write( "Logger " )
            .write( "test ", { fg: 'cyan', bright: { fg: true } } )
            .write( "unbright", { fg: 'cyan', bright: { fg: false } } )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should become cyan", function () {
        var expected = set_expected( `Logger ${ansi_codes.fg.cyan}test` )

        logger()
            .write( "Logger " )
            .write( "test", { fg: 'cyan' } )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should become cyan then reset", function () {
        var expected = set_expected( `Logger ${ansi_codes.fg.cyan}test ${ansi_codes.reset.fg}uncolored` )

        logger()
            .write( "Logger " )
            .write( "test ", { fg: 'cyan' } )
            .write( "uncolored", { reset: { reset_fg: true } } )
            .end
        assert.strictEqual( output.captured(), expected )
    } )
} )