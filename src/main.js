import MainPresenter from './presenter/mainPresenter.js';
import EventsModel from './model/eventsModel.js';
import HeaderPresenter from './presenter/headerPresenter.js';
import OffersModel from './model/offersModel.js';
import DestinationsModel from './model/destinationsModel.js';
import FilterModel from './model/filterModel.js';
import FilterPresenter from './presenter/filterPresenter.js';
import Api from './api.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const contentContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');
const headerContainer = document.querySelector('.trip-main');

const eventsApiService = new Api(END_POINT, AUTHORIZATION);

const offersModel = new OffersModel({eventsApiService});
const destinationsModel = new DestinationsModel({eventsApiService});
const eventsModel = new EventsModel({eventsApiService, offersModel, destinationsModel});
const filterModel = new FilterModel();

const mainPresenter = new MainPresenter(contentContainer, headerContainer, eventsModel, offersModel, destinationsModel, filterModel);
const headerPresenter = new HeaderPresenter(headerContainer, eventsModel, destinationsModel, offersModel);
const filterPresenter = new FilterPresenter(filterContainer, eventsModel, filterModel);

eventsModel.init().then((r) => r);

mainPresenter.init();
headerPresenter.init();
filterPresenter.init();
