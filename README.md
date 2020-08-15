### Flatiron School: Seattle 0420 Cohort
# Vision Board: Module 3 Project

# Description: 
This project was designed to enable a user to create, edit, and delete vision boards with associated goals. Through the tool a user can:

* Create an account

![Alt text](https://github.com/mathewpwheatley/module-3-project-vision-board/raw/master/ReadmeImg/Signup.png)

* Login to an existing account

![Alt text](https://github.com/mathewpwheatley/module-3-project-vision-board/raw/master/ReadmeImg/Login.png)

* Create, edit, and delete a vision board

![Alt text](https://github.com/mathewpwheatley/module-3-project-vision-board/raw/master/ReadmeImg/NewBoard.png)

* Create, edit and delete a goal

![Alt text](https://github.com/mathewpwheatley/module-3-project-vision-board/raw/master/ReadmeImg/NewGoal.png)

* View all boards and related goals

![Alt text](https://github.com/mathewpwheatley/module-3-project-vision-board/raw/master/ReadmeImg/BoardWithGoals.png)


The interactive frontend of this application is built on vanilla HTML and Javascript. The backend leverages Ruby on Rails API functionality to receive and send AJAX requests in a JSON format.

# Team:
* Colton Kaiser
* David Knudson
* Joshua Mclean
* Mathew Wheatley

# Dependencies:
* Node Package Manager (NPM)
* local-web-server
* Google Chrome (80.0.3987.149)

# Installation:
Download this entire git repository to your computer and place in your desired install directory.
If you do not currently have Node Package Manager (NPM) and you'd like to view this app locally (not on the hosted site), make sure to install it before moving forward. You can follow their guide here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm. After installation, in your terminal run `npm install -g local-web-server` to install local-web-server, which you'll need to run the app locally.

# Running:
This project is hosted on Github Pages here: https://ckaiser258.github.io/VisionBoard/. If you'd like to view it locally:
1. Make sure you've installed the backend repo for this application (located here: https://github.com/ckaiser258/visionboard-backend) and have followed the installation/running instructions.
2. In your terminal, run `ws`to start up the local web server.
3. Next, from your Google Chrome browser navigate to localhost:8000. At this point the front end of the application will load.

NOTE: If you're planning on making changes to the backend repo and/or using it instead of the hosted backend: Open this repo in your text editor and comment out line 1 of index.js, then comment IN line 2.

# License:


Copyright 2020 Colton Kaiser, Joshua Mclean, Mathew Wheatley, David Knudson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
