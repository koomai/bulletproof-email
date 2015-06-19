## Bulletproof Email


**Bulletproof Email** is an HTML email template builder powered by Gulp.

The main features are:

* A basic front-end templating system with layouts and partials
* Modular sections for different email layouts
* SASS stylesheets 
* CSS inliner
* Images and HTML Minifier 
* Gulp build tool and LiveReload

Bulletproof Email utilises [Zurb Ink](http://zurb.com/ink/templates.php) for its starter templates.

### Getting started

##### Install node.js 

You can download it from [nodejs.org](https://nodejs.org/) 

##### Ensure you have the latest version of the npm package manager

`sudo npm install npm -g`

##### Install gulp globally

`npm install --global gulp`

##### Install gulp (plus yargs & del) locally

`npm install gulp yargs del`

##### Install the gulp plugins in package.json

`npm install`

#### TL;DR

Run `gulp --serve` and go to **http://localhost:8080** on your browser.

Run `gulp --prod` and check out the files in *dist/production* folder.

Continue reading below for more details

### Working with files

All files are in the *source* folder organised into the following:

* **layouts** - layout templates
* **partials** - partial files, e.g. header, footer and other components
* **stylesheets** - SASS files for all styling
* **images** - all images go here 

### HTML 
Your master templates in `layouts` consist of files from `partials`, following the convention of most templating systems.


The syntax to include files is:

`{{ include('../partials/header.html') }}`  

You can also pass variables to your partials.

*Layout*:

`{{ include('../partials/header.html', { "templateLabel" : "BASIC" }) }}` 

*Partial*:

`<span class="template-label">{{ templateLabel }}</span>` 


**Note**: Make sure there is a space after the opening double braces and before the closing double braces. 




### SASS 
The styles have been broken down into smaller modules in `stylesheets/modules`.

Custom styling can be added to `stylesheets/modules/_custom.scss`. You can also create your own files and import them into `stylesheets/main.scss`. 

**Note:** Add all styling for smallers screens (< 580px) to `stylesheets/media-queries.scss`. This is included separately into the HTML files.

### Build Tool
Run `gulp build` to generate the HTML, CSS and image files in the `dist/local` folder. This is the default task, so you can also just run `gulp`.

### Local server

Run `gulp --serve` to start a local webserver. Visit **http://localhost:8080** on your browser to test your templates.

This also instantiates a watcher that:

* watches for changes in the source folder
* compiles SASS to CSS
* builds the HTML files from the templates
* outputs latest files to *dist/local* folder
* livereloads the browser

You can also choose a different port by passing the `--port` argument, e.g. `gulp --serve --port=8888`.

### Production files

For production, run `gulp --prod` or `gulp --production`.

This compiles production-ready HTML to the *dist/production* folder. It does the following:
* compiles SASS to CSS
* builds the HTML files from the templates
* brings the CSS inline into the HTML and removes the CSS files (except `media-queries.css`)
* minifies the images (only those that have changed)


#### Minify

If your newsletters are very long, you should minify the HTML so that Gmail doesn't [clip them](https://www.campaignmonitor.com/forums/topic/8088/what-rule-does-gmail-use-to-decide-when-to-clip-a-message/).

Run `gulp --prod --minify` to minify your HTML files.

#### Zip files

Some email tools require zip files to upload new templates.

Run `gulp --prod --zip` to compress images only. 

Run `gulp --prod --zip=all` to compress images and HTML.

### Misc

* If you want, you can rename the *dist/local* and *dist/production* folders in `gulpfile.js`. 
* You can run `gulp clean` to clean up your *dist* folders.

### Contributing

To contribute, please fork the project and submit pull requests against the `develop` branch.