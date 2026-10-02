const fs = require('fs');

function dumpNames(filename) {
  const buf = fs.readFileSync(filename);
  console.log('=== Dump names for:', filename);
  const numTables = buf.readUInt16BE(4);
  let nameOffset = 0;
  for (let i = 0; i < numTables; i++) {
    const tag = buf.toString('ascii', 12 + i * 16, 12 + i * 16 + 4);
    if (tag === 'name') {
      nameOffset = buf.readUInt32BE(12 + i * 16 + 8);
      break;
    }
  }
  const count = buf.readUInt16BE(nameOffset + 2);
  const stringOffset = nameOffset + buf.readUInt16BE(nameOffset + 4);
  for (let i = 0; i < count; i++) {
    const platformId = buf.readUInt16BE(nameOffset + 6 + i * 12);
    const encodingId = buf.readUInt16BE(nameOffset + 6 + i * 12 + 2);
    const languageId = buf.readUInt16BE(nameOffset + 6 + i * 12 + 4);
    const nameId = buf.readUInt16BE(nameOffset + 6 + i * 12 + 6);
    const length = buf.readUInt16BE(nameOffset + 6 + i * 12 + 8);
    const offset = buf.readUInt16BE(nameOffset + 6 + i * 12 + 10);
    const strBuf = buf.slice(stringOffset + offset, stringOffset + offset + length);
    
    let str = '';
    if (platformId === 3 || platformId === 0) {
      for (let b = 0; b < strBuf.length; b += 2) {
        str += String.fromCharCode(strBuf.readUInt16BE(b));
      }
    } else {
      str = strBuf.toString('ascii');
    }
    console.log('  nameId', nameId, '(plat:' + platformId + ', lang:' + languageId + '): "' + str + '"');
  }
}

dumpNames('./fonts/HJ한전서A.ttf');
dumpNames('./fonts/HJ한전서B.ttf');
