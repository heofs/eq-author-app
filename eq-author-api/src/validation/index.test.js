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
                  type: "Checkbox",
                  options: [
                    {
                      id: "option_1",
                      label: "option label",
                      additionalAnswer: {
                        id: "additionalAnswer_1",
                        type: "TextField",
                        label: "additional answer label",
                      },
                    },
                  ],
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

    expect(validationErrors).toHaveLength(0);
  });

  it("should return errors on invalid schema", () => {
    questionnaire.sections[0].pages[0].title = "";

    const validationErrors = validation(questionnaire);

    expect(validationErrors[0]).toMatchObject({
      errorCode: "ERR_VALID_REQUIRED",
      field: "title",
      id: "page_1",
      type: "pages",
    });
  });

  it("should return correct error type for additionalAnswer", () => {
    questionnaire.sections[0].pages[0].answers[0].options[0].additionalAnswer.label =
      "";

    const validationErrors = validation(questionnaire);

    expect(validationErrors[0]).toMatchObject({
      errorCode: "ERR_VALID_REQUIRED",
      field: "label",
      id: "additionalAnswer_1",
      type: "answers",
    });
  });
});