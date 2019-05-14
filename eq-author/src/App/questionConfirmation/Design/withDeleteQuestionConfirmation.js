import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import { flowRight, partial } from "lodash";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { raiseToast } from "redux/toast/actions";
import { buildPagePath } from "utils/UrlUtils";

import updateMutation from "graphql/questionConfirmation/delete.graphql";

const inputStructure = gql`
  {
    id
  }
`;
const filterToInput = partial(filter, inputStructure);

export const redirectToParentPage = (
  { history, match: { params } },
  questionConfirmation
) => {
  history.push(
    buildPagePath({
      questionnaireId: params.questionnaireId,
      pageId: questionConfirmation.page.id,
      tab: "design",
    })
  );
};

export const displayToast = ({ raiseToast }, questionConfirmation) => {
  raiseToast(
    `QuestionConfirmation${questionConfirmation.id}`,
    "Confirmation deleted"
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteQuestionConfirmation: questionConfirmation =>
    mutate({
      variables: {
        input: filterToInput(questionConfirmation),
      },
    })
      .then(() => redirectToParentPage(ownProps, questionConfirmation))
      .then(() => displayToast(ownProps, questionConfirmation)),
});

export default flowRight(
  withRouter,
  connect(
    null,
    { raiseToast }
  ),
  graphql(updateMutation, {
    props: mapMutateToProps,
  })
);