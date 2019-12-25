var urlParams = new URLSearchParams(window.location.search);

DATA = {};
SORTED = {};
USERS = new Set();

USER_ALGOS = new Set();
LOADED_ALGOS = new Set();
USER_OPPONENTS = {};

logged_in_user = '';
loaded = 0;