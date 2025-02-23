import {createElement} from '../render.js';

function createStartPointListTemplate() {
  return `<ul class="trip-events__list">
   </ul>`;
}

export default class StartPointListView {
  getTemplate() {
    return createStartPointListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
