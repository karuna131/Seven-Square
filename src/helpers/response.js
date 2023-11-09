const sendResponse = (res, statusCode, msg, data) => {
  res.status(statusCode).send({
    status: true,
    message: msg,
    data: data,
  });
};

const errorResponse = (res, statusCode, msg) => {
  res.status(statusCode).send({
    status: false,
    message: msg,
  });
};

const sendMessage = (res, statusCode, msg) => {
  res.status(statusCode).send({
    status: false,
    message: msg,
  });
};


module.exports = {sendResponse, errorResponse, sendMessage};
