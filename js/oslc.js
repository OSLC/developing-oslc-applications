window.site_url = window.site_url || '/';

/**
 * Cut the mustard
 */
if( 'querySelector' in document && 'localStorage' in window && 'addEventListener' in window ) {

  /* Catch console.log errors. You are welcome. */
  if (! window.console) {
    window.console = {
      log: function () {}
    };
  }
  
  var OSLC = {
    init: function() {
      
      //
      // SUPER SIMPLE CLASS TOGGLER
      // 
      // On an element, add data-toggle-class="%class string%"
      // Set the target with a CSS selector data-toggle-target="%selector string%"
      // 
      
      document.delegate('[data-toggle-class], [data-toggle-class] > *','click', function(){
        
        var targetEl = this.getAttribute('data-toggle-class') ? this : this.parentElement;
        var toggleClass = targetEl.getAttribute('data-toggle-class');
        var toggleTarget = targetEl.getAttribute('data-toggle-target');
        
        toggleTarget && $( toggleTarget ).classList.toggle( toggleClass );
      });
    
    
      this.makeFluidVideos();
    
    },
    
    //
    // FLUID VIDEOS
    // 
    // Wraps youtube/vimeo iframes in a div.fluid-video class
    // 
    makeFluidVideos: function() {
      
      var videos = document.querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"]');
      var fluidVidTemplate = _.template('<div class="fluid-video" <%= style %> ><%= video %></div>');

      // Filter out .no-resize videos 
      videos = _.reject(videos, function(vid) {
        return vid.classList.contains('no-resize');
      });
      
      _.each( videos, function(vid) {

        var data = {
          style: 'style="padding-bottom: ' + ( vid.height / vid.width * 100 ) + '%;"',
          video: vid.outerHTML
        };

        // Replace the videos HTML with the new template
        vid.outerHTML = fluidVidTemplate( data );
        
      });
      
    }
  };
  
  var polyfills = [
    'classlist'
    ];
  var libraries = [
    'underscore',
    '$',
    'delegate'
    ];
  var load = [];
  
  polyfills.forEach(function( test ){
    Modernizr[test] || load.push( window.site_url + 'js/lib/polyfills/' + test + '.js');
  });
  
  libraries.forEach(function( lib ){
    load.push( window.site_url + 'js/lib/' + lib + '.js' );
  });
  
  Modernizr.load({
    load: load,
    // must .bind to own object, as this will get called in the window context
    complete: OSLC.init.bind(OSLC)
  });

}