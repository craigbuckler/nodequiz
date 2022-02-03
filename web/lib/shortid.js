// encode and decodes numeric database IDs to shorter names
const
  decodeChars = '2346789acdefghkmnpqrtvwxy', // valid URL path characters
  base = decodeChars.length,
  numOffset = base ** 2,
  numMult = 7,
  encodeMap = {},
  decodeMap = {};

// create maps
decodeChars.split('').map((d, i) => {
  const e = i.toString(base);
  encodeMap[e] = d;
  decodeMap[d] = e;
});

// encode a number to a GUID string
export function encode(num) {

  return charConvert( (num * numMult + numOffset).toString(base), encodeMap );

}


// decode a GUID string to a number
export function decode(code) {

  return (parseInt(charConvert( code.toLowerCase(), decodeMap ), base) - numOffset) / numMult;

}


// convert characters
function charConvert(str, charSet) {

  return str
    .split('')
    .reverse()
    .map(c => charSet[c])
    .join('');

}
