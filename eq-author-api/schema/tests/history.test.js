const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  queryHistory,
  createHistoryNote,
  deleteHistoryNote,
  updateHistoryNote,
} = require("../../tests/utils/contextBuilder/history");

describe("history", () => {
  let ctx, user, notes;

  beforeEach(() => {
    notes = [];
    user = {
      id: "uid-123",
      email: "test@mail.com",
      name: "Jester Tester",
      displayName: "Jester Tester",
    };
  });

  it("should create a history event on questionnaire creation", async () => {
    ctx = await buildContext({});
    const history = await queryHistory(ctx);
    expect(history).toMatchObject([
      {
        bodyText: null,
        publishStatus: "Questionnaire created",
        questionnaireTitle: "Questionnaire (Version 1)",
        user: {
          email: "eq-team@ons.gov.uk",
        },
      },
    ]);
  });

  it("should be able to add a note", async () => {
    ctx = await buildContext({});
    await createHistoryNote(ctx, {
      id: ctx.questionnaire.id,
      bodyText: "I am note",
    });
    const history = await queryHistory(ctx);
    expect(history).toMatchObject([
      {
        bodyText: "I am note",
        publishStatus: "Unpublished",
        questionnaireTitle: "Questionnaire (Version 1)",
        user: {
          email: "eq-team@ons.gov.uk",
        },
      },
      {
        bodyText: null,
        publishStatus: "Questionnaire created",
        questionnaireTitle: "Questionnaire (Version 1)",
        user: {
          email: "eq-team@ons.gov.uk",
        },
      },
    ]);
  });

  describe("deleting notes", () => {
    it("should be able to delete your own note", async () => {
      ctx = await buildContext({}, user);

      notes = await createHistoryNote(ctx, {
        id: ctx.questionnaire.id,
        bodyText: "I am note",
      });

      expect(notes).toHaveLength(2);

      const noteToDelete = notes.find(note => note.bodyText === "I am note");

      notes = await deleteHistoryNote(ctx, {
        id: noteToDelete.id,
        questionnaireId: ctx.questionnaire.id,
      });

      expect(notes).toHaveLength(1);
      expect(notes).toMatchObject([{ publishStatus: "Questionnaire created" }]);
      expect(notes).not.toMatchObject([{ bodyText: "I am note" }]);
    });

    it("should not be able to delete another users note", async () => {
      ctx = await buildContext({}, user);

      notes = await createHistoryNote(ctx, {
        id: ctx.questionnaire.id,
        bodyText: "I am note",
      });

      const noteToDelete = notes.find(note => note.bodyText === "I am note");
      ctx.user.id = "uid-234";

      await expect(
        deleteHistoryNote(ctx, {
          id: noteToDelete.id,
          questionnaireId: ctx.questionnaire.id,
        })
      ).rejects.toThrow("User doesnt have access");

      notes = await queryHistory(ctx);
      expect(notes).toHaveLength(2);
      expect(notes[0]).toMatchObject({ bodyText: "I am note" });
    });

    it("should not be able to delete a system note", async () => {
      ctx = await buildContext({}, user);
      notes = await queryHistory(ctx);

      const systemNote = notes.find(note => note.type === "system");

      await expect(
        deleteHistoryNote(ctx, {
          id: systemNote.id,
          questionnaireId: ctx.questionnaire.id,
        })
      ).rejects.toThrow("Cannot delete system event message");
      expect(notes).toMatchObject([{ publishStatus: "Questionnaire created" }]);
    });

    it("should allow admins to delete other users notes", async () => {
      ctx = await buildContext({}, user);

      notes = await createHistoryNote(ctx, {
        id: ctx.questionnaire.id,
        bodyText: "I am note",
      });

      expect(notes).toHaveLength(2);

      const noteToDelete = notes.find(note => note.bodyText === "I am note");
      ctx.user.id = "uid-234";
      ctx.user.admin = true;

      notes = await deleteHistoryNote(ctx, {
        id: noteToDelete.id,
        questionnaireId: ctx.questionnaire.id,
      });

      expect(notes).toHaveLength(1);
      expect(notes[0]).not.toMatchObject({ bodyText: "I am note" });
    });
  });
  describe("updating notes", () => {
    it("should be able to update your own note", async () => {
      ctx = await buildContext({}, user);

      notes = await createHistoryNote(ctx, {
        id: ctx.questionnaire.id,
        bodyText: "I am note",
      });
      const noteToUpdate = notes.find(note => note.bodyText === "I am note");

      notes = await updateHistoryNote(ctx, {
        id: noteToUpdate.id,
        questionnaireId: ctx.questionnaire.id,
        bodyText: "This has been updated",
      });

      expect(notes[0]).toMatchObject({ bodyText: "This has been updated" });
      expect(notes[0]).not.toMatchObject([{ bodyText: "I am note" }]);
    });

    it("should not be able to update another users note", async () => {
      ctx = await buildContext({}, user);

      notes = await createHistoryNote(ctx, {
        id: ctx.questionnaire.id,
        bodyText: "I am note",
      });

      const noteToUpdate = notes.find(note => note.bodyText === "I am note");

      ctx.user.id = "uid-234";

      await expect(
        updateHistoryNote(ctx, {
          id: noteToUpdate.id,
          questionnaireId: ctx.questionnaire.id,
          bodyText: "This has been updated",
        })
      ).rejects.toThrow("User doesnt have access");

      notes = await queryHistory(ctx);
      expect(notes[0]).toMatchObject({ bodyText: "I am note" });
      expect(notes[0]).not.toMatchObject({ bodyText: "This has been updated" });
    });

    it("should not be able to update a system note", async () => {
      ctx = await buildContext({}, user);
      notes = await queryHistory(ctx);

      const systemNote = notes.find(note => note.type === "system");

      await expect(
        updateHistoryNote(ctx, {
          id: systemNote.id,
          questionnaireId: ctx.questionnaire.id,
          bodyText: "This has been updated",
        })
      ).rejects.toThrow("Cannot update system event message");

      expect(notes).toMatchObject([{ publishStatus: "Questionnaire created" }]);
    });

    it("should allow admins to update other users notes", async () => {
      ctx = await buildContext({}, user);

      notes = await createHistoryNote(ctx, {
        id: ctx.questionnaire.id,
        bodyText: "I am note",
      });

      const noteToDelete = notes.find(note => note.bodyText === "I am note");
      ctx.user.id = "uid-234";
      ctx.user.admin = true;

      notes = await updateHistoryNote(ctx, {
        id: noteToDelete.id,
        questionnaireId: ctx.questionnaire.id,
        bodyText: "This has been updated",
      });

      expect(notes[0]).toMatchObject({ bodyText: "This has been updated" });
      expect(notes[0]).not.toMatchObject({ bodyText: "I am note" });
    });
  });
});