const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
const MONGO_URL = `mongodb://${MONG_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

module.exports = () => {
    const connect = () => {
        if(NODE_ENV !=='production') {
            mongoose.set('debug',true);
        }
        mongoose.connect(MONGO_URL, {
            dbName : 'gifchat',
        }, (error) => {
            if(error) {
                console.log('연결 에러', error);
            } else {
                console.log('연결 성공');
            }
        });
    };

connect();

mongoose.connection.on('error', (error) => {
    console.error('연결 에러', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('연결 끊김, 재연결');
    connect();
});

require('./chat');
require('./room');
};