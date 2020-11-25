require( "mocha" )
const assert = require( "assert" )

const ansi_codes = require( "@stgdp/ansi-codes" )

const logger = require( "../../" )
const { capture_stream, set_expected } = require( "./helpers" )

describe( "default_modifiers", function () {
    let output

    beforeEach( function () {
        output = capture_stream( process.stdout )
    } )

    afterEach( function () {
        output.unhook()
    } )

    it( "should be bright red fg, yellow bg and italic - object", function () {
        var expected = set_expected( `${ansi_codes.fg.bright.red}${ansi_codes.bg.yellow}${ansi_codes.modifier.italic}Logger test` )

        logger({
            modifiers: {
                fg: "red",
                bg: "yellow",
                bright: {
                    fg: true,
                    bg: false
                },
                decoration: {
                    bold: false,
                    italic: true,
                }
            }
        })
            .write( "Logger test" )
            .end
        assert.strictEqual( output.captured(), expected )
    } )

    it( "should be bright red fg, yellow bg and italic - array", function () {
        var expected = set_expected( `${ansi_codes.fg.bright.red}${ansi_codes.bg.yellow}${ansi_codes.modifier.italic}Logger test` )

        logger({
            modifiers: {
                fg: "red",
                bg: "yellow",
                bright: [
                    "fg"
                ],
                decoration: [
                    "italic"
                ]
            }
        })
            .write( "Logger test" )
            .end
        assert.strictEqual( output.captured(), expected )
    } )
} )
