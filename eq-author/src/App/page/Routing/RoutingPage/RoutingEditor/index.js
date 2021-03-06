import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import { flow } from "lodash/fp";

import Button from "components/buttons/Button";

import Transition from "App/page/Routing/Transition";
import DestinationSelector from "App/page/Routing/DestinationSelector";

import transformNestedFragments from "utils/transformNestedFragments";

import fragment from "./fragment.graphql";
import withUpdateRouting from "./withUpdateRouting";
import withCreateRule from "./withCreateRule";
import RuleEditor from "./RuleEditor";

export const LABEL_IF = "IF";
export const LABEL_ELSE_IF = "ELSE IF";

const AddRuleButton = styled(Button)`
  display: block;
  margin: 2em auto;
  padding: 0.8em 2em;
  border-radius: 2em;
  border-width: 2px;
`;

export class UnwrappedRoutingEditor extends React.Component {
  static fragments = [fragment, ...RuleEditor.fragments];

  static propTypes = {
    routing: propType(transformNestedFragments(fragment, RuleEditor.fragments))
      .isRequired,
    updateRouting: PropTypes.func.isRequired,
    createRule: PropTypes.func.isRequired,
  };

  handleAddClick = () => {
    this.props.createRule(this.props.routing.id);
  };

  handleElseChange = destination => {
    this.props.updateRouting({
      ...this.props.routing,
      else: destination,
    });
  };

  render() {
    const { routing } = this.props;
    return (
      <>
        <TransitionGroup>
          {routing.rules.map((rule, index) => (
            <Transition key={rule.id}>
              <RuleEditor
                rule={rule}
                key={rule.id}
                ifLabel={index > 0 ? LABEL_ELSE_IF : LABEL_IF}
              />
            </Transition>
          ))}
        </TransitionGroup>
        <AddRuleButton
          variant="secondary"
          small
          onClick={this.handleAddClick}
          data-test="btn-add-rule"
        >
          Add rule
        </AddRuleButton>

        <DestinationSelector
          id="else"
          label="ELSE"
          value={routing.else}
          onChange={this.handleElseChange}
          data-test="select-else"
        />
      </>
    );
  }
}

const withMutations = flow(withUpdateRouting, withCreateRule);

export default withMutations(UnwrappedRoutingEditor);
