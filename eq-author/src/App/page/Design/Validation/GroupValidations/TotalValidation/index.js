import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import totalFragment from "graphql/fragments/total-validation-rule.graphql";

import ValidationView from "../../ValidationView";
import DisabledMessage from "../../DisabledMessage";

import withToggleValidationRule from "../../withToggleValidationRule";

import TotalValidationEditor from "./TotalValidationEditor";

export const TotalValidation = ({ total, type, onToggleValidationRule }) => {
  const { enabled } = total;

  return (
    <ValidationView
      onToggleChange={({ value: enabled }) => {
        onToggleValidationRule({ ...total, enabled });
      }}
      enabled={enabled}
    >
      {!enabled && <DisabledMessage data-test="disabled-total" name="Total" />}
      {enabled && (
        <TotalValidationEditor
          data-test="validation-editor"
          total={total}
          type={type}
        />
      )}
    </ValidationView>
  );
};

TotalValidation.propTypes = {
  total: propType(totalFragment).isRequired,
  type: PropTypes.string.isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
};

export default withToggleValidationRule(TotalValidation);
