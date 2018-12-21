import {
  navigateToPage,
  testId,
  selectQuestionFromContentPicker,
  findByLabel
} from "../utils";

export const navigateToRoutingTab = () =>
  cy
    .log("Navigating to routing tab")
    .get(testId("tabs-nav"))
    .within(() => cy.contains("Routing").click())
    .url()
    .should("contain", "routing");

export const clickOnRoutingRuleOption = ({ label }) => {
  cy.get(testId("routing-rule"))
    .last()
    .within(() => {
      cy.get(testId("options-selector")).within(() => {
        cy.contains(label).click();
      });
    });
};

export const add = (config, pageTitle) => {
  if (pageTitle) {
    navigateToPage(pageTitle);
  }
  navigateToRoutingTab();
  config.rules.forEach((rule, i) => {
    cy.get(testId("btn-add-rule")).click();
    cy.get(testId("routing-rule")).should("have.length", i + 1);
    cy.get(testId("routing-rule"))
      .eq(i)
      .as("currentRule");
    cy.get("@currentRule").within(() => {
      findByLabel("IF").click();
    });

    selectQuestionFromContentPicker({
      sectionTitle: rule.leftSide.sectionTitle,
      questionTitle: rule.leftSide.pageTitle
    });

    cy.get("@currentRule").within(() => {
      findByLabel("THEN").click();
    });
    if (rule.destination.logical === "End of questionnaire") {
      cy.contains("End of questionnaire").click();
      cy.get(testId("submit-button")).click();
    } else {
      cy.get(testId("picker-title"))
        .contains("Other pages in this section")
        .click();
      cy.get(testId("picker-option"))
        .contains(rule.destination.pageTitle)
        .click();
      cy.get(testId("submit-button")).click();
    }

    if (Array.isArray(rule.rightSide)) {
      rule.rightSide.map(label => clickOnRoutingRuleOption({ label }));
    } else {
      cy.get(testId("comparator-selector"))
        .last()
        .select(rule.condition);
      cy.get(testId("number-input"))
        .last()
        .type(rule.rightSide);
    }
  });
};