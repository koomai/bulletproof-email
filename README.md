## Bulletproof Email  

**Bulletproof Email** is an HTML email template builder powered by Gulp.

The main features are:

*   A basic front-end templating system with layouts and partials
*   Modular sections for different email layouts
*   SASS stylesheets
*   CSS inliner
*   Images and HTML Minifier
*   Gulp build tool and BrowserSync for live reloading
*   Send test emails via [Nodemailer](https://github.com/andris9/nodemailer)
*   Gulp tasks for an efficient workflow  

Bulletproof Email utilises [Zurb Ink](http://zurb.com/ink/templates.php) for its starter templates – however, this is not a requirement.

### Getting started

##### Install node.js

You can download it from [nodejs.org](https://nodejs.org/)

##### Ensure you have the latest version of the npm package manager

`sudo npm install npm -g`

##### Install gulp globally

`npm install --global gulp`

##### Install the gulp plugins in package.json

```shell
$ npm install
# Or using Yarn
$ yarn install
```

#### Usage

`gulp serve` - starts a local webserver on **[http://localhost:8080](http://localhost:8080)**  
`gulp serve --port=8888` - starts a local webserver on **[http://localhost:8888](http://localhost:8888)**  
`gulp serve --open` - opens the URL on your default browser automatically.  
`gulp serve -o` - alias for the above task  

`gulp build` - builds production ready files in *dist/production* folder.  
`gulp build --minify` - minifies your HTML files  
`gulp build --zip` - builds files + creates a zip file of your images directory (for Campaign Monitor)  
`gulp build --zip=all` - builds files and creates a zip file of everything (for Mailchimp)  

`gulp mail --template=NAME` - send a test email using your default configuration in `nodemailer.config.js`  
`gulp mail -t NAME` - alias for the above task  
`gulp mail --template=NAME --to=email@example.com --subject='Lorem Ipsum'` - send a test email with overrides  

`gulp copy --template=NAME` - copies your built template to the clipboard  
`gulp copy -t NAME` - alias for the above task  

`gulp clone --from=NAME --to=NEW` - clones template NAME into NEW  

`gulp remove --template=NAME` - removes template NAME from source and build directories  
`gulp remove -t NAME` - alias for the above task  

`gulp clean` - empty your build directories  

Continue reading below for more details  

### Working with files

All files are in the *source* folder organised into the following:

*   **layouts** - layout templates
*   **partials** - partial files, e.g. header, footer and other components
*   **stylesheets** - SASS files for all styling
*   **images** - all images go here

### HTML
Your master templates in `layouts` consist of files from `partials`,
following the convention of most templating systems.

The syntax to include files is:

`{{ include('../partials/header.html') }}`

You can also pass variables to your partials.

##### *Layout*

`{{ include('../partials/header.html', { "templateLabel" : "BASIC" }) }}`

##### *Partial*

`<span class="template-label">{{ templateLabel }}</span>`

**Note**: Make sure there is a space after the opening double braces and before the closing double braces.


### SASS

The styles have been broken down into smaller modules in `stylesheets/modules`.

Custom styling can be added to `stylesheets/modules/_custom.scss`.
You can also create your own files and import them into `stylesheets/main.scss`.

**Note:** Add all styling for smallers screens (< 580px) to `stylesheets/media-queries.scss`. This is included separately into the HTML files.

### Local server

Run `gulp serve` to start a local webserver.
Visit **[http://localhost:8080](http://localhost:8080)** on your browser to test your templates.

You can run `gulp serve --open` or `gulp serve -o` to open the URL automatically on your default browser. You can set this option permanently by setting `browsersync.open` to `true` in `gulp.config.js`.

This also instantiates a watcher that:

*   watches for changes in the source folder
*   compiles SASS to CSS
*   builds the HTML files from the templates
*   outputs latest files to *dist/local* folder
*   uses Browsersync to reload the browser

You can also choose a different port by passing the `--port` argument, e.g. `gulp serve --port=8888`.  
You can also change the port permanently in `gulp.config.js`.

### Production files

Run `gulp build` to generate production-ready files.

This compiles production-ready HTML to the *dist/production* folder. It does the following:

*   compiles SASS to CSS
*   builds the HTML files from the templates
*   brings the CSS inline into the HTML and removes the CSS files (except `media-queries.css`)
*   minifies the images (only those that have changed)

#### Minify

If your newsletters are very long, you should minify the HTML so that Gmail doesn't
[clip them](https://www.campaignmonitor.com/forums/topic/8088/what-rule-does-gmail-use-to-decide-when-to-clip-a-message/).

Run `gulp build --minify` to minify your HTML files.

#### Zip files

Some email tools require zip files to upload new templates.

Run `gulp build --zip` to compress images only.

Run `gulp build --zip=all` to compress images and HTML.

### Configuration

All configuration options are in the `gulp.config.js` file.  
To send emails using Nodemailer, update `nodemailer.config.js` with your email credentials and other mail options.

### Nodemailer

[Nodemailer](https://github.com/andris9/nodemailer) lets you quickly test your html email templates.

First update `nodemailer.config.js` with your email credentials and default mail options.

**Email credentials**

```js
transportOptions: {
  service: 'mailgun',
  auth: {
    user: '',
    pass: ''
  }
}
```

Nodemailer supports a lot of services -
see the full list [here](https://github.com/andris9/nodemailer-wellknown#supported-services).
To use your own SMTP configuration, see instructions [here](https://github.com/andris9/nodemailer-smtp-transport#usage).

**Mail Options**

```js
mailOptions: {
  to: '',
  from: '',
  subject: ''
}
```

Set default `to`, `from` and `subject` values. `to` and `subject` can be overridden by passing arguments to the task.

Finally, update `imageHost` with the full Url of the directory where your images are uploaded.
The mail task replaces the relative paths with this Url.

`gulp mail --template=NAME`
`gulp mail -t NAME`
`gulp mail --template=NAME --to=email@example.com --subject='Lorem Ipsum'`

TODO: upload automatically to S3/Rackspace

### Misc

Run `gulp clean` to clean up your build directories.

### Contributing

To contribute, please fork the project and submit pull requests against the `develop` branch.
