const { last, findIndex } = require("lodash");

const { SOCIAL, BUSINESS } = require("../../constants/questionnaireTypes");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");
const {
  createQuestionnaire,
  queryQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  listQuestionnaires,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

describe("questionnaire", () => {
  let questionnaire;

  afterEach(async () => {
    if (!questionnaire) {
      return;
    }
    await deleteQuestionnaire(questionnaire.id);
    questionnaire = null;
  });

  describe("create", () => {
    let config;
    beforeEach(async () => {
      config = {
        title: "Questionnaire",
        description: "Description",
        surveyId: "1",
        theme: "default",
        navigation: false,
        summary: false,
        type: SOCIAL,
        shortTitle: "short title",
      };
    });

    it("should create a questionnaire with a section and page", async () => {
      const questionnaire = await createQuestionnaire(config);
      expect(questionnaire).toEqual(
        expect.objectContaining({ ...config, displayName: "short title" })
      );

      expect(questionnaire.sections[0].pages[0]).not.toBeNull();
    });

    it("should create a questionnaire with no metadata when creating a social survey", async () => {
      const questionnaire = await createQuestionnaire(config);
      expect(questionnaire.metadata).toEqual([]);
    });

    it("should create a questionnaire with default business metadata when creating a business survey", async () => {
      const questionnaire = await createQuestionnaire({
        ...config,
        type: BUSINESS,
      });
      expect(questionnaire.metadata).toHaveLength(6);
    });

    it("should create a questionnaire introduction for business surveys", async () => {
      const questionnaire = await createQuestionnaire({
        ...config,
        type: BUSINESS,
      });
      expect(questionnaire.introduction).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        collapsibles: [],
      });
    });
  });

  describe("mutate", () => {
    it("should mutate a questionnaire", async () => {
      questionnaire = await buildQuestionnaire({
        title: "Questionnaire",
        description: "Description",
        surveyId: "1",
        theme: "default",
        navigation: false,
        summary: false,
        metadata: [{}],
        shortTitle: "short title",
      });
      const update = {
        id: questionnaire.id,
        title: "Questionnaire-updated",
        description: "Description-updated",
        theme: "census",
        navigation: true,
        surveyId: "2-updated",
        summary: true,
        shortTitle: "short title updated",
      };
      const updatedQuestionnaire = await updateQuestionnaire(
        questionnaire,
        update
      );

      expect(updatedQuestionnaire).toEqual(expect.objectContaining(update));
    });

    it("should derive display name from short title and then title", async () => {
      questionnaire = await buildQuestionnaire({
        title: "title",
      });
      const queriedTitleQuestionnaire = await queryQuestionnaire(questionnaire);
      expect(queriedTitleQuestionnaire.displayName).toEqual("title");
      await updateQuestionnaire(questionnaire, {
        id: questionnaire.id,
        shortTitle: "short title",
      });
      const queriedShortTitleQuestionnaire = await queryQuestionnaire(
        questionnaire
      );
      expect(queriedShortTitleQuestionnaire.displayName).toEqual("short title");
    });
  });

  describe("query", () => {
    let queriedQuestionnaire;

    beforeEach(async () => {
      questionnaire = await buildQuestionnaire({
        summary: false,
        description: "description",
        sections: [{}],
        metadata: [{}],
      });
      queriedQuestionnaire = await queryQuestionnaire(questionnaire);
    });

    it("should resolve questionnaire fields", () => {
      expect(queriedQuestionnaire).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        displayName: expect.any(String),
        description: expect.any(String),
        theme: expect.any(String),
        navigation: expect.any(Boolean),
        surveyId: expect.any(String),
        createdAt: expect.any(String),
        createdBy: expect.any(Object),
        sections: expect.any(Array),
        summary: expect.any(Boolean),
        questionnaireInfo: expect.any(Object),
        metadata: expect.any(Array),
      });
    });

    it("should resolve createdBy", () => {
      expect(queriedQuestionnaire.createdBy).toMatchObject({
        id: "author-integration-test",
      });
    });

    it("should resolve section", () => {
      expect(queriedQuestionnaire.sections.id).toEqual(
        questionnaire.sections.id
      );
    });

    it("should resolve questionnaireInfo", () => {
      expect(queriedQuestionnaire.questionnaireInfo.totalSectionCount).toEqual(
        1
      );
    });

    it("should resolve metadata", () => {
      expect(last(queriedQuestionnaire.metadata).id).toEqual(
        last(questionnaire.metadata).id
      );
    });
  });

  describe("list questionnaires", () => {
    it("should order then newest to oldest", async () => {
      const oldestQuestionnaire = await buildQuestionnaire({});
      const newestQuestionnaire = await buildQuestionnaire({});

      const questionnnaires = await listQuestionnaires();
      const oldestIndex = findIndex(
        questionnnaires,
        q => q.id === oldestQuestionnaire.id
      );
      const newestIndex = findIndex(
        questionnnaires,
        q => q.id === newestQuestionnaire.id
      );
      expect(oldestIndex > newestIndex).toEqual(true);
    });
  });

  describe("delete", () => {
    it("should delete a questionnaire", async () => {
      questionnaire = await buildQuestionnaire({});
      // Calling this to prove it doesn't error but cannot actually rely on it
      await deleteQuestionnaire(questionnaire.id);
      // This is faking the context which relies on middleware and should be null when the questionnaire has been deleted
      const deletedQuestionnaire = await queryQuestionnaire(null);
      expect(deletedQuestionnaire).toBeNull();
      questionnaire = null;
    });
  });
});