const express = require("express");
const app = express();

const port = 5000;

const path = require("path");

let folderBuildName = "build";

app.use(express.static(`../${folderBuildName}`));

app.get("*", (req, res) => {
  try {
    res.sendFile(
      path.join(__dirname, `../${folderBuildName}/index.html`)
    );
  } catch (err) {
    res.status(404).json({
      message: 'PAGE ERROR: ' + err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Ticket Web listening on port ${port}`);
});
