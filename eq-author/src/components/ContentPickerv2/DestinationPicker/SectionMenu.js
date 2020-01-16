import React, { useState } from "react";
import { find } from "lodash";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import ScrollPane from "components/ScrollPane";
import Menu from "./Menu";
import SubMenu from "./SubMenu";

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
`;

const Column = styled.div`
  width: ${props => props.width}%;
`;

const SectionMenu = ({
  data,
  onSelected,
  isSelected,
  firstSelectedItemId,
  ...otherProps
}) => {
  const defaultSelectedSection = firstSelectedItemId
    ? find(data, {
        pages: [{ answers: [{ id: firstSelectedItemId }] }],
      })
    : data[0];

  const [selectedSection, setSelectedSection] = useState(
    defaultSelectedSection
  );

  const sectionData = [
    ...data,
    {
      id: "EndOfQuestionnaire",
      displayName: "End of Questionnaire",
      pages: [
        { id: "EndOfQuestionnaire", displayName: "End of questionnaire" },
      ],
    },
  ];

  const showNewSection = section => {
    onSelected();
    setSelectedSection(section);
  };

  return (
    <ColumnContainer>
      <Column width={44}>
        <ScrollPane background permanentScrollBar>
          <Menu
            data={sectionData}
            {...otherProps}
            onSelected={showNewSection}
            isSelected={item =>
              selectedSection && selectedSection.id === item.id
            }
          />
        </ScrollPane>
      </Column>
      <Column width={56}>
        <ScrollPane background>
          <SubMenu
            pages={(selectedSection && selectedSection.pages) || []}
            onSelected={onSelected}
            isSelected={isSelected}
            {...otherProps}
          />
        </ScrollPane>
      </Column>
    </ColumnContainer>
  );
};

SectionMenu.propTypes = {
  data: PropTypes.arrayOf(CustomPropTypes.section),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  firstSelectedItemId: PropTypes.string,
};

export default SectionMenu;
