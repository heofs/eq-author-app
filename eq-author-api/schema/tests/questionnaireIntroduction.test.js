const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryQuestionnaireIntroduction,
  updateQuestionnaireIntroduction,
} = require("../../tests/utils/contextBuilder/questionnaireIntroduction");

const { BUSINESS } = require("../../constants/questionnaireTypes");
const { NOTICE_2 } = require("../../constants/legalBases");

describe("questionnaire", () => {
  let ctx, questionnaire;

  beforeEach(async () => {
    ctx = await buildContext({ type: BUSINESS });
    questionnaire = ctx.questionnaire;
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("read", () => {
    it("should return the questionnaire introduction", async () => {
      const introduction = await queryQuestionnaireIntroduction(
        ctx,
        questionnaire.introduction.id
      );
      expect(introduction).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        secondaryTitle: expect.any(String),
        secondaryDescription: expect.any(String),
        collapsibles: expect.any(Array),
        legalBasis: expect.any(String),
        tertiaryTitle: expect.any(String),
        tertiaryDescription: expect.any(String),
        availablePipingAnswers: expect.any(Array),
        availablePipingMetadata: expect.any(Array),
      });
    });

    it("should return the available piping metadata but no answers", async () => {
      const introduction = await queryQuestionnaireIntroduction(
        ctx,
        questionnaire.introduction.id
      );

      expect(introduction.availablePipingAnswers).toEqual([]);
      expect(introduction.availablePipingMetadata).not.toHaveLength(0);
      expect(introduction.availablePipingMetadata.map(md => md.id)).toEqual(
        questionnaire.metadata.map(md => md.id)
      );
    });
  });

  describe("update", () => {
    it("should update the properties", async () => {
      const changes = {
        title: "new title",
        description: "new description",
        secondaryTitle: "new secondaryTitle",
        secondaryDescription: "new secondaryDescription",
        legalBasis: NOTICE_2,
        tertiaryTitle: "new tertiaryTitle",
        tertiaryDescription: "new tertiaryDescription",
      };

      const updatedIntroduction = await updateQuestionnaireIntroduction(ctx, {
        id: questionnaire.introduction.id,
        ...changes,
      });

      expect(updatedIntroduction).toEqual({
        id: questionnaire.introduction.id,
        collapsibles: expect.any(Array),
        ...changes,
      });
    });
  });
});
