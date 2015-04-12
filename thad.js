var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var serve = require('metalsmith-serve');
var paginate = require('metalsmith-paginate');
var drafts = require('metalsmith-drafts');
var excerpts = require('metalsmith-excerpts');
var convert = require('metalsmith-convert');
var imagemin = require('metalsmith-imagemin');
var moment = require('moment');
var externalWatch = require('metalsmith-external-watch');
var ignore = require('metalsmith-ignore');

externalWatch(function() {
  var metalsmith = Metalsmith(__dirname);
  metalsmith
    .use(drafts())
    //.use(convert({
    //  src: '**/*.jpg',
    //  target: 'png',
    //  //resize: { width: 900, height: 500 },
    //  remove: true,
    //  IM: false,
    //  nameFormat: '%b_thumb%e',
    //  quality: 50,
    //  blur: 5
    //}))
    .use(imagemin({
      optimizationLevel: 3,
      svgoPlugins: [{ removeViewBox: false }]
    }))
    .use(collections({
      pages: { pattern: 'content/pages/*.md' },
      posts: {
        pattern: 'content/posts/*.md',
        sortBy: 'date',
        reverse: true
      }
    }))
    .use(paginate({
      perPage: 3,
      path: ':collection/page'
    }))
    .use(markdown({
      smartypants: true,
      gfm: true
    }))
    .use(excerpts())
    .use(permalinks({
      pattern: ':collection/:title'
    }))
    .use(templates({
      engine: 'jade',
      pretty: true,
      directory: 'src/templates',
      helpers: {
        prettyDate: function(date) {
          return moment(date).format('MMMM DD, YYYY');
        },
        shortDate: function(date) {
          return moment(date).format('MMM DD, YYYY');
        }
      }
    }))
    .use(ignore([ '**/*.jade' ]))
    .clean(true)
    .destination('./build')
    //.use(serve({
      //host: '192.168.1.189',
      //verbose: false
    //}))
    .build(function(err, files) {
      if (err) {
        throw err;
      }
    });
});


