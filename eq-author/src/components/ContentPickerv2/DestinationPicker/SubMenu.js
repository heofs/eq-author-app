import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import Truncated from "components/Truncated";

import {
  MenuItemList,
  SubMenuItem,
  MenuItemTitles,
  MenuItemTitle,
} from "../Menu";

import DestinationEnd from "./DestinationEnd";

const SubMenu = ({ pages, onSelected, isSelected, isDisabled }) => {
  const onEnterUp = (event, item) => {
    if (event.keyCode === 13) {
      //13 is the enter keycode
      onSelected(item);
    }
  };

  return (
    <MenuItemList>
      {pages.map(page => {
        const enabledProps =
          isDisabled && isDisabled(page)
            ? {
                disabled: true,
              }
            : {
                "aria-selected": isSelected(page),
                onClick: () => onSelected(page),
                tabIndex: 0,
                onKeyUp: event => onEnterUp(event, page),
              };
        if (page.id === "EndOfQuestionnaire") {
          return (
            <DestinationEnd
              key={page.id}
              onSelected={onSelected}
              isSelected={isSelected}
              isDisabled={isDisabled}
              hideHeader
            />
          );
        }
        return (
          <SubMenuItem key={page.id} {...enabledProps}>
            <MenuItemTitles>
              <MenuItemTitle>
                <Truncated>{page.displayName}</Truncated>
              </MenuItemTitle>
            </MenuItemTitles>
          </SubMenuItem>
        );
      })}
    </MenuItemList>
  );
};

SubMenu.propTypes = {
  pages: PropTypes.arrayOf(CustomPropTypes.page),
  onSelected: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired,
  isDisabled: PropTypes.func,
};

export default SubMenu;
