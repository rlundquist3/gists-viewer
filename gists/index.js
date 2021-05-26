const fetch = require('node-fetch');

const API_URL = 'https://api.github.com';

/**
 * At this time, this library is quite minimal. For the sake
 * of time and simplicity, I'll keep it in a single file for now.
 * Should it expand significantly, it may be appropriate to separate
 * each function into its own file for readability.
 */

const getGistsForUser = async (username, page = 1) => {
  try {
    const res = await fetch(`${API_URL}/users/${username}/gists?page=${page}&per_page=20`);

    return res.json();
  } catch (error) {
    console.error(error);
  }
};

const getGistById = async (id) => {
  try {
    const res = await fetch(`${API_URL}/gists/${id}`);

    return res.json();
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getGistsForUser,
  getGistById,
};
