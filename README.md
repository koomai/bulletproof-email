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

##### Install the gulp plugins in package.json

`npm install`

#### Usage

`gulp serve` - starts a local webserver on **http://localhost:8080**  
`gulp serve --port=8888` - starts a local webserver on **http://localhost:8888**  
`gulp serve --open` - opens the URL on your default browser automatically.   

`gulp build` - builds production ready files in *dist/production* folder.  
`gulp build --minify` - minifies your HTML files  
`gulp build --zip` - builds files + creates a zip file of your images directory (for Campaign Monitor)  
`gulp build --zip=all` - builds files and creates a zip file of everything (for Mailchimp)

`gulp copy --template=NAME` - copies your built template to the clipboard
`gulp copy -t NAME` - alias for the gulp task above

`gulp clean` - empty your distribution directories

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

### Local server

Run `gulp serve` to start a local webserver. Visit **http://localhost:8080** on your browser to test your templates (or run `gulp serve --open` to open the URL automatically on your default browser).

This also instantiates a watcher that:

* watches for changes in the source folder
* compiles SASS to CSS
* builds the HTML files from the templates
* outputs latest files to *dist/local* folder
* uses Browsersync to reload the browser

You can also choose a different port by passing the `--port` argument, e.g. `gulp serve --port=8888`.  You can also change the port permanently in `gulp.config.js`.

### Production files

Run `gulp build` to generate production-ready files.

This compiles production-ready HTML to the *dist/production* folder. It does the following:
* compiles SASS to CSS
* builds the HTML files from the templates
* brings the CSS inline into the HTML and removes the CSS files (except `media-queries.css`)
* minifies the images (only those that have changed)


#### Minify

If your newsletters are very long, you should minify the HTML so that Gmail doesn't [clip them](https://www.campaignmonitor.com/forums/topic/8088/what-rule-does-gmail-use-to-decide-when-to-clip-a-message/).

Run `gulp build --minify` to minify your HTML files.

#### Zip files

Some email tools require zip files to upload new templates.

Run `gulp build --zip` to compress images only. 

Run `gulp build --zip=all` to compress images and HTML.

### Configuration

All configuration options are in the `gulp.config.js` file.

### Misc
* You can run `gulp clean` to clean up your *dist* folders.

### Contributing

To contribute, please fork the project and submit pull requests against the `develop` branch.