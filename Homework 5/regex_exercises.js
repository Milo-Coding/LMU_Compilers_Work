const regexes = {
  canadianPostalCode:
    /^[ABCEGHJKLMNPRSTVWXYZ]\d[ABCEGHJ-NPRSTVXYZ] \d[ABCEGHJ-NPRSTVXYZ]\d$/,
  visa: /^4\d{12}(\d{3})?$/,
  masterCard:
    /^5[1-5]\d{14}$|2(2(2[1-9]|[3-9]\d)|[3-6]\d{2}|7([01]\d|20))\d{12}$/,
  notThreeEndingInOO: /^(?![a-zA-Z][oO]{2}$)([a-zA-Z]*)$/,
  divisibleBy16: /^[01]*0000$|^000$|^00$|^0$/,
  eightThroughThirtyTwo: /^0*([8-9]|[1-2]\d|3[0-2])$/,
  notPythonPycharmPyc: /^(?!(python|pycharm|pyc)$).*$/u,
  restrictedFloats: /^\d*(\.\d*)?[eE][+-]?\d{1,3}$/i,
  palindromes2358:
    /^([a-c])\1$|^([a-c])[a-c]\2$|^([a-c])([a-c])[a-c]\4\3$|^([a-c])([a-c])([a-c])([a-c])\8\7\6\5$/,
  pythonStringLiterals:
    /^(?:[rRuUfF]|[fF][rR]|[rR][fF])?(?:'[^'\\\n\r]*(?:\\.[^'\\\n\r]*)*'|"[^"\\\n\r]*(?:\\.[^"\\\n\r]*)*"|'''(?:[^'\\]|\\.|'(?!''))*'''|"""(?:[^"\\]|\\.|"(?!""))*""")$/,
};

export function matches(name, string) {
  return regexes[name].test(string);
}
