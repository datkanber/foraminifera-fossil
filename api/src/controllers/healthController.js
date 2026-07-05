function getHealth(req, res) {
  return res.status(200).json({
    status: "ok",
    message: "Foraminifera Fossil API is running.",
  });
}

module.exports = {
  getHealth,
};