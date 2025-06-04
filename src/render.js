/**
 * Enum for DOM insertion positions
 * @enum {string}
 */
const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 * Creates a DOM element from HTML template string
 * @param {string} template - HTML template string
 * @returns {HTMLElement} Created DOM element
 */
const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

/**
 * Renders a component into a container at specified position
 * @param {Object} component - Component instance with getElement method
 * @param {HTMLElement} container - Container element to render into
 * @param {RenderPosition} [place=RenderPosition.BEFOREEND] - Position to insert the component
 */
const render = (component, container, place = RenderPosition.BEFOREEND) => {
  container.insertAdjacentElement(place, component.getElement());
};

export {RenderPosition, createElement, render};
