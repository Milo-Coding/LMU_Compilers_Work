import { describe, it } from "node:test";
import assert from "assert";
import * as ohm from "ohm-js";

const grammars = {
  canadianPostalCode: String.raw`
    postalCode = firstletter digit nonfirstletter " " digit nonfirstletter digit
    nonfirstletter = "A".."C" | "E" | "G".."H" | "J".."N" | "P".."T" | "V".."Z"
    firstletter = nonfirstletter | "D" | "W"
  `,

  visa: String.raw`
      visa = "4" digit12or15
      digit12or15 = d d d d d d d d d d d d (d d d)?
      d = digit
    `,

  masterCard: String.raw`
      mastercard = leading5 | leading2
      leading5 = "5" "1".."5" digit14
      leading2 = "2" (twohundred | middle | sevenhundred) digit12

      twohundred = "2" (twenty | thirtyplus)
      twenty = "2" "1".."9"
      thirtyplus = "3".."9" d

      middle = "3".."6" d d

      sevenhundred = "7" ("0".."1" "0".."9" | "2" "0")

      digit12 = d d d d d d d d d d d d
      digit14 = d d d d d d d d d d d d d d
      d = digit
    `,

    notThreeEndingInOO: String.raw`
      legal = ~illigal l*
      illigal = l ("o" | "O") ("o" | "O") ~l
      l = "a".."z" | "A".."Z"
    `,

    divisibleBy16: String.raw`
      divby16 = notendingfourzeros* "0000" --big
              | "000" | "00" | "0"
      notendingfourzeros = ~endingfourzeros ("1" | "0")
      endingfourzeros = "0000" ~"0" ~"1"
    `,

    eightThroughThirtyTwo: String.raw`
      legal = "0"* (sub10 | tens | twenties | thirties)
      sub10 = "8".."9"
      tens = "1" digit
      twenties = "2" digit
      thirties = "3" "0".."2"
    `,

    notPythonPycharmPyc: String.raw`
      legal = ~illigal letter*
      illigal = ("python" | "pycharm" | "pyc") ~letter
    `,

    restrictedFloats: String.raw`
      float = digit* ("." digit*)? ("e" | "E") ("+" | "-")? digit digit? digit?
    `,

    palindromes2358: String.raw`
      palindrome = pal8 | pal5 | pal3 | pal2
legalletter = "a" | "b" | "c"
pal2 = "aa" | "bb" | "cc"
pal3 = ("a" legalletter "a") | ("b" legalletter "b") | ("c" legalletter "c")
pal4 = ("a" pal2 "a") | ("b" pal2 "b") | ("c" pal2 "c")
pal5 = ("a" pal3 "a") | ("b" pal3 "b") | ("c" pal3 "c")
pal6 = ("a" pal4 "a") | ("b" pal4 "b") | ("c" pal4 "c")
pal8 = ("a" pal6 "a") | ("b" pal6 "b") | ("c" pal6 "c")
    `,

    pythonStringLiterals: String.raw`
      stringliteral   =  stringprefix? (longstring | shortstring)
      stringprefix    =  "r" | "u" | "R" | "U" | "f" | "F"
                      | "fr" | "Fr" | "fR" | "FR" | "rf" | "rF" | "Rf" | "RF"
      shortstring     =  "'" shortstringitem* "'" | "\"" shortstringitem* "\""
      longstring      =  "'''" longstringitem* "'''" | "\"\"\"" longstringitem* "\"\"\""
      shortstringitem =  shortstringchar | stringescapeseq
      longstringitem  =  longstringchar | stringescapeseq
      shortstringchar =  ~"\\" ~newline ~"\"" ~"'" any
      longstringchar  =  ~"\\" ~"\"\"\"" ~"'''" any
      stringescapeseq =  "\\" any
      newline			= "\n" | "\r\n"
    `,
};

function matches(name, string) {
  const grammar = `G {${grammars[name]}}`;
  return ohm.grammar(grammar).match(string).succeeded();
}

const testFixture = {
  canadianPostalCode: {
    good: ["A7X 2P8", "P8E 4R2", "K1V 9P2", "Y3J 5C0"],
    bad: [
      "A7X   9B2",
      "C7E 9U2",
      "",
      "Dog",
      "K1V\t9P2",
      " A7X 2P8",
      "A7X 2P8 ",
    ],
  },
  visa: {
    good: ["4128976567772613", "4089655522138888", "4098562516243"],
    bad: [
      "43333",
      "42346238746283746823",
      "7687777777263211",
      "foo",
      "π",
      "4128976567772613 ",
    ],
  },
  masterCard: {
    good: [
      "5100000000000000",
      "5294837679998888",
      "5309888182838282",
      "5599999999999999",
      "2221000000000000",
      "2720999999999999",
      "2578930481258783",
      "2230000000000000",
    ],
    bad: [
      "5763777373890002",
      "513988843211541",
      "51398884321108541",
      "",
      "OH",
      "5432333xxxxxxxxx",
    ],
  },
    notThreeEndingInOO: {
      good: ["", "fog", "Tho", "one", "a", "ab", "food"],
      bad: ["fOo", "gOO", "HoO", "zoo", "MOO", "123", "A15"],
    },
    divisibleBy16: {
      good: [
        "0",
        "00",
        "000",
        "00000",
        "00000",
        "000000",
        "00000000",
        "1101000000",
      ],
      bad: ["1", "00000000100", "1000000001", "dog0000000"],
    },
    eightThroughThirtyTwo: {
      good: Array(25)
        .fill(0)
        .map((x, i) => i + 8),
      bad: ["1", "0", "00003", "dog", "", "361", "90", "7", "-11"],
    },
    notPythonPycharmPyc: {
      good: [
        "",
        "pythons",
        "pycs",
        "PYC",
        "apycharm",
        "zpyc",
        "dog",
        "pythonpyc",
      ],
      bad: ["python", "pycharm", "pyc"],
    },
    restrictedFloats: {
      good: ["1e0", "235e9", "1.0e1", "1.0e+122", "55e20"],
      bad: ["3.5E9999", "2.355e-9991", "1e2210"],
    },
    palindromes2358: {
      good: [
        "aa",
        "bb",
        "cc",
        "aaa",
        "aba",
        "aca",
        "bab",
        "bbb",
        "ababa",
        "abcba",
        "aaaaaaaa",
        "abaaaaba",
        "cbcbbcbc",
        "caaaaaac",
      ],
      bad: ["", "a", "ab", "abc", "abbbb", "cbcbcbcb"],
    },
    pythonStringLiterals: {
      good: String.raw`''
        ""
        'hello'
        "world"
        'a\'b'
        "a\"b"
        '\n'
        "a\tb"
        f'\u'
        """abc"""
        '''a''"''"'''
        """abc\xdef"""
        '''abc\$def'''
        '''abc\''''`
        .split("\n")
        .map((s) => s.trim()),
      bad: String.raw`
        'hello"
        "world'
        'a'b'
        "a"b"
        'a''
        "x""
        """"""""
        frr"abc"
        'a\'
        '''abc''''
        """`
        .split("\n")
        .map((s) => s.trim()),
    },
};

for (let name of Object.keys(testFixture)) {
  describe(`when matching ${name}`, () => {
    for (let s of testFixture[name].good) {
      it(`accepts ${s}`, () => {
        assert.ok(matches(name, s));
      });
    }
    for (let s of testFixture[name].bad) {
      it(`rejects ${s}`, () => {
        assert.ok(!matches(name, s));
      });
    }
  });
}
