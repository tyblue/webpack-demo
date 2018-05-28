var gulp = require('gulp');
var fileinclude = require("gulp-file-include");

gulp.task("fileinclude",function(){
    gulp.src(
        ["./example*.html","!app/**/*.html"] // 多文件放在数组里
        // "./example*.html","!app/**/*.html" //报错
    )
        .pipe(fileinclude({
            prefix:'@@',
            basepath:"@file"
        }))
        .pipe(gulp.dest(file=>{
            // console.log(JSON.stringify(file,null,2))
            // return file.base
            return "dist"
        }
        ))
});

/**
 * 文件内容替换
 */
gulp.task('replace', () => {
    gulp.src(['dist/index.css'])
        .pipe(replace("/static", "./static"))
        .pipe(gulp.dest(file => {
            return file.base;
        }));
});

/**
 * 文件拷贝
 */
gulp.task('copy', () => {
    gulp.src(['module/divider/**/*'], {base: 'module'})
        .pipe(gulp.dest('node_modules/antd/lib'));
});

gulp.task("default",["fileinclude"]);


const gulp = require('gulp');
const replace = require('gulp-replace');
const mammoth = require("mammoth");
const fs = require('fs');
const docs = require('./src/docs/docs.json');
const source = require('./src/config/source.json');
const { protocol, host, port, projectName } = require('./src/config/server.json');

/**
 * 文件内容替换
 */
gulp.task('replace', () => {
    gulp.src(['dist/index.css'])
        .pipe(replace("/static", "./static"))
        .pipe(gulp.dest(file => {
            return file.base;
        }));
});

/**
 * docs文件转html
 */
gulp.task('docx2html', () => {
    const charset = '<meta charset="UTF-8">';
    const link = `<link href="../${source.ico}" rel="shortcut icon" type="image/x-icon">`;

    for (let i = 0; i < docs.length; i++) {
        let { file_name, file_ext } = docs[i];
        let docDir = `src/docs/${file_name}`;
        let htmlDir = `public/docs/${file_name}.html`;

        mammoth.convertToHtml({ path: `${docDir}.${file_ext}` }).then(function (result) {
            fs.writeFile(`${htmlDir}`, `${charset}${link}${result.value}`, function (err) {
                if (err) throw err;
            });
        }).done();
    }
});

/**
 * 创建文件
 */
gulp.task('create', () => {
    // 服务相关
    const server = `var server_serviceApply={protocol:'${protocol}',host:'${host}',port:'${port}',projectName:'${projectName}'}`;

    fs.writeFile('dist/server.js', server, function (err) {
        if (err) {
            throw err;
        }
        console.log('server config created!');
    });
});

/**
 * html文件中的ico图标
 */
// gulp.task('htmlIco', () => {
//     const htmlDir = [
//         { h: 'public/index.html', i: '.' }
//     ];

//     htmlDir.map(hd => {
//         const { h, i } = hd;
//         const link = `<link href="${i}/${source.ico}" rel="shortcut icon" type="image/x-icon">`;

//         fs.readFile(h, function(err, data) {
//             if (err) throw err;
//             console.log(data);

//             fs.writeFile(h, `${link}${data}`, function (err) {
//                 if (err) throw err;
//             });
//         });
//     });
// });

/**
 * copy目录、文件
 */
gulp.task('copy', () => {
    const dirs = ['docs'];

    dirs.map(d => {
        gulp.src(`public/${d}`)
            .pipe(gulp.dest('dist'));
    });
});

gulp.task('default', ['replace', 'docx2html', 'copy']);