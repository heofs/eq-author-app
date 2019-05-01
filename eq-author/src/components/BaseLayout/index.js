import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import App from "./App";
import Header from "components/Header";

import { Titled } from "react-titled";

import ConnectedOfflineBanner from "components/OfflineBanner";
import { PermissionsBanner } from "components/PermissionsBanner";

import CustomPropTypes from "custom-prop-types";
import { colors } from "constants/theme";

import ToastContainer from "components/ToastContainer";

const Wrapper = styled.div`
  background-color: ${colors.lighterGrey};
  height: 100vh;
  min-width: 80em;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const BaseLayout = ({ children, title, questionnaire }) => (
  <Titled title={() => title}>
    <App>
      <Wrapper>
        <Header questionnaire={questionnaire} title={title} />
        <ConnectedOfflineBanner />
        {questionnaire && <PermissionsBanner isEditor />}
        <Main>{children}</Main>
        {ReactDOM.createPortal(
          <ToastContainer />,
          document.getElementById("toast")
        )}
      </Wrapper>
    </App>
  </Titled>
);

BaseLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  questionnaire: CustomPropTypes.questionnaire,
};

BaseLayout.defaultProps = {
  title: "Author",
};

export default BaseLayout;
