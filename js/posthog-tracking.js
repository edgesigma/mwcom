// PostHog tracking for mwcom portfolio
(function(){
  // Load PostHog
  (function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var c=e;for(void 0!==a?c=e[a]=[]:a="posthog",c.people=c.people||[],c.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},c.people.toString=function(){return c.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once reset group add_group remove_group track_pageview register unregister get_distinct_id get_property get_feature_flag onFeatureFlags reloadFeatureFlags isFeatureEnabled onFeatureFlag".split(" "),n=0;n<o.length;n++)g(c,o[n]);e._i.push([i,s,a])},e.__SV=1)})(document,window.posthog||[]);
  posthog.init('phc_a94fsl13aOmdJkNocQWfiMvzZjmqhbssuCnDh56PN4u', {api_host: 'https://app.posthog.com'});

  // Set environment property for all events
  var env = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'development' : 'production';
  posthog.register({ env: env });

  // Track video switcher events
  document.addEventListener('DOMContentLoaded', function() {
    var carousels = document.querySelectorAll('[id^="gallery-carousel"]');
    carousels.forEach(function(carousel) {
      carousel.addEventListener('click', function(e) {
        var target = e.target;
        if(target.tagName === 'IMG' && target.dataset.video) {
          posthog.capture('video_switch', {
            video: target.dataset.video,
            caption: target.dataset.caption || ''
          });
        }
      });
    });

    // Track outbound link clicks
    document.body.addEventListener('click', function(e) {
      var link = e.target.closest('a');
      if(link && link.href && link.hostname !== location.hostname) {
        posthog.capture('outbound_link_click', {
          href: link.href,
          text: link.textContent.trim()
        });
      }
    });

    // Track section views (simple intersection observer)
    var sections = document.querySelectorAll('.projectHeader');
    var seen = new Set();
    if('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if(entry.isIntersecting && !seen.has(entry.target)) {
            seen.add(entry.target);
            posthog.capture('section_view', {
              section: entry.target.textContent.trim()
            });
          }
        });
      }, {threshold: 0.5});
      sections.forEach(function(section) { observer.observe(section); });
    }

    // Track summary paragraph in-page navigation links
    ['#fullStackDev', '#publicArt', '#aiEnthusiast'].forEach(function(anchor) {
      var links = document.querySelectorAll('a[href="' + anchor + '"]');
      links.forEach(function(link) {
        link.addEventListener('click', function() {
          posthog.capture('summary_nav_click', {
            target_section: anchor.replace('#', '')
          });
        });
      });
    });
  });
})();
