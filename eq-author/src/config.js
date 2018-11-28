window.config = window.config || {};
const config = {
  REACT_APP_API_URL:
    window.config.REACT_APP_API_URL || process.env.REACT_APP_API_URL,
  REACT_APP_FIREBASE_API_KEY:
    window.config.REACT_APP_FIREBASE_API_KEY ||
    process.env.REACT_APP_FIREBASE_API_KEY,
  REACT_APP_FIREBASE_PROJECT_ID:
    window.config.REACT_APP_FIREBASE_PROJECT_ID ||
    process.env.REACT_APP_FIREBASE_PROJECT_ID,
  REACT_APP_FUNCTIONAL_TEST:
    window.config.REACT_APP_FUNCTIONAL_TEST ||
    process.env.REACT_APP_FUNCTIONAL_TEST,
  REACT_APP_LAUNCH_URL:
    window.config.REACT_APP_LAUNCH_URL || process.env.REACT_APP_LAUNCH_URL,
  REACT_APP_USE_FULLSTORY:
    window.config.REACT_APP_USE_FULLSTORY ||
    process.env.REACT_APP_USE_FULLSTORY,
  REACT_APP_USE_SENTRY:
    window.config.REACT_APP_USE_SENTRY || process.env.REACT_APP_USE_SENTRY
};

export default config;
