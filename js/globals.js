var urlParams = new URLSearchParams(window.location.search);

DATA = {};
SORTED = {};
USERS = new Set();

USER_ALGOS = new Set();
LOADED_ALGOS = new Set();
USER_OPPONENTS = {};

selected_user = null;
selected_algo = null;
selected_match = null;

loaded = 0;

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);


