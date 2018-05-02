let values = {};

const getScores = () => values.getScores;

const isToxic = () => values.isToxic;

const setValues = newValues => {
  values = newValues;
};

module.exports = { getScores, isToxic, setValues };
