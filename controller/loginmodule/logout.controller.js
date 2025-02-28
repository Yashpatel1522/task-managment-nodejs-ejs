const logger = require("../../logger/logger");

const logout = (request, response) => {
  try {
    response.clearCookie("token");
    delete request.user;
    response.redirect("/");
  } catch (error) {
    logger.log(error);
  }
};

module.exports=logout;
