import { chunk, clamp, sortBy, reverse, get, flowRight } from "lodash";
import { SORT_ORDER } from "./constants";

const PAGE_SIZE = 16;

const calculateAutoFocusId = (questionnaires, deletedQuestionnaire) => {
  const possibleNextIndex =
    questionnaires.indexOf(
      questionnaires.find(q => q.id === deletedQuestionnaire.id)
    ) + 1;

  // If the last one is being removed then focus the one before that
  const nextIndex =
    possibleNextIndex > questionnaires.length - 1
      ? questionnaires.length - 2
      : possibleNextIndex;

  // We have to set focusedId to undefined when there are no
  // questionnaires left
  return (questionnaires[nextIndex] || {}).id;
};

const sortQuestionnaires = state => questionnaires => {
  const sortedQuestionnaires = sortBy(questionnaires, questionnaire =>
    get(questionnaire, state.currentSortColumn).toUpperCase()
  );
  if (state.currentSortOrder === SORT_ORDER.ASCENDING) {
    return sortedQuestionnaires;
  }
  return reverse(sortedQuestionnaires);
};

const filterQuestionnaires = state => questionnaires => {
  const searchTerm = state.searchTerm.toLowerCase();
  return questionnaires.filter(
    q =>
      q.title.toLowerCase().includes(searchTerm) ||
      (q.shortTitle || "").toLowerCase().includes(searchTerm)
  );
};

const buildState = state => {
  const questionnaires = flowRight([
    filterQuestionnaires(state),
    sortQuestionnaires(state),
  ])(state.apiQuestionnaires);

  const pages = chunk(questionnaires, PAGE_SIZE);
  const currentPageIndex = clamp(state.currentPageIndex, 0, pages.length - 1);
  return {
    ...state,
    questionnaires,
    pages,
    currentPageIndex,
    currentPage: pages[currentPageIndex],
  };
};

export const buildInitialState = questionnaires => state =>
  buildState({ ...state, apiQuestionnaires: questionnaires });

export const ACTIONS = {
  CHANGE_PAGE: "CHANGE_PAGE",
  SET_QUESTIONNAIRES: "SET_QUESTIONNAIRES",
  DELETE_QUESTIONNAIRE: "DELETE_QUESTIONNAIRE",
  SORT_COLUMN: "SORT_COLUMN",
  REVERSE_SORT: "REVERSE_SORT",
  SEARCH: "SEARCH",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE_PAGE: {
      const currentPageIndex = clamp(action.payload, 0, state.pages.length - 1);
      return {
        ...state,
        currentPageIndex,
        currentPage: state.pages[currentPageIndex],
        autoFocusId: null,
      };
    }
    case ACTIONS.SET_QUESTIONNAIRES:
      return buildState({
        ...state,
        apiQuestionnaires: action.payload,
      });
    case ACTIONS.DELETE_QUESTIONNAIRE:
      return {
        ...state,
        autoFocusId: calculateAutoFocusId(state.questionnaires, action.payload),
      };
    case ACTIONS.SORT_COLUMN:
      return buildState({
        ...state,
        autoFocusId: null,
        currentSortColumn: action.payload,
        currentSortOrder: SORT_ORDER.ASCENDING,
      });
    case ACTIONS.REVERSE_SORT:
      return buildState({
        ...state,
        autoFocusId: null,
        currentSortOrder: action.payload,
      });
    case ACTIONS.SEARCH:
      return buildState({
        ...state,
        autoFocusId: null,
        currentPageIndex: 0,
        searchTerm: action.payload,
      });
    default:
      return state;
  }
};

export default reducer;