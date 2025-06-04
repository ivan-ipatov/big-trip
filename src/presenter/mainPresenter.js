import SortingView from '../view/sorting.js';
import EventsListView from '../view/pointsList.js';
import EmptyListView from '../view/emptyListView.js';
import LoadingView from '../view/loadingView.js';
import FailedLoadView from '../view/failedLoadView.js';
import PointPresenter from './pointPresenter.js';
import NewEventView from '../view/newEventView.js';
import NewPointPresenter from './newPointPresenter.js';
import { filter, sort, isEscapeKey } from '../utils.js';
import { FilterTypes, NoEventsTexts, SortTypes, TimeLimit, UpdateType, UserAction } from '../const.js';
import { RenderPosition, remove, render } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

/**
 * Main presenter class that manages the entire points board
 * @class MainPresenter
 */
class MainPresenter {
  #eventsListComponent = new EventsListView();
  #emptyListComponent = null;
  #sortingComponent = null;
  #newEventButtonComponent = null;
  #loadingComponent = new LoadingView();
  #errorComponent = new FailedLoadView();
  #listContainer = null;
  #buttonContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;
  #activeSortType = SortTypes.DAY;
  #pointPresenters = new Map();
  #isLoading = true;
  #isAddingNewEvent = false;
  #newPointPresenter = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  /**
   * Creates an instance of MainPresenter
   * @param {HTMLElement} listContainer - Container for the events list
   * @param {HTMLElement} buttonContainer - Container for the new event button
   * @param {Object} eventsModel - Model for events data
   * @param {Object} offersModel - Model for offers data
   * @param {Object} destinationsModel - Model for destinations data
   * @param {Object} filterModel - Model for filter data
   */
  constructor(listContainer, buttonContainer, eventsModel, offersModel, destinationsModel, filterModel) {
    this.#listContainer = listContainer;
    this.#buttonContainer = buttonContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  /**
   * Get filtered and sorted events
   * @returns {Array} Filtered and sorted events
   */
  get events() {
    const filteredEvents = filter[this.#filterModel.filter](this.#eventsModel.events);
    sort[this.#activeSortType](filteredEvents);
    return filteredEvents;
  }

  /**
   * Get available offers
   * @returns {Array} List of offers
   */
  get offers() {
    return this.#offersModel.offers;
  }

  /**
   * Get available destinations
   * @returns {Array} List of destinations
   */
  get destinations() {
    return this.#destinationsModel.destinations;
  }

  /**
   * Initialize the presenter
   */
  init() {
    this.#renderFullPointsBoard();
  }

  /**
   * Handle view actions (update, add, delete events)
   * @private
   * @param {string} actionType - Type of action
   * @param {string} updateType - Type of update
   * @param {Object} update - Update data
   */
  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newPointPresenter.setSaving();
        this.#isAddingNewEvent = false;
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(error) {
          this.#newPointPresenter.setAborting();
          this.#isAddingNewEvent = true;
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  /**
   * Handle model events
   * @private
   * @param {string} updateType - Type of update
   * @param {Object} data - Update data
   */
  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearFullBoard();
        this.#renderFullPointsBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearFullBoard();
        this.#renderFullPointsBoard({resetSortType: true});
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFullPointsBoard();
        this.#renderNewEventButton();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderErrorComponent();
    }
  };

  /**
   * Handle mode changes
   * @private
   */
  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetFormView());
  };

  /**
   * Handle sort changes
   * @private
   * @param {Event} evt - Sort change event
   */
  #handleSortChange = (evt) => {
    if (evt.target.closest('input')) {
      if (this.#activeSortType === evt.target.dataset.sortType) {
        return;
      }
      this.#activeSortType = evt.target.dataset.sortType;
      this.#clearPointsBoard();
      this.#renderPoints();
    }
  };

  /**
   * Handle new event button click
   * @private
   */
  #handleAddPointBtnClick = () => {
    this.#isAddingNewEvent = true;
    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventsListComponent.element,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onResetForm: this.#handleNewEventFormClose
    });
    this.#activeSortType = SortTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#handleModeChange();
    this.#newPointPresenter.init();
    this.#newEventButtonComponent.element.disabled = true;
    document.addEventListener('keydown', this.#escapeKeydownHandler);
    remove(this.#emptyListComponent);
  };

  /**
   * Handle escape key press
   * @private
   * @param {KeyboardEvent} evt - Keyboard event
   */
  #escapeKeydownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#newPointPresenter.destroy();
      document.removeEventListener('keydown', this.#escapeKeydownHandler);
    }
  };

  /**
   * Handle new event form close
   * @private
   */
  #handleNewEventFormClose = () => {
    this.#newEventButtonComponent.element.disabled = false;
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
    this.#isAddingNewEvent = false;
    if (this.events.length === 0) {
      this.#renderEmptyListComponent();
    }
  };

  /**
   * Render new event button
   * @private
   */
  #renderNewEventButton() {
    this.#newEventButtonComponent = new NewEventView({onBtnClick: this.#handleAddPointBtnClick});
    render(this.#newEventButtonComponent, this.#buttonContainer);
  }

  /**
   * Render sorting component
   * @private
   */
  #renderSortingComponent() {
    this.#sortingComponent = new SortingView({
      onSortChange: this.#handleSortChange,
      currentSortType: this.#activeSortType
    });
    render(this.#sortingComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
  }

  /**
   * Render full points board
   * @private
   * @param {Object} options - Render options
   * @param {boolean} [options.resetSortType=false] - Whether to reset sort type
   */
  #renderFullPointsBoard({resetSortType = false} = {}) {
    render(this.#eventsListComponent, this.#listContainer);
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#listContainer);
      return;
    }
    if (this.events.length === 0) {
      this.#renderEmptyListComponent();
      return;
    }
    if (resetSortType) {
      this.#activeSortType = SortTypes.DAY;
    }
    this.#renderSortingComponent();
    this.#renderPoints();
  }

  /**
   * Render all points
   * @private
   */
  #renderPoints() {
    for (let i = 0; i < this.events.length; i++) {
      this.#renderPoint(this.events[i]);
    }
  }

  /**
   * Render empty list component
   * @private
   */
  #renderEmptyListComponent() {
    this.#emptyListComponent = new EmptyListView({text: NoEventsTexts[this.#filterModel.filter]});
    render(this.#emptyListComponent, this.#listContainer);
  }

  /**
   * Render error component
   * @private
   */
  #renderErrorComponent() {
    render(this.#errorComponent, this.#listContainer);
  }

  /**
   * Clear full board
   * @private
   */
  #clearFullBoard() {
    remove(this.#emptyListComponent);
    remove(this.#loadingComponent);
    remove(this.#errorComponent);
    remove(this.#sortingComponent);
    if (!this.#isAddingNewEvent && this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#clearPointsBoard();
  }

  /**
   * Clear points board
   * @private
   */
  #clearPointsBoard() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
  }

  /**
   * Render single point
   * @private
   * @param {Object} point - Point data
   */
  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsContainer: this.#eventsListComponent.element,
      offers: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      newPointFormComponent: this.#newPointPresenter
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}

export default MainPresenter;
