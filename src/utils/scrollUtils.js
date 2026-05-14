/**
 * Utility functions for scroll management
 */

/**
 * Scroll to top of page immediately
 */
export const scrollToTop = () => {
  // Method 1: Modern browsers
  window.scrollTo(0, 0);

  // Method 2: Fallback for older browsers
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollTop = 0;
  }
};

/**
 * Scroll to top with smooth animation
 */
export const scrollToTopSmooth = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Scroll to specific element
 */
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * Force scroll to top with multiple methods (most reliable)
 */
export const forceScrollToTop = () => {
  // Try multiple methods for maximum compatibility
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Force reflow
    document.body.style.scrollBehavior = 'auto';
    setTimeout(() => {
      document.body.style.scrollBehavior = '';
    }, 100);
  }, 0);
};
