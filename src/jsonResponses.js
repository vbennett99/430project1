// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const streamers = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    streamers,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const addStreamer = (request, response, body) => {
  const responseJSON = {
    message: 'All fields are required, please double check you have filled out all required information',
  };

  if (!body.name || !body.channelLink || !body.date || !body.time) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;
  if (streamers[body.name]) {
    responseCode = 204;
  } else {
    streamers[body.name] = {};
    streamers[body.name].name = body.name;
  }
  // Removing any extra whitespace or enters
  let link = body.channelLink;
  link = link.trim();
  link = link.replace(/\r\n/g, '');

  streamers[body.name].channelLink = link;
  streamers[body.name].date = body.date;
  streamers[body.name].time = body.time;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully!';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you were looking for is not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getUsers,
  getUsersMeta,
  addStreamer,
  notFound,
  notFoundMeta,
};
