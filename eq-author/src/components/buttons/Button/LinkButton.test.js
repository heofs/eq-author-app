import React from "react";
import { shallow } from "enzyme";

import LinkButton from "components/buttons/Button/LinkButton";

describe("components/Button/LinkButton", () => {
  it("should render", () => {
    expect(
      shallow(
        <LinkButton href="/test">
          <div>Content</div>
        </LinkButton>
      )
    ).toMatchSnapshot();
  });
});