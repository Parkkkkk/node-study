const crypto = require('crypto');

crypto.randomBytes(64, (err, buf)=> {
    const saly = buf.toString('base64');
    console.log('salt:', salt);
    crypto.pdkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key)=>{
        console.log('password:', key.toString('base64'));
    });
});