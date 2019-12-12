var HttpStatus = require("http-status-codes");
module.exports = function(req, res, next) {
  res.reply = responseJson => {
    let data =
      typeof responseJson.data === "undefined" ? {} : responseJson.data;
    let statusCode =
      typeof responseJson.statusCode === "undefined"
        ? 200
        : responseJson.statusCode;
    let message =
      typeof responseJson.message === "undefined"
        ? generateMessage(statusCode)
        : responseJson.message;

    let statusCodeText = HttpStatus.getStatusText(statusCode);
    message = message !== null ? message : statusCodeText;
    let result = {
      status: false,
      responseStatus: statusCodeText
        .toUpperCase()
        .split(" ")
        .join("_"),
      message: message
    };
    if (statusCode >= 300) {
      return res
        .status(statusCode)
        .send({ ...result, status: false, error: data });
    }
    return res.status(statusCode).send({ ...result, status: true, data: data });
  };
  next();
};

function generateMessage(code) {
  let message = common_messages.hasOwnProperty(code)
    ? common_messages[code]
    : null;
  return message;
}

let common_messages = {
  "200": "Request processed successfully.",
  "201": "New entry has been created.",
  "400":
    "The request by the client was not processed, as the server could not understand what the client is asking for.",
  "401":
    "The client is not allowed to access resources, and should re-request with the required credentials.",
  "403": "The client is not allowed access the resource.",
  "404": "The requested resource is not available.",
  "500":
    "Request can not be processed due to unexpected internal server error.",
  "503": "Server is down or unavailable to receive and process the request"
};
