import { curry } from "lodash";
import { generatePath as rrGeneratePath } from "react-router";

import {
  SECTION,
  PAGE,
  QUESTION_CONFIRMATION,
  INTRODUCTION,
} from "../constants/entities";

export const Routes = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  QUESTIONNAIRE: `/q/:questionnaireId/:entityName?/:entityId?/:tab?/:modifier?`,
  QUESTIONNAIRE_NEW: `/q/:questionnaireId/:entityName?/:entityId?/:tab??new=1`,
};

export const generatePath = curry(rrGeneratePath, 2);

export const buildQuestionnairePath = generatePath(Routes.QUESTIONNAIRE);

const sanitiseTab = allowedTabs => tab => {
  if (!tab) {
    return allowedTabs[0];
  }
  if (!allowedTabs.includes(tab)) {
    return allowedTabs[0];
  }
  return tab;
};

export const buildSectionPath = ({ sectionId, tab, ...rest }) => {
  if (!sectionId) {
    throw new Error("Section id must be provided");
  }

  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "preview"])(tab),
    entityId: sectionId,
    entityName: SECTION,
  });
};
export const buildPagePath = ({ pageId, tab, newPage, ...rest }) => {
  if (!pageId) {
    throw new Error("Page id must be provided");
  }
  const route = newPage ? Routes.QUESTIONNAIRE_NEW : Routes.QUESTIONNAIRE;

  return generatePath(route)({
    ...rest,
    tab: sanitiseTab(["design", "routing", "preview"])(tab),
    entityId: pageId,
    entityName: PAGE,
  });
};
export const buildConfirmationPath = ({ confirmationId, tab, ...rest }) => {
  if (!confirmationId) {
    throw new Error("Confirmation id must be provided");
  }
  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "preview"])(tab),
    entityId: confirmationId,
    entityName: QUESTION_CONFIRMATION,
  });
};
export const buildIntroductionPath = ({ introductionId, tab, ...rest }) => {
  if (!introductionId) {
    throw new Error("Confirmation id must be provided");
  }
  return generatePath(Routes.QUESTIONNAIRE)({
    ...rest,
    tab: sanitiseTab(["design", "preview"])(tab),
    entityId: introductionId,
    entityName: INTRODUCTION,
  });
};

const buildTabSwitcher = tab => params => {
  let builder;
  if (params.entityId) {
    builder = buildQuestionnairePath;
  }
  if (params.sectionId) {
    builder = buildSectionPath;
  }
  if (params.pageId) {
    builder = buildPagePath;
  }
  if (params.confirmationId) {
    builder = buildConfirmationPath;
  }
  if (params.introductionId) {
    builder = buildIntroductionPath;
  }
  if (!builder) {
    throw new Error(
      `Cannot find builder for params: ${JSON.stringify(params)}`
    );
  }

  return builder({ ...params, tab });
};

export const buildDesignPath = buildTabSwitcher("design");
export const buildPreviewPath = buildTabSwitcher("preview");
export const buildRoutingPath = buildTabSwitcher("routing");
