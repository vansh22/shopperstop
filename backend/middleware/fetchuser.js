const jwt = require("jsonwebtoken");
const JWT_SECRET = "unstoppable";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token"); // receiving auth token from header
  if (!token) {
    res
      .status(401) // unauthorized user status
      .send({ error: "Please authenticate using the valid token" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res
      .status(401)
      .send({ error: "Please authenticate using the valid token" });
  }
};

module.exports = fetchuser;