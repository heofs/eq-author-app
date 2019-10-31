const { find, findIndex, remove, omit, set, first } = require("lodash");
const uuid = require("uuid");

const {
  getSectionByPageId,
  remapAllNestedIds,
  getPageById,
} = require("../utils");

const onPageDeleted = require("../../../src/businessLogic/onPageDeleted");
const { createMutation } = require("../createMutation");
const addPrefix = require("../../../utils/addPrefix");
const { createQuestionPage } = require("./questionPage");

const {
  getCommentsForQuestionnaire,
  saveComments,
  getUserById,
} = require("../../../utils/datastore");
const Resolvers = {};

Resolvers.Page = {
  __resolveType: ({ pageType }) => pageType,
  position: ({ id }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    return findIndex(section.pages, { id });
  },
};

Resolvers.Comment = {
  user: ({ userId }) => getUserById(userId),
  page: ({ pageId }, args, ctx) => getPageById(ctx, pageId),
};

Resolvers.Mutation = {
  movePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const removedPage = first(remove(section.pages, { id: input.id }));
    if (input.sectionId === section.id) {
      section.pages.splice(input.position, 0, removedPage);
    } else {
      const newsection = find(ctx.questionnaire.sections, {
        id: input.sectionId,
      });
      newsection.pages.splice(input.position, 0, removedPage);
    }
    return removedPage;
  }),
  deletePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    remove(section.pages, { id: input.id });
    onPageDeleted(ctx, input.id);
    return section;
  }),

  createComment: async (_, { input }, ctx) => {
    const questionnaireComments = await getCommentsForQuestionnaire(
      ctx.questionnaire.id
    );
    const newComment = {
      id: uuid.v4(),
      commentText: input.commentText,
      userId: ctx.user.id,
      createdTime: new Date(),
      pageId: input.pageId,
      replies: [],
    };

    if (questionnaireComments.comments[input.pageId]) {
      questionnaireComments.comments[input.pageId].unshift(newComment);
    } else {
      questionnaireComments.comments[input.pageId] = [newComment];
    }
    await saveComments(questionnaireComments);
    return newComment;
  },

  duplicatePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const page = find(section.pages, { id: input.id });
    const newpage = omit(page, "id");
    set(newpage, "alias", addPrefix(newpage.alias));
    set(newpage, "title", addPrefix(newpage.title));
    const duplicatedPage = createQuestionPage(newpage);
    const remappedPage = remapAllNestedIds(duplicatedPage);
    section.pages.splice(input.position, 0, remappedPage);
    return remappedPage;
  }),
};

module.exports = [
  Resolvers,
  require("./questionPage").Resolvers,
  require("./calculatedSummaryPage").Resolvers,
];
