const app = require("./src/app");

const PORT = 5000;

app.listen(PORT, function () {
  console.log(
    `Foraminifera Fossil API is running on http://localhost:${PORT}`
  );
});