// Select the homepage element
const homepage = document.querySelector('.homepage');

// Define the scroll listener function
function handleScroll() {
  // Get the current scroll position
  const scrollPosition = window.scrollY;
  
  // If the scroll position is greater than 2, make the homepage element fixed and update its style
  if (scrollPosition > 2) {
    homepage.style.position = 'fixed';
    homepage.style.width = '100%';
    homepage.style.fontSize = '1.6rem';
    homepage.style.textAlign = 'right';
    homepage.style.top = '0';
    homepage.style.left = '0';
    homepage.style.border = 'none';
    homepage.style.borderBottom = '3px solid black';
  } else {
    // Otherwise, reset the homepage element to its original style
    homepage.style.position = '';
    homepage.style.width = '';
    homepage.style.fontSize = '';
    homepage.style.textAlign = '';
    homepage.style.top = '';
    homepage.style.left = '';
    homepage.style.border = '';
    homepage.style.borderLeft = '3px solid black';
    homepage.style.borderBottom = '';
  }
}

// Add the scroll listener to the window object
window.addEventListener('scroll', () => {
  console.log('Transitioning...');
  // Use requestAnimationFrame to throttle the scroll listener
  window.requestAnimationFrame(handleScroll);
});
