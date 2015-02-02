var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');

var metalsmith = Metalsmith(__dirname);

metalsmith
  .use(collections({
    pages: { pattern: 'content/pages/*.md' },
    posts: {
      pattern: 'content/posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown())
  .use(permalinks({
    pattern: ':collection/:title'
  }))
  .use(templates('jade'))
  .destination('./build')
  .build(function(err, files) {
    if (err) {
      throw err;
    }
  });

