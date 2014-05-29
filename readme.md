Frontend Workflow
=================

Frontend workflow with [Gulp](https://github.com/gulpjs/gulp) and [Bower](https://github.com/bower/bower).


Installation
------------

1. Install [node.js](http://nodejs.org/)
2. Install Gulp `npm install -g gulp`
2. Install Bower `npm install -g bower`
3. Install dependencies `npm install`


How to use
----------

Run `gulp bower` to fetch current Bower dependencies. The main files are copied to the directory `build`.

Install a browser live-reload plugin to make use of `gulp-livereload`.

Run `gulp` and start coding.


Versioning
----------

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch


Bug tracker
-----------

Have a bug? Please create an issue here on GitHub:

https://github.com/jaylinski/frontend-workflow/issues


Copyright and license
---------------------

Copyright &copy; Jakob Linskeseder

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

You may not use this work for commercial purposes. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. If you alter, transform, or build upon this work, you may distribute the resulting work only under the MIT License (MIT).

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
