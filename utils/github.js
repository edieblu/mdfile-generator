const axios = require("axios");

const getGithubUser = async () => {
  const {
    data: { name, avatar_url },
  } = await axios.get(`https://api.github.com/users/${githubUsername}`);

  return {
    username: githubUsername,
    name,
    img: avatar_url,
  };
};

module.exports = getGithubUser;
