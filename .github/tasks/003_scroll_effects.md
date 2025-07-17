# Task 003 - Add scroll-based behaviors to the page 

## Status
To-Do

## Description
The hero section will appear to stick at the top of the viewport as the user scrolls vertically down the page. 

As the page scrolls, the hero section will appear to recede into the background as the next section appears to scroll above it. This receeding effect will involve using translate3D and rotate3D. From a neutral start, the element should animate to the values: `transform: rotateX(32deg) translateZ(-114px);`. In addition to the translation, we'll apply a blur (filter: blur(4px);) to the hero section DOM element. 

This scroll-activated effect will begin (timeline position 0) with the viewport scrolled all the way to the top of the page. This animation will end (timeline position 1) when the next page element (typically a stackable body section) reaches the top of the viewport. 

## Acceptance Criteria
- Approval is up to me. The page must be rendered and tested for accuracy.