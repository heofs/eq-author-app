import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, radius } from "constants/theme";

import CustomPropTypes from "custom-prop-types";
import DeleteButton from "components/buttons/DeleteButton";
import fp from "lodash/fp";

import MultipleChoiceAnswer from "App/questionPage/Design/answers/MultipleChoiceAnswer";
import DateRange from "App/questionPage/Design/answers/DateRange";
import Date from "App/questionPage/Design/answers/Date";
import {
  TEXTFIELD,
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  TEXTAREA,
  CHECKBOX,
  RADIO,
  DATE_RANGE,
} from "constants/answer-types";
import CurrencyAnswer from "App/questionPage/Design/answers/CurrencyAnswer";
import Tooltip from "components/Forms/Tooltip";
import BasicAnswer from "App/questionPage/Design/answers/BasicAnswer";
import gql from "graphql-tag";

const Answer = styled.div`
  border: 1px solid ${colors.bordersLight};
  position: relative;
  border-radius: ${radius};

  &:focus-within {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 1px ${colors.blue};
  }
`;

const AnswerType = styled.div`
  background: ${colors.lightMediumGrey};
  border-bottom: 1px solid ${colors.bordersLight};
  text-align: center;
  padding: 0.5em 1em;
  font-size: 0.8em;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: ${radius} ${radius} 0 0;
`;

const Padding = styled.div`
  padding: 2em 6em 1.5em 1.5em;
`;

export const AnswerDeleteButton = styled(DeleteButton)`
  position: absolute;
  right: 0.2em;
  top: 1em;
`;

class AnswerEditor extends React.Component {
  handleDeleteAnswer = () => {
    this.props.onDeleteAnswer(this.props.answer.id);
  };

  formatIncludes = x =>
    fp.flow(
      fp.get("properties.format"),
      fp.includes(x)
    );

  renderAnswer(answer) {
    const { type } = answer;
    if ([TEXTFIELD, TEXTAREA].includes(type)) {
      return <BasicAnswer {...this.props} />;
    }
    if ([PERCENTAGE, NUMBER].includes(type)) {
      return <BasicAnswer {...this.props} showDescription />;
    }
    if (type === CURRENCY) {
      return <CurrencyAnswer {...this.props} />;
    }
    if (type === CHECKBOX) {
      return <MultipleChoiceAnswer type={answer.type} {...this.props} />;
    }
    if (type === RADIO) {
      return (
        <MultipleChoiceAnswer
          minOptions={2}
          type={answer.type}
          {...this.props}
        />
      );
    }
    if (type === DATE_RANGE) {
      return <DateRange {...this.props} />;
    }
    // Only option left is Date as validation done in prop types
    return (
      <Date
        {...this.props}
        showDay={this.formatIncludes("dd")(answer)}
        showMonth={this.formatIncludes("mm")(answer)}
        showYear={this.formatIncludes("yyyy")(answer)}
      />
    );
  }

  render() {
    return (
      <Answer>
        <AnswerType>{this.props.answer.type}</AnswerType>
        <Padding>{this.renderAnswer(this.props.answer)}</Padding>
        <Tooltip
          content="Delete answer"
          place="top"
          offset={{ top: 0, bottom: 10 }}
        >
          <AnswerDeleteButton
            size="medium"
            onClick={this.handleDeleteAnswer}
            aria-label="Delete answer"
            data-test="btn-delete-answer"
          />
        </Tooltip>
      </Answer>
    );
  }
}

AnswerEditor.propTypes = {
  answer: CustomPropTypes.answer,
  onUpdate: PropTypes.func.isRequired,
  onDeleteAnswer: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onAddExclusive: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
};

AnswerEditor.fragments = {
  AnswerEditor: gql`
    fragment AnswerEditor on Answer {
      ...Answer
      ...MultipleChoice
      ...DateRange
      ...Date
      ...BasicAnswer
    }
    ${BasicAnswer.fragments.Answer}
    ${BasicAnswer.fragments.BasicAnswer}
    ${MultipleChoiceAnswer.fragments.MultipleChoice}
    ${DateRange.fragments.DateRange}
    ${Date.fragments.Date}
  `,
};

export default AnswerEditor;
