import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, radius } from "constants/theme";
import gql from "graphql-tag";
import fp from "lodash/fp";

import CustomPropTypes from "custom-prop-types";

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
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";

import MultipleChoiceAnswer from "App/page/Design/answers/MultipleChoiceAnswer";
import DateRange from "App/page/Design/answers/DateRange";
import Date from "App/page/Design/answers/Date";
import BasicAnswer from "App/page/Design/answers/BasicAnswer";

const Answer = styled.div`
  border: 1px solid ${colors.bordersLight};
  position: relative;
  border-radius: ${radius};
  background: ${colors.white};
  &:focus-within {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 1px ${colors.blue};
  }
  margin: 1em 2em;
`;

const AnswerHeader = styled.div`
  background: ${colors.lightMediumGrey};
  border-bottom: 1px solid ${colors.bordersLight};
  border-radius: ${radius} ${radius} 0 0;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: flex-end;
`;

const AnswerType = styled.span`
  text-align: center;
  font-size: 0.8em;
  font-weight: bold;
  color: ${colors.textLight};
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1;
`;

const Padding = styled.div`
  padding: 1em 6em 1em 1.5em;
`;

const Buttons = styled.div`
  display: flex;
  z-index: 2;
  position: relative;
`;

class AnswerEditor extends React.Component {
  state = {
    answerLostFocus: false,
  };

  constructor(props) {
    super(props);
    this.answerNode = React.createRef();
  }

  handleDeleteAnswer = () => {
    this.props.onDeleteAnswer(this.props.answer.id);
  };

  handleLostFocus = () => {
    const focusNode = this.answerNode.current;
    const isWithin = focusNode.querySelector(":focus-within");
    if (!isWithin) {
      this.setState({
        answerLostFocus: true,
      });
    }
  };

  formatIncludes = x =>
    fp.flow(
      fp.get("properties.format"),
      fp.includes(x)
    );

  renderAnswer(answer) {
    const { type } = answer;
    const { answerLostFocus } = this.state;

    if ([TEXTFIELD, TEXTAREA].includes(type)) {
      return <BasicAnswer {...this.props} answerLostFocus={answerLostFocus} />;
    }
    if ([PERCENTAGE, NUMBER, CURRENCY].includes(type)) {
      return (
        <BasicAnswer
          {...this.props}
          showDescription
          answerLostFocus={answerLostFocus}
        />
      );
    }
    if (type === CHECKBOX) {
      return (
        <MultipleChoiceAnswer
          type={answer.type}
          {...this.props}
          answerLostFocus={answerLostFocus}
        />
      );
    }
    if (type === RADIO) {
      return (
        <MultipleChoiceAnswer
          minOptions={2}
          type={answer.type}
          {...this.props}
          answerLostFocus={answerLostFocus}
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
      <div ref={this.answerNode}>
        <Answer onBlur={this.handleLostFocus} data-test="answer-editor">
          <AnswerHeader>
            <AnswerType data-test="answer-type">
              {this.props.answer.type}
            </AnswerType>

            <Buttons>
              <Tooltip
                content="Move answer up"
                place="top"
                offset={{ top: 0, bottom: 10 }}
              >
                <MoveButton
                  disabled={!this.props.canMoveUp}
                  onClick={this.props.onMoveUp}
                  data-test="btn-move-answer-up"
                >
                  <IconUp />
                </MoveButton>
              </Tooltip>
              <Tooltip
                content="Move answer down"
                place="top"
                offset={{ top: 0, bottom: 10 }}
              >
                <MoveButton
                  disabled={!this.props.canMoveDown}
                  onClick={this.props.onMoveDown}
                  data-test="btn-move-answer-down"
                >
                  <IconDown />
                </MoveButton>
              </Tooltip>
              <Tooltip
                content="Delete answer"
                place="top"
                offset={{ top: 0, bottom: 10 }}
              >
                <DeleteButton
                  size="medium"
                  onClick={this.handleDeleteAnswer}
                  aria-label="Delete answer"
                  data-test="btn-delete-answer"
                />
              </Tooltip>
            </Buttons>
          </AnswerHeader>

          <Padding>{this.renderAnswer(this.props.answer)}</Padding>
        </Answer>
      </div>
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
  canMoveDown: PropTypes.bool.isRequired,
  canMoveUp: PropTypes.bool.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
};

AnswerEditor.fragments = {
  AnswerEditor: gql`
    fragment AnswerEditor on Answer {
      ...Answer
      ...MultipleChoice
      ...DateRange
      ...Date
      ...BasicAnswer
      isNew @client
    }
    ${BasicAnswer.fragments.Answer}
    ${BasicAnswer.fragments.BasicAnswer}
    ${MultipleChoiceAnswer.fragments.MultipleChoice}
    ${DateRange.fragments.DateRange}
    ${Date.fragments.Date}
  `,
};

export default AnswerEditor;
