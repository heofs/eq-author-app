const executeQuery = require("../../executeQuery");

const queryIntroductionQuery = `
  query GetIntroduction($introductionId: ID!) {
    questionnaireIntroduction(id: $introductionId) {
      id
      title
      description
      secondaryTitle
      secondaryDescription
      collapsibles {
        id
      }
      legalBasis
      tertiaryTitle
      tertiaryDescription
      availablePipingAnswers {
        id
      }
      availablePipingMetadata {
        id
      }
    }
  }
`;

const queryQuestionnaireIntroduction = async (
  questionnaire,
  introductionId
) => {
  const result = await executeQuery(
    queryIntroductionQuery,
    { introductionId },
    { questionnaire }
  );
  return result.data.questionnaireIntroduction;
};

module.exports = {
  queryIntroductionQuery,
  queryQuestionnaireIntroduction,
};
