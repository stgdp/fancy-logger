require( "mocha" )
const assert = require( "assert" )

const fs = require( "fs" )
const path = require( "path" )
const strip_ansi = require( "strip-ansi" )

const logger = require( "../../" )
const { get_file, set_expected } = require( "./helpers" )

describe( "file", function () {
    if ( fs.existsSync( './test/logs' ) ) {
        fs.rmSync( "./test/logs", { recursive: true } )
    }

    it( "should write a log file - with path.resolve", function () {
        var expected = strip_ansi( set_expected( "Logger test" ) ),
            file_name = path.resolve( "./test/logs/file-1.log" )

        logger( {
            file: file_name,
            buffer: true
        } )
            .write( "Logger test" )
            .end
            .to_file()

        var actual = get_file( file_name )

        assert.strictEqual( expected, actual )
    } )

    it( "should write a log file - without path.resolve", function () {
        var expected = strip_ansi( set_expected( "Logger test" ) ),
            file_name = "./test/logs/file-2.log"

        logger( {
            file: file_name,
            buffer: true
        } )
            .write( "Logger test" )
            .end
            .to_file()

        var actual = get_file( path.resolve( file_name ) )

        assert.strictEqual( expected, actual )
    } )

    it( "should replace the file name", function () {
        var expected = strip_ansi( set_expected( "Logger test" ) ),
            file_name_original = "./test/logs/file-3-false.log",
            file_name_changed = "./test/logs/file-3.log"

        logger( {
            file: file_name_original,
            buffer: true
        } )
            .write( "Logger test" )
            .end
            .to_file( file_name_changed )

        var actual = get_file( path.resolve( file_name_changed ) )

        assert.strictEqual( expected, actual )
    } )

    it( "should append to the log file", function () {
        var expected = strip_ansi( set_expected( "Logger test" ) ),
            file_name = "./test/logs/file-4.log"

        logger( {
            file: file_name,
            buffer: true
        } )
            .write( "Logger test" )
            .end
            .to_file()

        expected += strip_ansi( set_expected( "Hello world!" ) )

        logger( {
            file: file_name,
            buffer: true
        } )
            .write( "Hello world!" )
            .end
            .to_file()

        var actual = get_file( path.resolve( file_name ) )

        assert.strictEqual( expected, actual )
    } )

    it( "should write multiple files", function () {
        var expected_1 = strip_ansi( set_expected( "Logger test" ) ),
            expected_2 = expected_1 + "Hello world!\n",
            file_name_1 = "./test/logs/file-5-1.log",
            file_name_2 = "./test/logs/file-5-2.log"

        logger( {
            file: file_name_1,
            buffer: true
        } )
            .write( "Logger test" )
            .end
            .to_file()
            .write( "Hello world!" )
            .end
            .to_file( file_name_2 )

        var actual_1 = get_file( path.resolve( file_name_1 ) ),
            actual_2 = get_file( path.resolve( file_name_2 ) )

        assert.strictEqual( expected_1, actual_1 )
        assert.strictEqual( expected_2, actual_2 )
    } )
} )
