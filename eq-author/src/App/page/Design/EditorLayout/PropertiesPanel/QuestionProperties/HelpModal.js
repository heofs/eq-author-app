import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import ModalFullScreen from "components/modals/ModalFullScreen";
import Anatomy from "./anatomy.svg?inline";

import { colors } from "constants/theme";

const StyledAnatomy = styled(Anatomy)`
  width: 100%;
  max-width: 90em;
  height: auto;
`;

const Content = styled.div`
  height: 100%;
  padding: 2em;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

const Title = styled.h1`
  text-transform: uppercase;
  font-size: 0.9em;
  letter-spacing: 0.05em;
  text-align: center;
  margin: 1em auto 2em;
  color: ${colors.text};
`;

const StyledModal = styled(ModalFullScreen)`
  .Modal {
    background: ${colors.white};
    transform: scale(1);
    transform-origin: center center;
    transition: all 50ms ease-in 50ms;
    opacity: 0;

    &--after-open {
      transform: scale(1);
      opacity: 1;
    }

    &--before-close {
      transform: scale(1);
      opacity: 0;
    }
  }
`;

const HelpModal = ({ isOpen, onClose }) => (
  <StyledModal isOpen={isOpen} onClose={onClose}>
    <Content>
      <Title>The anatomy of a question</Title>
      <StyledAnatomy />
    </Content>
  </StyledModal>
);

HelpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HelpModal;
