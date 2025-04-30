// TODO convert to js regular expressions
const regexes = {
  canadianPostalCode: /^ ........ $/,
  visa: /^ ........ $/,
  masterCard: /^ ........ $/,
  notThreeEndingInOO: /^ ........ $/iu,
  divisibleBy16: /^ ........ $/,
  eightThroughThirtyTwo: /^ ........ $/,
  notPythonPycharmPyc: /^ ........ $/u,
  restrictedFloats: /^ ........ $/i,
  palindromes2358: /^ ........ $/,
  pythonStringLiterals: /^ ........ $/,
};

export function matches(name, string) {
  return regexes[name].test(string);
}

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
