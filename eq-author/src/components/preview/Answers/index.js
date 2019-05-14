import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import {
  RADIO,
  CHECKBOX,
  TEXTAREA,
  TEXTFIELD,
  DATE,
  DATE_RANGE,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
} from "constants/answer-types";

import DateAnswer from "./DateAnswer";
import DateRangeAnswer from "./DateRangeAnswer";
import MultipleChoiceAnswer from "./MultipleChoiceAnswer";
import CurrencyAnswer from "./CurrencyAnswer";
import TextAnswer from "./TextAnswer";
import TextAreaAnswer from "./TextAreaAnswer";
import PercentageAnswer from "./PercentageAnswer";

export const answerComponents = {
  [CHECKBOX]: MultipleChoiceAnswer,
  [RADIO]: MultipleChoiceAnswer,
  [CURRENCY]: CurrencyAnswer,
  [NUMBER]: TextAnswer,
  [TEXTFIELD]: TextAnswer,
  [TEXTAREA]: TextAreaAnswer,
  [DATE]: DateAnswer,
  [DATE_RANGE]: DateRangeAnswer,
  [PERCENTAGE]: PercentageAnswer,
};

const AnswerWrapper = styled.div`
  margin-bottom: 1em;
`;

export const Answer = ({ answer }) => {
  const Component = answerComponents[answer.type];
  return (
    <AnswerWrapper>
      <Component answer={answer} />
    </AnswerWrapper>
  );
};
Answer.propTypes = {
  answer: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(answerComponents)).isRequired,
  }).isRequired,
};