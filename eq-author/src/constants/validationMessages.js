export default {
  ERR_VALID_REQUIRED: ({ requiredMsg }) => requiredMsg,
  ERR_CALCULATED_UNIT_INCONSISTENCY: ({ message }) => message,
  ERR_UNIQUE_REQUIRED: ({ label }) => `${label} must be unique`,
  ERR_REQUIRED_WHEN_SETTING: ({ message }) => message,
  ERR_NO_ANSWERS: ({ message }) => message,
};
