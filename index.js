const { readdirSync, readFileSync } = require('fs');
const { mkdir, writeFile, readFile } = require('fs/promises');
const { copy } = require('fs-extra');
const rimraf = require('rimraf');
const Handlebars = require('handlebars');
const cheerio = require('cheerio');

const TEMPLATE_POST = readFileSync('./templates/post.html', 'utf-8');
const TEMPLATE_MAIN = readFileSync('./templates/main.html', 'utf-8');

const $main = cheerio.load(TEMPLATE_MAIN);

const POSTS_PATH = './posts';
const BUILD_PATH = './docs';
const ASSETS_DIRNAME = 'assets';
const COPYPATHS = ['css/', 'js/', 'favicon.ico'];


function build () {
  const getAllPosts = () =>
    readdirSync(POSTS_PATH, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  
  const allPostDirs = getAllPosts();
  const allPostMetaData = [];
  
  allPostDirs.forEach(dir => {
    mkdir(`${BUILD_PATH}/${dir}`)
    .then(() => {
      console.log(`Created post dir: ${dir}`);

      readFile(`${POSTS_PATH}/${dir}/index.html`)
      .then(source => {
        readFile(`${POSTS_PATH}/${dir}/meta.json`, 'utf-8')
        .then(metadata => {
          const meta = JSON.parse(metadata);
          const $ = cheerio.load(TEMPLATE_POST);
          meta.path = dir;
          allPostMetaData.push(meta);

          if(allPostMetaData.length === allPostDirs.length) {
            const sortedPosts = allPostMetaData.sort((a,b) => {
              const A = new Date(a.postedOn).getTime();
              const B = new Date(b.postedOn).getTime();
              return B - A;
            })
            sortedPosts.forEach(postmeta => {
              $main('.posts').append(buildPostCard(postmeta));
            });
            writeFile(`${BUILD_PATH}/index.html`, $main.html());
          }

          copyAssets(dir);

          if(meta.image) {
            meta.imagepath = `${dir}/assets/${meta.image}`;
          }

          $('body').append(source.toString());
          const template = Handlebars.compile($.html());
          const outputHTML = template(meta);
          writeFile(`${BUILD_PATH}/${dir}/index.html`, outputHTML);
        })
      })
      .catch((err) => {
        console.error(err);
      })
    })
    .catch(() => {
      console.error('Error in creating post dir');
    })
  });

  function copyAssets(path) {
    copy(`${POSTS_PATH}/${path}/${ASSETS_DIRNAME}`, `${BUILD_PATH}/${path}/${ASSETS_DIRNAME}`)
    .then()
    .catch(() => {
      console.error('🔴');
    })
  }

  COPYPATHS.forEach((path) => {
    copy(`./${path}`, `${BUILD_PATH}/${path}`)
    .then(() => {
      console.log(`Copied ${path}`);
    })
    .catch(() => {
      console.error(`Error in copying ${path}`);
    })
  });
}

const buildPostCard = (metadata) => {
  const dateString = new Date(metadata.postedOn).toDateString();
  return `<li><a href="./${metadata.path}/">${metadata?.title || ''}</a><br><h3>${dateString}</h3></li>`
}

rimraf(`${BUILD_PATH}/*`, () => {
  console.log('BUILD PATH CLEARED!!');
  build();
});