Developing OSLC Applications
============================

[A collection of resources to dive into making OSLC applications.](http://oslc.github.io/developing-oslc-applications/).



Source Content
--------------

The page content is written in Markdown and stored in the `_harp` directory.

I'm using the [Harp](http://harpjs.com/) site generator to convert the Markdown content into the final site that gets deployed to Github Pages.


Testing locally and making pull requests
----------------------------------------

1. Fork this branch of the repository however you're comfortable
2. Install Node. There's almost certainly [an installer available](http://nodejs.org/).
3. At the command line, install harp globally:
    `sudo npm install -g harp`
4. Navigate to the repository directory
5. Start the Harp server: `harp server _harp`
6. In a browser, navigate to http://localhost:9000 and the site will be up. 

    Harp dynamically serves .md Markdown files as compiled HTML (and more). You can modify the Markdown files and just refresh your browser and you'll see the latest.
    
    The `_layout.jade` file has the template bones in the Jade template language. `_data.json` controls the document order and has the page titles.
7. When you've made any changes, compile the site to static files: `harp compile _harp ./` This compiles the site content in `_harp` down to the root folder (`./`) for Github pages.
8. Submit a pull request with all the changes
8. Once committed, the updates will be live on the [Github pages site](http://oslc.github.io/developing-oslc-applications/) in a few minutes.
