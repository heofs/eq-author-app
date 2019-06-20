import React, { Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";
import HomeIcon from "./icon-home.svg?inline";
import SettingsIcon from "./icon-cog.svg?inline";
import MetadataIcon from "./icon-metadata.svg?inline";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import MetadataModal from "App/MetadataModal";
import Button from "components/buttons/Button";
import RouteButton from "components/buttons/Button/RouteButton";
import IconText from "components/IconText";
import gql from "graphql-tag";

import pipeP from "utils/pipeP";
import AddMenu from "./AddMenu";

const IconList = styled.ul`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  z-index: 9999;
  flex: 1 1 auto;
`;

const IconListItem = styled.li`
  display: flex;
  align-items: center;
  margin-right: 1em;
`;

const HomeIconLink = styled(HomeIcon)`
  vertical-align: middle;
`;

const NavTitle = styled.div`
  font-size: 0.8em;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: bold;
`;

const NavigationHeaderRow = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5em 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledAddMenu = styled(AddMenu)`
  margin-left: auto;
`;

export class NavigationHeader extends React.Component {
  static propTypes = {
    onUpdateQuestionnaire: PropTypes.func.isRequired,
    canAddQuestionPage: PropTypes.bool.isRequired,
    onAddQuestionPage: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    questionnaire: CustomPropTypes.questionnaire.isRequired,
    canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
    onAddCalculatedSummaryPage: PropTypes.func.isRequired,
    canAddQuestionConfirmation: PropTypes.bool.isRequired,
    onAddQuestionConfirmation: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        modifier: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  state = {
    isSettingsModalOpen: this.props.match.params.modifier === "settings",
    isMetadataModalOpen: false,
    addMenuOpen: false,
  };

  handleSettingsModalOpen = () => this.setState({ isSettingsModalOpen: true });

  handleSettingsModalClose = () =>
    this.setState({ isSettingsModalOpen: false });

  handleMetadataModalOpen = () => this.setState({ isMetadataModalOpen: true });

  handleMetadataModalClose = () =>
    this.setState({ isMetadataModalOpen: false });

  handleAddMenuToggle = () =>
    this.setState({ addMenuOpen: !this.state.addMenuOpen });

  handleAddQuestionPage = () => {
    this.props.onAddQuestionPage();
    this.handleAddMenuToggle();
  };

  handleAddSection = () => {
    this.props.onAddSection();
    this.handleAddMenuToggle();
  };

  handleAddQuestionConfirmation = () => {
    this.props.onAddQuestionConfirmation();
    this.handleAddMenuToggle();
  };

  handleAddCalculatedSummaryPage = () => {
    this.props.onAddCalculatedSummaryPage();
    this.handleAddMenuToggle();
  };

  render() {
    const { questionnaire, onUpdateQuestionnaire } = this.props;

    return (
      <Fragment>
        <NavigationHeaderRow>
          <IconList>
            <IconListItem>
              <RouteButton variant="tertiary-light" small to="/">
                <IconText icon={HomeIconLink}>Home</IconText>
              </RouteButton>
            </IconListItem>
            <IconListItem>
              <Button
                data-test="metadata-btn"
                variant="tertiary-light"
                small
                onClick={this.handleMetadataModalOpen}
                highlightOnHover={false}
              >
                <IconText icon={MetadataIcon}>Metadata</IconText>
              </Button>
            </IconListItem>
            <IconListItem>
              <Button
                data-test="settings-btn"
                variant="tertiary-light"
                small
                onClick={this.handleSettingsModalOpen}
                highlightOnHover={false}
              >
                <IconText icon={SettingsIcon}>Settings</IconText>
              </Button>
              <MetadataModal
                isOpen={this.state.isMetadataModalOpen}
                onClose={this.handleMetadataModalClose}
                questionnaireId={questionnaire.id}
              />
              <QuestionnaireSettingsModal
                isOpen={this.state.isSettingsModalOpen}
                onClose={this.handleSettingsModalClose}
                questionnaire={questionnaire}
                onSubmit={pipeP(
                  onUpdateQuestionnaire,
                  this.handleSettingsModalClose
                )}
                confirmText="Apply"
                canEditType={false}
              />
            </IconListItem>
          </IconList>
        </NavigationHeaderRow>
        <NavigationHeaderRow>
          <NavTitle>Questionnaire content</NavTitle>
          <StyledAddMenu
            addMenuOpen={this.state.addMenuOpen}
            onAddMenuToggle={this.handleAddMenuToggle}
            onAddQuestionPage={this.handleAddQuestionPage}
            canAddQuestionPage={this.props.canAddQuestionPage}
            onAddCalculatedSummaryPage={this.handleAddCalculatedSummaryPage}
            canAddCalculatedSummaryPage={this.props.canAddCalculatedSummaryPage}
            onAddSection={this.handleAddSection}
            onAddQuestionConfirmation={this.handleAddQuestionConfirmation}
            canAddQuestionConfirmation={this.props.canAddQuestionConfirmation}
            data-test="add-menu"
          />
        </NavigationHeaderRow>
      </Fragment>
    );
  }
}

NavigationHeader.fragments = {
  NavigationHeader: gql`
    fragment NavigationHeader on Questionnaire {
      ...QuestionnaireSettingsModal
    }

    ${QuestionnaireSettingsModal.fragments.QuestionnaireSettingsModal}
  `,
};

export default withRouter(NavigationHeader);
