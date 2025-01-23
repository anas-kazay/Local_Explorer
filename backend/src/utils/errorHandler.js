const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: error.message });
};

module.exports = {
  handleError,
};
