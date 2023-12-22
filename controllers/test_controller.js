const testPostController = (req, res) => {
  const { name } = req.body;
  return res.status(200).send(`Your Name Is ${name}`);
};

module.exports = testPostController;
