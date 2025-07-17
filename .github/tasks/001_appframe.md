# Task 001 - develop HTML5 app frame for the project

## Status
Completed

## Description
The app frame holds and presents page content. best practice advise wrapping each page section in an element that covers the full width of the viewport. Then, the inner element which directly contains page elements can have its width limited on viewport sizes too wide for the layout to appear properly. please wrap each page section (header, main, footer) in a div element with the class 'container'. in your apprame.css file, create a CSS ruleset targeting all elements with the class 'container' and ensure that they cover the full width of the viewport. for the section elements: header, main and footer, the max-width property should be defined at 900px.

## Acceptance Criteria
- [x] valid HTML5 markup
- [x] this task only requires the minimal CSS to keep the app frame covering 100% of the viewport
- [x] all static assets should be loaded locally. no CDN-loaded assets
- [x] all CSS rulesets related to this task belong in a single file in the css/ folder