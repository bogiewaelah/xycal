// new namespace
XY = {};
XY.Base = {};
XY.Base.App = function() {
    /** Private Zone **/
    var // Function names
        appInit, loadScript, pageInit, mobileInit,
        // Variables
        // Templates
        moduleJSTpl = 'js/app/#{name}.js';

    /** Implementations **/

    /**
     * Function to write to HTML document
     * @scope private
     * @param content The raw content to write to HTML document
     */
    write = function(content) {
        document.write(content);
    };

    /**
     * Function to write meta tag to HTML document
     * @scope private
     * @name name The name of the meta tag
     * @param content The content of the meta tag
     */
    meta = function(name, content) {
        write('<meta name="'+ name +'" content="'+ content +'">');
    };

    /**
     * Function to load Applicaiton javascript and all scripts & stysheets defined in /app/app.json
     * @scope private
     */
    loadScript = function() {
        var i, path, options = {}, xhr = new XMLHttpRequest();
        xhr.open('GET', 'js/app.json', false);
        xhr.send();

        meta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no');
        meta('apple-mobile-web-app-capable', 'yes');
        meta('apple-touch-fullscreen', 'yes');

        options = eval("(" + xhr.responseText + ")");

        for (i = 0; i < options.css.length; i++) {
            path = options.css[i].path;
            write('<link rel="stylesheet" href="'+ path +'">')
        }

        for (i = 0; i < options.js.length; i++) {
            path = options.js[i].path;
            write('<script type="text/javascript" charset="utf-8" src="'+ path +'"></script>')
        }

        XY.Base.MODE = options.mode;
    };

    /**
     * Global application initialization this only executed once
     * @scope public
     */
    appInit = function() {

        // Load stylesheets and scripts
        loadScript();

    };

    /**
     * jQuery Mobile Initialization such as redefine defaults
     * @scope public
     */
    mobileInit = function() {
        // Rhodes custom option!
        // how long to wait transition end before "loading.." message will be shown
        $.mobile.loadingMessageDelay = 300; // in ms

        // Use slide transition by default
        $.mobile.defaultPageTransition = "slide";
    };

    /**
     * Function to load current page initialization scripts defined in data-initjs attribute
     * in data-role="page" element, must be full path of the public function of the module.
     * @scope public
     */
    pageInit = function(e, data) {
        var mode = XY.Base.MODE || 'DEV', execute,
            page = data.toPage, module, script;

        execute = function() {
            // Execute current page initialization
            console.log('function to initialize : ' + script);
            $.execute(script, window);
        }

        script = page.attr('data-initjs');
        module = script && script.count('.') > 2 ?
            $.tmpl(moduleJSTpl, {name: script.split('.')[2]}) : false;
        
        page.find('[data-role=header]').toggleClass('ui-bar-a', false).addClass('ui-bar-b').attr('data-theme', 'b');
        page.find('[data-role=header]').find('a').toggleClass('ui-btn-up-a', false).addClass('ui-btn-up-e').attr('data-theme', 'e');
        
        
        // production mode
        if (script && mode === 'PROD') {
            // loadScript
            console.log('including : ' + module);
            if (module) {
                $.getScript(module, execute);
            }
        }
        // development mode
        else if (script) { execute(); }
    };

    return {
        /** Public Zone **/
        appInit: appInit,
        pageInit: pageInit
    };
}();
XY.Base.App.appInit();
