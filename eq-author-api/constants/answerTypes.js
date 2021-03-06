const CHECKBOX = "Checkbox";
const RADIO = "Radio";
const TEXTFIELD = "TextField";
const TEXTAREA = "TextArea";
const CURRENCY = "Currency";
const NUMBER = "Number";
const DATE = "Date";
const DATE_RANGE = "DateRange";
const PERCENTAGE = "Percentage";
const UNIT = "Unit";
const DURATION = "Duration";

const BASIC_ANSWERS = [TEXTFIELD, TEXTAREA, CURRENCY, NUMBER, UNIT, DURATION];
const NON_RADIO_ANSWERS = [
  ...BASIC_ANSWERS,
  CHECKBOX,
  DATE,
  DATE_RANGE,
  PERCENTAGE,
];

module.exports = {
  CHECKBOX,
  RADIO,
  TEXTFIELD,
  TEXTAREA,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  DATE,
  DATE_RANGE,
  UNIT,
  DURATION,
  BASIC_ANSWERS,
  NON_RADIO_ANSWERS,
};
