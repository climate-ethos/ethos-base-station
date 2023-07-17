import { Directive } from 'vue';

const scrollToElement = (scrollDiv: Element | null, inputElement: Element) => {
  if (!scrollDiv) return;
  const yOffset = -10; // number of pixels padding
  const y =
    inputElement.getBoundingClientRect().top +
    scrollDiv.scrollTop -
    scrollDiv.getBoundingClientRect().top +
    yOffset;
  // Scroll to y location
  scrollDiv.scrollTo({ top: y, behavior: 'smooth' });
};

export const scrollToInput: Directive = {
  mounted(el: Element, binding) {
    let scrollParent: null | Element = null;
    // Get HTML element from supplied ID
    if (!binding.arg) {
      // No argument supplied, get base-scroll-area HTML Element
      scrollParent = el.closest('.base-scroll-area');
    } else {
      scrollParent = el.closest(binding.arg);
    }
    // Get the first child of scroll parent, which is the div we need to scroll
    const scrollDiv = scrollParent?.firstChild as Element;

    // Bind to focus and perform auto-scroll
    el.addEventListener('focusin', async () => {
      setTimeout(() => scrollToElement(scrollDiv, el), 150);
    });
  },
};
