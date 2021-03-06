const { first, flatMap, filter, forEach, uniq } = require("lodash/fp");

const { NULL } = require("../../constants/routingNoLeftSide");
const totalableAnswerTypes = require("../../constants/totalableAnswerTypes");

const answerTypeToConditions = require("./answerTypeToConditions");
const createTotalValidation = require("./createTotalValidation");

const updateNullExpressions = (page, answer) => {
  if (!page.routing) {
    return;
  }

  if (!answerTypeToConditions.isAnswerTypeSupported(answer.type)) {
    return;
  }

  if (answer !== first(page.answers)) {
    return;
  }

  const condition = answerTypeToConditions.getDefault(answer.type);

  const expressions = filter(
    expression => expression.left.type === NULL,
    flatMap(rule => rule.expressionGroup.expressions, page.routing.rules)
  );

  forEach(expression => {
    expression.condition = condition;
    expression.left.answerId = answer.id;
    expression.left.type = "Answer";
    expression.left.nullReason = undefined;
  }, expressions);
};

const createOrRemoveAnswerGroup = (page, newAnswer) => {
  const answerTypes = uniq(page.answers.map(a => a.type));
  if (answerTypes.length > 1) {
    page.totalValidation = null;
    return;
  }

  if (!totalableAnswerTypes.includes(newAnswer.type)) {
    return;
  }

  const numberOfAnswersOfType = page.answers.filter(
    answer => answer.type === newAnswer.type
  ).length;
  if (numberOfAnswersOfType !== 2) {
    return;
  }

  page.totalValidation = createTotalValidation();
};

module.exports = (page, answer) => {
  updateNullExpressions(page, answer);
  createOrRemoveAnswerGroup(page, answer);
};
