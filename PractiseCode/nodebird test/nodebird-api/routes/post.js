const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require ('../models');
const { isLoggedIn } = require('./middlewares');
const { Post, User } =require('../models');


const router = express.Router();

/**
 *  해당 폴더가 존재하지 않는다면 fs모듈을 이용하여 폴더를 생성
 */
fs.readdir('uploads', ( error) => {
    if(error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }
});


/**
 * upload에 Multer옵션을 주어 미들웨어를 만드는 객체로 저장.
 */

const upload = multer ({
    storage : multer.diskStorage ({
        destination (req, file, cb ) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext );       
        },
    }),
    limits : { fileSize : 5 * 1024 * 1024},
});


/**
 *  단일 파일?
 */

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ url : `/img/${req.file.filename}` });
});



const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async ( req, res, next) => {
    try {
        const post = await Post.create ({
            content : req.body.content,
            img : req.body.url,
            userId : req.user.id,
        });
    const hashtags = req.body.content.match(/#[^\s]*/g);
    if (hashtags) {
        const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate ({
            where : { title : tag.slice(1).toLowerCase() },
        })));
        await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.get('/', (req, res, next) => {
    Post.findAll ({
        include : {
            model : User,
            attributes : ['id', 'nick'],
        },
        order : [[ 'createdAt', 'DESC ']],
    })
        .then((posts) => {
            res.render('main', {
                title : 'NodeBird',
                twits: posts,
                user: req.user,
                loginError: req.flash('loginError'),
            });
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

router.get('/hashtag' , async ( req, res, next ) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtah.find({ where : { title : query }});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include : [{ model : User}]});
        }
        return res.render('main', {
            title : `${query} | NodeBird`,
            user : req.user,
            twits: posts,
        });
    } catch(error) {
        console.error(error);
        return next(error);
    }
});


module.exports = router;

