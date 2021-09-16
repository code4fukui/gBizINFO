// https://www.houjin-bangou.nta.go.jp/documents/checkdigit.pdf

const isValid = (s) => {
  s = s.toString();
  if (s.length != 13) {
    return false;
  }
  return s[0] == calcCheckDigit(s.substring(1, 13));
};
const calcCheckDigit = (s) => {
  if (s.length != 12) {
    return null;
  }
  let n1 = 0;
  let n2 = 0;
  for (let i = 0; i < 12; i += 2) {
    n1 += parseInt(s[i]);
    n2 += parseInt(s[i + 1]);
  }
  const c = 9 - (n1 * 2 + n2) % 9;
  return c;
};

export { isValid, calcCheckDigit };
