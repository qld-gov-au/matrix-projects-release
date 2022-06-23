# Readme #

This project uses the Squiz webpack boilerplate.

## Commands

npm install: Install required dependencies. This is the first thing you need to run after downloading the repo

npm run serve: Spin up a local virtual machine at 0.0.0.0:8080 to preview ongoing work

npm run build: Build the dist files that will be served to Matrix Git bridge


## Modular development
Modules are set up in src/modules, and you can find templates in src/templates. Copy the relevant template and rename it to suit your new module. You'll need to stop the serve process and run it again for Webpack to pick up the new module, before you can include it in your page.


### Working in HTML files

#### Including images

Your files live in:
- src/files/my-awesome-file.png


And you're wanting to include an image in:
- src/modules/header/html/index.html


Use either reference:
- Relative path: ````<img src="../../../files/my-awesome-file.png" alt="My awesome file" >````
- Absolute path: ````<img src="~src/files/my-awesome-file.png" alt="My awesome file" >````


#### Including HTML modules

Your awesome menu lives in:
- src/modules/header-menu/html/index.html

And you want to include it in:
- src/modules/header/html/index.html

Use either reference:
- Relative path: ````${require('../../header-menu/html/index.html')}````
- Absolute path: ````${require('src/header-menu/html/index.html')}````


### Working in CSS files

#### Including fonts

Your fonts live in:
- src/styles/imports/fonts/my-awesome-font.woff

And you want to include it in your main CSS:
- src/styles/global.scss

Use either reference:
- Relative path: ````url('./imports/fonts/my-awesome-font.woff') format('woff')````
- Absolute path: ````url('~src/imports/fonts/my-awesome-font.woff') format('woff')````

#### Including images

Your files live in:
- src/files/icon.png

And you're wanting to include an image in:
- src/modules/header/css/global.scss

Use either reference:
- Relative path: ````background-image: url('../files/icon.png');````
- Absolute path: ````background-image: url('~src/files/icon.png');````


### Working in JS files

#### Including images

Your files live in:
- src/files/icon.png

And you're wanting to include an image in:
- src/modules/header/js/global.js

Use either reference:
- Relative path: ````const icon = require('../../../files/icon.png');````
- Absolute path: ````const icon = require('src/files/icon.png');````

#### Including JSON
You may want to reference an external JSON file that does not need to be a part of the webpack build process. For instance, mock data returned from funnelback autocomplete. The /externals directory allows you to pop in files to ensure that they will be included in the /dist directory

Your file lives in:
- ````src/externals/data.json````


You can reference it by its relative path ie.
- ````fetch('./externals/data.json').then(function(response){...do stuff})````

Or its absolute path ie.
- ````fetch('~src/externals/data.json').then(function(response){...do stuff})````

File will be moved into the dist directory ````dist/externals/data.json````

## SVGs

It's been recommended that you setup a module for all your SVGs, with a folder in your repo such as:
/src/modules/SVGs/html
with a HTML file for each SVG inside that, such as svg-chevron-up.html, containing the svg markup:

	
~~~~
<svg xmlns="http://www.w3.org/2000/svg" width="15" height="9" viewBox="0 0 15 9">
    <path fill="#00A8BD" fill-rule="evenodd" d="M7.269 1h-.026a1.32 1.32 0 0 0-.944.422L1.33 6.836a1.247 1.247 0 0 0 .103 1.79c.536.467 1.359.421 1.836-.1l4.038-4.4 4.459 4.488c.499.504 1.322.515 1.84.029a1.245 1.245 0 0 0 .028-1.791L8.202 1.386A1.307 1.307 0 0 0 7.27 1"/>
</svg>
	
~~~~

Which allows you to reference those svgs in other modules using code with require tags, like:

~~~~
<span class="icon">
    ${require('../../SVGs/html/svg-chevron-up.html')}
</span>
~~~~
