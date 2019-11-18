import React from "react";
import styled from "styled-components";

import Input from ".";
import Form from "../Form";

const StyledForm = styled(Form)`
  max-width: 16em;
  display: flex;
  flex-direction: column;
  > input {
    margin-bottom: 5px;
  }
`;

export default { title: "Forms.Input" };

export const Text = () => (
  <StyledForm>
    <Input value="This is a standard text input" />
    <Input value="This input has been disabled" disabled />
    <Input placeholder="This input has placeholder text" />
  </StyledForm>
);

export const Checkbox = () => (
  <StyledForm>
    <Input type="checkbox" name="example" />
    <Input type="checkbox" name="example" />
    <Input type="checkbox" name="example" disabled />
    <Input type="checkbox" name="example" />
  </StyledForm>
);

export const Radio = () => (
  <StyledForm>
    <Input type="radio" name="example" />
    <Input type="radio" name="example" />
    <Input type="radio" name="example" disabled />
    <Input type="radio" name="example" />
  </StyledForm>
);
