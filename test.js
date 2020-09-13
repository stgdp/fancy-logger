require( "mocha" )
const assert = require( "assert" )

const ansi_codes = require( "@stgdp/ansi-codes" )
const fecha = require( "fecha" ).format
const logger = require( "./" )

function set_expected( content = "", timestamp = "HH:mm:ss" ) {
    var expected = ""

    if ( typeof timestamp === "string" ) {
        expected += get_timestamp( timestamp )
    }

    expected += content
    expected += ansi_codes.reset.all
    expected += "\n"

    return expected
}

function get_timestamp( format = "HH:mm:ss" ) {
    return `${ansi_codes.reset.all}[${ansi_codes.fg.bright.black}${fecha( new Date(), format )}${ansi_codes.reset.all}] - `
}

function captureStream( stream ) {
    var originalWrite = stream.write
    var buffer = ""

    stream.write = function ( chunk ) {
        buffer += chunk.toString()
        originalWrite.apply( stream, arguments )
    }

    return {
        unhook: function () {
            stream.write = originalWrite
        },
        reset: function () {
            stream.write = originalWrite
            return captureStream( stream )
        },
        captured: function () {
            return buffer
        }
    }
}

describe( "timestamps", function () {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    it( "should have a timestamp - no option", function () {
        var expected = set_expected( "Logger test" )

        logger()
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    it( "should have a timestamp - with option", function () {
        var expected = set_expected( "Logger test" )

        logger( { timestamp: true } )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    it( "should not have a timestamp", function () {
        var expected = set_expected( "Logger test", false )

        logger( { timestamp: false } )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    it( "should change the timestamp format", function() {
        var expected = set_expected( "Logger test", "YYYY-MM-DD HH:mm:ss" )

        logger( { format: "YYYY-MM-DD HH:mm:ss" } )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )
} )

describe( "buffer", function() {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    it ( "should enable output - no option", function() {
        var expected = set_expected( "Logger test" )

        logger()
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    it ( "should enable output - with option", function() {
        var expected = set_expected( "Logger test" )

        logger( { buffer: false } )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    it ( "should disable output", function() {
        var expected = set_expected( "Logger test" )

        logger( { buffer: true } )
            .write( "Logger test" )
            .end()
        assert.notStrictEqual( hook.captured(), expected )
    } )

    it ( "should return output", function() {
        var expected = set_expected( "Logger test" )

        var actual = logger( { buffer: true } )
            .write( "Logger test" )
            .return()
        assert.strictEqual( actual, expected )
        assert.notStrictEqual( hook.captured(), expected )
    } )

    it ( "should output part, return all", function() {
        var expected_output = get_timestamp() + "Logger"
        var expected_return = set_expected( "Logger test" )

        var actual = logger( { buffer: true } )
            .write( "Logger" )
            .output()
            .write( " test" )
            .return()
        assert.strictEqual( hook.captured(), expected_output )
        assert.strictEqual( actual, expected_return )

        // Vanity purposes, puts result on next line
        console.log()
    } )
} )

function loop_ansi( area ) {

}

describe( "foreground", function () {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    Object.keys( ansi_codes.fg ).forEach( function( color ) {
        if ( color != "bright" ) {
            it ( `should be ${color} - with fg`, function() {
                var expected = set_expected( `${ansi_codes.fg[color]}Logger test` )

                logger()
                    .fg[color]
                    .write( "Logger test" )
                    .end()
                assert.strictEqual( hook.captured(), expected )
            } )

            it ( `should be ${color} - without fg`, function() {
                var expected = set_expected( `${ansi_codes.fg[color]}Logger test` )

                logger()
                    [color]
                    .write( "Logger test" )
                    .end()
                assert.strictEqual( hook.captured(), expected )
            } )
        } else {
            Object.keys( ansi_codes.fg.bright ).forEach( function( bright ) {
                it ( `should be bright ${bright} - with fg`, function() {
                    var expected = set_expected( `${ansi_codes.fg.bright[bright]}Logger test` )

                    logger()
                        .fg.bright[bright]
                        .write( "Logger test" )
                        .end()
                    assert.strictEqual( hook.captured(), expected )
                } )

                it ( `should be bright ${bright} - without fg`, function() {
                    var expected = set_expected( `${ansi_codes.fg.bright[bright]}Logger test` )

                    logger()
                        .bright[bright]
                        .write( "Logger test" )
                        .end()
                    assert.strictEqual( hook.captured(), expected )
                } )
            } )
        }
    } )
} )

describe( "background", function () {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    Object.keys( ansi_codes.bg ).forEach( function( color ) {
        if ( color != "bright" ) {
            it ( `should be ${color}`, function() {
                var expected = set_expected( `${ansi_codes.bg[color]}Logger test` )

                logger()
                    .bg[color]
                    .write( "Logger test" )
                    .end()
                assert.strictEqual( hook.captured(), expected )
            } )
        } else {
            Object.keys( ansi_codes.bg.bright ).forEach( function( bright ) {
                it ( `should be bright ${bright}`, function() {
                    var expected = set_expected( `${ansi_codes.bg.bright[bright]}Logger test` )

                    logger()
                        .bg.bright[bright]
                        .write( "Logger test" )
                        .end()
                    assert.strictEqual( hook.captured(), expected )
                } )
            } )
        }
    } )
} )

describe( "decorations", function () {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    Object.keys( ansi_codes.modifier ).forEach( function( decoration ) {
        it ( `should be ${decoration} - with decoration`, function() {
            var expected = set_expected( `${ansi_codes.modifier[decoration]}Logger test` )

            logger()
                .decoration[decoration]
                .write( "Logger test" )
                .end()
            assert.strictEqual( hook.captured(), expected )
        } )

        it ( `should be ${decoration} - without decoration`, function() {
            var expected = set_expected( `${ansi_codes.modifier[decoration]}Logger test` )

            logger()
                [decoration]
                .write( "Logger test" )
                .end()
            assert.strictEqual( hook.captured(), expected )
        } )
    } )
} )

describe( "reset", function () {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    it( "should start bold and change to normal - all - with reset", function () {
        var expected = set_expected( `${ansi_codes.modifier.bold}Logger${ansi_codes.reset.all} test` )

        logger()
            .bold
            .write( "Logger" )
            .reset.all
            .write( " test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    it( "should start bold and change to normal - all - without reset", function () {
        var expected = set_expected( `${ansi_codes.modifier.bold}Logger${ansi_codes.reset.all} test` )

        logger()
            .bold
            .write( "Logger" )
            .all
            .write( " test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    Object.keys( ansi_codes.reset ).forEach( function( reset ) {
        if ( reset == "all" ) {
            return
        }

        if ( reset == "fg" || reset == "bg" ) {
            it ( `should start ${reset} red and change to normal - specific`, function() {
                var expected = set_expected( `${ansi_codes[reset].red}Logger${ansi_codes.reset[reset]} test` )

                logger()
                    [reset].red
                    .write( "Logger" )
                    [`reset_${reset}`]
                    .write( " test" )
                    .end()
                assert.strictEqual( hook.captured(), expected )
            } )
        } else {
            it ( `should start ${reset} and change to normal - specific`, function() {
                var expected = set_expected( `${ansi_codes.modifier[reset]}Logger${ansi_codes.reset[reset]} test` )

                logger()
                    [reset]
                    .write( "Logger" )
                    .reset[reset]
                    .write( " test" )
                    .end()
                assert.strictEqual( hook.captured(), expected )
            } )
        }
    } )
} )


describe( "chaining", function () {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    it( "should be bold, blue fg and yellow bg", function () {
        var expected = set_expected( `${ansi_codes.modifier.bold}${ansi_codes.fg.blue}${ansi_codes.bg.yellow}Logger test` )

        logger()
            .bold
            .blue
            .bg.yellow
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )
} )
