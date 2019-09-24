const {
  BASIC_ANSWERS,
  CURRENCY,
  NUMBER,
  UNIT,
  PERCENTAGE,
} = require("../../constants/answerTypes");

const validation = require(".");

describe("schema validation", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      id: "1",
      sections: [
        {
          id: "section_1",
          title: "section_1",
          pages: [
            {
              id: "page_1",
              title: "page title",
              answers: [
                {
                  id: "answer_1",
                  type: NUMBER,
                  label: "Number",
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should not return errors on valid schema", () => {
    const validationErrors = validation(questionnaire);
    expect(validationErrors.totalCount).toEqual(0);
  });

  describe("Question page validation", () => {
    it("should validate that a title is required", () => {
      const page = questionnaire.sections[0].pages[0];
      page.title = "";

      const validationErrors = validation(questionnaire);

      expect(validationErrors.pages[page.id].errors[0]).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "title",
        id: "pages-page_1-title",
        type: "pages",
      });
    });

    it("should validate that it has at least one answer", () => {
      const page = questionnaire.sections[0].pages[0];
      page.answers = [];

      const validationErrors = validation(questionnaire);

      expect(validationErrors.pages[page.id].errors[0]).toMatchObject({
        errorCode: "ERR_NO_ANSWERS",
        field: "answers",
        id: "pages-page_1-answers",
        type: "pages",
      });
    });
  });

  describe("Option validation", () => {
    it("should return correct error type for additionalAnswer", () => {
      const additionalAnswer = {
        id: "additionalAnswer_1",
        type: "TextField",
        label: "",
      };
      const answer = {
        id: "answer_1",
        type: "Checkbox",
        options: [
          {
            id: "option_1",
            label: "option label",
            additionalAnswer,
          },
        ],
      };
      questionnaire.sections[0].pages[0].answers = [answer];

      const validationErrors = validation(questionnaire);
      expect(
        validationErrors.answers[additionalAnswer.id].errors[0]
      ).toMatchObject({
        errorCode: "ERR_VALID_REQUIRED",
        field: "label",
        id: "additionalAnswer-additionalAnswer_1-label",
        type: "answers",
      });
    });

    describe("Answer validation", () => {
      describe("basic answer", () => {
        it("should ensure that the label is populated", () => {
          BASIC_ANSWERS.forEach(type => {
            const answer = {
              id: "a1",
              type,
              label: "",
            };
            const questionnaire = {
              id: "q1",
              sections: [
                {
                  id: "s1",
                  pages: [
                    {
                      id: "p1",
                      answers: [answer],
                    },
                  ],
                },
              ],
            };

            const errors = validation(questionnaire);
            expect(errors.answers[answer.id].errors).toHaveLength(1);
            expect(errors.answers[answer.id].errors[0]).toMatchObject({
              errorCode: "ERR_VALID_REQUIRED",
              field: "label",
              id: `answers-${answer.id}-label`,
              type: "answers",
            });

            answer.label = "some label";

            const errors2 = validation(questionnaire);
            expect(errors2.answers[answer.id]).toBeUndefined();
          });
        });
      });
    });
  });

  describe.only("currency, number, percentage and unit answers", () => {
    it("should ensure that max value is always larger than min value", () => {
      [CURRENCY, NUMBER, UNIT, PERCENTAGE].forEach(type => {
        const answer = {
          id: "a1",
          type,
          label: "some answer",
          validation: {
            minValue: {
              id: "123",
              enabled: true,
              custom: 50,
              inclusive: true,
              entityType: "Custom",
              previousAnswer: null,
            },
            maxValue: {
              id: "321",
              enabled: true,
              custom: 40,
              inclusive: true,
              entityType: "Custom",
              previousAnswer: null,
            },
          },
        };

        const questionnaire = {
          id: "q1",
          sections: [
            {
              id: "s1",
              pages: [
                {
                  id: "p1",
                  answers: [answer],
                },
              ],
            },
          ],
        };
        const errors = validation(questionnaire);
        console.log(errors);
        // expect(errors.answers[answer.id].errors).toHaveLength(1);
        // expect(errors.validation).toMatchObject({
        //   errorCode: "ERR_MIN_LARGER_THAN_MAX",
        // });
        expect(errors.totalCount).toBe(1);
        // expect(errors.pages.p1.totalCount).toBe(1);

        answer.validation.maxValue.custom = 80;

        // const errors2 = validation(questionnaire);
        // expect(errors2.answers[answer.id]).toBeUndefined();
      });
    });
  });

  describe("Section validation", () => {
    it("should return an error when navigation is enabled but there is no section title", () => {
      questionnaire.navigation = true;
      const section = questionnaire.sections[0];
      section.title = "";

      const validationErrors = validation(questionnaire);
      const sectionErrors = validationErrors.sections[section.id].errors;
      expect(sectionErrors).toHaveLength(1);
      expect(sectionErrors[0]).toMatchObject({
        errorCode: "ERR_REQUIRED_WHEN_SETTING",
        field: "title",
        id: "sections-section_1-title",
        type: "sections",
      });
    });

    it("should NOT return an error when navigation is disabled but there is no section title", () => {
      questionnaire.navigation = false;
      const section = questionnaire.sections[0];
      section.title = "";

      const validationErrors = validation(questionnaire);
      const sectionErrors = validationErrors.sections[section.id];
      expect(sectionErrors).toBeUndefined();
    });

    it("should NOT return an error when navigation is enabled and there is a title", () => {
      questionnaire.navigation = true;
      const section = questionnaire.sections[0];
      section.title = "Section title";

      const validationErrors = validation(questionnaire);
      const sectionErrors = validationErrors.sections[section.id];
      expect(sectionErrors).toBeUndefined();
    });
  });
});
