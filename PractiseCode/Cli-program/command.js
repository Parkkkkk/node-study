#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta chart="utf-8" />
    <title>Template</title>
</head>
<body>
    <h1>Hello</h1>
    <p>CLI</p>
</body>
</html>`;

const routerTemplate = `const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;`;
const exist = (dir) => {
    try {
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const mkdirp = (dir) => {
    const dirname = path
    .relative('.', path.normalize(dir))
    .split(path.sep)
    .filter(p => !!p);
  dirname.forEach((d, idx) => {
      const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
      if(!exist(pathBuilder)) {
          fs.mkdirSync(pathBuilder);
      }
  });
};


// 파일 삭제 
const deletefile = (filepath) => {
    if(exist(filepath)){
        fs.unlinkSync(filepath);
        console.log('successfully delete', filepath);
    } else {
        console.log('File not found, so not deleting.');
    }
};

// 파일 복사
const copyfile = (file , newpath) => {
    if(exist(file)){
        fs.copyFileSync(file, newpath);
        console.log(file, '생성 완료');
    } else {
        console.log('File not Found, so not copy.')
    }

};



const makeTemplate = (type , name, directory) => {
    mkdirp(directory);
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if (exist(pathToFile)) {
            console.error(chalk.bold.red('이미 해당 파일이 존재합니다'));
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(chalk.green(pathToFile, '생성 완료'));
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if(exist(pathToFile)) {
            console.error(chalk.bold.red('이미 해당 파일이 존재합니다'));
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(chalk.green(pathToFile,'생성 완료'));
        }
    } else {
        console.error(chalk.bold.red('html 또는 express-router 둘 중 하나를 입력하세요.'));
    }
};

let triggerd = false;
program 
    .version('0.0.1', '-v, --version')
    .usage('[options]');

// 파일 생성
program
    .command('template <type>')
    .usage('--name <name> --path [path]')
    .description('템플릿을 생성합니다.')
    .alias('tmpl')
    .option('-n, --name <name>', '파일명을 입력하세요.', 'index')
    .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
    .action((type, options) => {
        makeTemplate(type, options.name, options.directory);
        triggerd = true;
    });


// 파일 복사
program
    .command('copyfile <file>')
    .usage(' --path [path]')
    .description('파일을 복사합니다.')
    .option('-d, --directory [path]', '저장할 위치', '.')
    .action((file, option) => {
        copyfile(file ,  option.directory );
        triggerd = true;
    }) 

// 파일 삭제
program
    .command('delete [path]')
    .description('해당경로의 파일을 삭제합니다.')
    .action((path) => {
        deletefile(path);
        triggerd = true;
    })

program
    .command('*', { noHelp: true})
    .action(() => {
        console.log('해당 명령어를 찾을 수 없습니다.');
        program.help();
        triggerd = true;
    });

program
    .parse(process.argv);

    if(!triggerd) {
        inquirer.prompt([
        
        {
            type : 'input',
            name : 'path',
            message : '삭제할 파일의 경로를 입력하세요.',
            default : './test',
        },{
            type : 'confirm',
            name : 'confirm',
            message : '생성하시겠습니까?',
        }])
            .then((answers) => {
                if(answers.confirm) {
                    deletefile(answers.path);
                    console.log(chalk.rgb(128, 128, 128)('터미널을 종료합니다.'))
                }
            });
    }






/* 파일 복사
    if(!triggerd) {
        inquirer.prompt([
        
        
        {
            type : 'input',
            name : 'file',
            message : '복사할 파일을 입력하세요',
            default : 'index.js',
        }, {
            type : 'input',
            name : 'directory',
            message : '저장할 위치와 새로운 파일명을 입력하세요',
            default : './noname', 
        },{
            type : 'confirm',
            name : 'confirm',
            message : '생성하시겠습니까?',
        }])
            .then((answers) => {
                if(answers.confirm) {
                    copyfile(answers.file,answers.directory);
                    console.log(chalk.rgb(128, 128, 128)('터미널을 종료합니다.'))
                }
            });
    }
*/

/* 파일 생성 cli
if(!triggerd) {
    inquirer.prompt([{
        type : 'list',
        name : 'type',
        message : '템플릿 종류를 선택하세요.',
        choices : ['html', 'express-router'],
    }, {
        type : 'input',
        name : 'name',
        message : '파일의 이름을 입력하세요.',
        default : 'index',
    }, {
        type : 'input',
        name : 'directory',
        message : '파일이 위치할 폴더의 경로를 입력하세요.',
        default : '.', 
    }, {
        type : 'confirm',
        name : 'confirm',
        message : '생성하시겠습니까?',
    }])
        .then((answers) => {
            if(answers.confirm) {
                makeTemplate(answers.type, answers.name, answers.directory);
                console.log(chalk.rgb(128, 128, 128)('터미널을 종료합니다.'))
            }
        });
}*/