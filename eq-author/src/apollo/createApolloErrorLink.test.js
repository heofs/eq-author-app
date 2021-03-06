import uuid from "uuid";
import jwt from "jsonwebtoken";
import { errorHandler } from "./createApolloErrorLink";
import { sendSentryError, setSentryTag, setSentryUser } from "./sentryUtils";

jest.mock("./sentryUtils");

describe("createErrorLink", () => {
  let dispatch;
  let networkError;
  let graphQLErrors;

  const createAccessToken = (token, signingKey = uuid.v4()) => {
    return jwt.sign(token, signingKey);
  };

  const createMockStore = () => ({
    dispatch,
  });

  beforeEach(() => {
    /* eslint-disable-next-line camelcase */
    const tokenData = { user_id: "Test User", email: "test.user@email.com" };
    const token = createAccessToken(tokenData);
    localStorage.setItem("accessToken", token);

    networkError = {
      fail: "Uh oh",
    };
    graphQLErrors = [
      {
        fail: "Uh oh",
      },
    ];
    dispatch = jest.fn();
  });

  it("should clear the local storage if the server responds with a 401", () => {
    expect(localStorage.getItem("accessToken")).toBeTruthy();
    errorHandler(createMockStore, {
      networkError: { statusCode: 401 },
      graphQLErrors,
    });
    expect(localStorage.getItem("accessToken")).toBeFalsy();
  });

  it("should dispatch a apiDownError when the server responds with a error", () => {
    errorHandler(createMockStore, {
      networkError,
    });
    expect(dispatch).toHaveBeenCalledWith({ type: "API_DOWN_ERROR" });
  });

  it("should send network errors to sentry", () => {
    errorHandler(createMockStore, {
      networkError,
    });
    expect(sendSentryError).toHaveBeenCalledWith(networkError);
  });

  it("should send graphql errors to sentry", () => {
    errorHandler(createMockStore, {
      graphQLErrors,
    });
    expect(sendSentryError).toHaveBeenCalledWith(graphQLErrors[0]);
  });

  it("should tag errors with a type to be sent to sentry", () => {
    errorHandler(createMockStore, {
      graphQLErrors,
    });
    expect(setSentryTag).toHaveBeenCalledWith("graphQLError");
  });

  it("should set user information from the jwt token on error messages to send to sentry", () => {
    errorHandler(createMockStore, {
      graphQLErrors,
    });
    expect(setSentryUser).toHaveBeenCalledWith(
      localStorage.getItem("accessToken")
    );
  });
  it("should return when networkError gives unauthorized questionnaire access", () => {
    errorHandler(createMockStore, {
      networkError: { statusCode: 403 },
    });
    expect(dispatch).not.toHaveBeenCalled();
  });
});
