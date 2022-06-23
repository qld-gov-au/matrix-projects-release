const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const fs = require('fs');
const glob = require('glob');

// Our function that generates our html plugins
function generateHtmlPlugins (templateDir) {
  // Read files in /html directory 
  const templateFiles = fs
    .readdirSync(path.resolve(__dirname, templateDir))
    .filter(function(file){ //ignore folder
      return file.indexOf(".html") > -1
    });

  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebPackPlugin({
      'filename': `${name}.html`,
      'template': path.resolve(__dirname, `${templateDir}/${name}.${extension}`)
    });
  });
}

const htmlPlugins = generateHtmlPlugins('./src/html');

// File arrays
let js_files = glob.sync('./src/modules/**/global.js') // Module JS

function reloadHtml() {
  const cache = {};
  const plugin = {
    'name': 'CustomHtmlReloadPlugin'
  };

  this.hooks.compilation.tap(plugin, compilation => {
    compilation.hooks.htmlWebpackPluginAfterEmit.tap(plugin, data => {
      const orig = cache[data.outputName];
      const html = data.html.source();

      // plugin seems to emit on any unrelated change?
      if (orig && orig !== html) {
        devServer.sockWrite(devServer.sockets, 'content-changed')
      }

      cache[data.outputName] = html
    })
  })
}

module.exports = {
  'entry': {
    'main': ['./src/index.js'].concat(js_files)
  },
  'output': {
    'path': path.resolve(__dirname, 'dist'), // Output folder
    'filename': 'js/[name].js' // JS output path
  },
  'resolve': {
    'alias': {
      'NodeModules': path.resolve(__dirname, 'node_modules/')
    }
  },
  'module': {
    'rules': [
      { // HTML
        'test': /\.html$/,
        'use': [{ 
          'loader': "html-loader", 
          'options': {
            'minimize': false,
            'interpolate': true // allow HTML snippets with commonJs require tags
          } 
        }]
      },
      { // JavaScript and JSX only (no JSON)
        'test': /\.jsx?$/,
        'exclude': /node_modules/,
        'use': [
          "babel-loader",
          "eslint-loader"
        ]
      },
      { // Images
        'test': /\.(png|svg|jpg|gif)$/,
        'use': {  
          'loader': 'file-loader',
          'options': {
            'name': "[name].[ext]",
            'outputPath': 'mysource_files/'
          }
        }
      },
      { // Font files
        'test': /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        'use': [{
            'loader': 'file-loader',
            'options': {
                'name': './mysource_files/[name].[ext]'
            }
        }]
      }
    ]
  },
  'plugins': htmlPlugins.concat(reloadHtml),
  'optimization': {
    'minimize': false,
    'runtimeChunk': 'single',
  }
};
