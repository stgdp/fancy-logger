require( "mocha" )
const assert = require( "assert" )

const ansi_codes = require( "@stgdp/ansi-codes" )
const logger = require( "./" )

function get_timestamp() {
    var time = new Date()
    var timestamp = ""

    timestamp += ansi_codes.reset.all
    timestamp += "["
    timestamp += ansi_codes.fg.bright.black
    timestamp += ( "0" + time.getHours() ).slice( -2 ) + ":"
    timestamp += ( "0" + time.getMinutes() ).slice( -2 ) + ":"
    timestamp += ( "0" + time.getSeconds() ).slice( -2 )
    timestamp += ansi_codes.reset.fg
    timestamp += "] - "

    return timestamp
}

function captureStream( stream ) {
    var originalWrite = stream.write
    var buffer = ''

    stream.write = function ( chunk ) {
        buffer += chunk.toString() // chunk is a String or Buffer
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

    it( "should have a timestamp", function () {
        var expected = get_timestamp() + "Logger test" + ansi_codes.reset.all + "\n"

        logger()
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )

        hook.reset()
        logger( { timestamp: true } )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    it( "should not have a timestamp", function () {
        var expected = "Logger test" + ansi_codes.reset.all + "\n"

        logger( { timestamp: false } )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )
} )

describe( "foreground", function () {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    it( "should be red", function () {
        var expected = get_timestamp() + ansi_codes.fg.red + "Logger test" + ansi_codes.reset.all + "\n"

        logger()
            .fg( "red" )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )

        hook.reset()
        logger()
            .red()
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )

        hook.reset()
        logger()
            .fg_red()
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
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

    it( "should be red", function () {
        var expected = get_timestamp() + ansi_codes.bg.red + "Logger test" + ansi_codes.reset.all + "\n"

        logger()
            .bg( "red" )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )

        hook.reset()
        logger()
            .bg_red()
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )
} )

describe( "modifiers", function () {
    var hook

    beforeEach( function () {
        hook = captureStream( process.stdout )
    } )

    afterEach( function () {
        hook.unhook()
    } )

    it( "should be bold", function () {
        var expected = get_timestamp() + ansi_codes.modifier.bold + "Logger test" + ansi_codes.reset.all + "\n"

        logger()
            .bold()
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )

        hook.reset()
        logger()
            .modifier( { bold: true } )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
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

    it( "should be bold, blue foreground and yellow background", function () {
        var expected = get_timestamp() + ansi_codes.modifier.bold + ansi_codes.fg.blue + ansi_codes.bg.yellow + "Logger test" + ansi_codes.reset.all + "\n"

        logger()
            .modifier( { bold: true } )
            .fg( "blue" )
            .bg( "yellow" )
            .write( "Logger test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
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

    it( "should be start bold and change to normal - specific", function () {
        var expected = get_timestamp() + ansi_codes.modifier.bold + "Logger" + ansi_codes.reset.bold + " test" + ansi_codes.reset.all + "\n"

        logger()
            .modifier( { bold: true } )
            .write( "Logger" )
            .reset( { bold: true } )
            .write( " test" )
            .end()
        assert.strictEqual( hook.captured(), expected )

        hook.reset()
        logger()
            .modifier( { bold: true } )
            .write( "Logger" )
            .reset_bold()
            .write( " test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )

    it( "should be start bold and change to normal - all", function () {
        var expected = get_timestamp() + ansi_codes.modifier.bold + "Logger" + ansi_codes.reset.all + " test" + ansi_codes.reset.all + "\n"

        logger()
            .modifier( { bold: true } )
            .write( "Logger" )
            .reset( { all: true } )
            .write( " test" )
            .end()
        assert.strictEqual( hook.captured(), expected )

        hook.reset()
        logger()
            .modifier( { bold: true } )
            .write( "Logger" )
            .reset()
            .write( " test" )
            .end()
        assert.strictEqual( hook.captured(), expected )

        hook.reset()
        logger()
            .modifier( { bold: true } )
            .write( "Logger" )
            .reset_all()
            .write( " test" )
            .end()
        assert.strictEqual( hook.captured(), expected )
    } )
} )
