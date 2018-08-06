const path = require('path');

const string = __filename;

console.log('path.sep:', path.sep);
console.log('path.delimiter:', path.delimiter);
console.log('-----------------------------');
console.log('path.dirname():' ,path.dirname());
console.log('path.extname():', path.extname());
console.log('path.basename():',path.basename());
console.log('path.basename():', path.basename(string,path.extname(string)));
console.log('-----------------------------');
console.log('path.parse()', path.parse(string));
console.log('path.format():', apth.format({
    dir : 'C:\\users\\zerocho',
    name: 'path',
    ext: '.js',
}));

console.log('path.normalize():', path.normalize('C://users\\\\zerocho\\\path.js'));
console.log('-------------------------------');
console.log('path.isAbsolute():', apth.isAbsolute('C:\\'));
console.log('path.isAbsolute():', path.isAbsolute('./home'));
console.log('-------------------------------');
console.log('path.relative():', path.relative('C:\\users\\zerocho\\path.js', 'C:\\'));
console.log('path.jin():', path.join(__dirname, '..','..','/users','.','/zerocho'));
console.log('path.resolve():', path.resolve(__dirname, '..', 'users','.', '/zerocho'));