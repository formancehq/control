import * as axios from 'axios';

function url(path) {
  return `http://localhost:3068${path}`;
}

function getInfo() {
  const p = new Promise((resolve, reject) => {
    axios
    .get(url('/_info'))
    .then(res => {
      resolve(res.data);
    })
    .catch(() => {
      reject();
    })
  });

  return p;
}

function getStats() {
  const p = new Promise((resolve, reject) => {
    axios
    .get(url('/stats'))
    .then(res => {
      resolve(res.data);
    })
    .catch(() => {
      reject();
    })
  });

  return p;
}

function getTransactions(query) {
  const params = query || {};

  console.log(params);

  const p = new Promise((resolve, reject) => {
    axios
      .get(url('/transactions'), {
        params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });

  return p;
}

function getAccounts(query) {
  const p = new Promise((resolve, reject) => {
    axios
      .get(url('/accounts'))
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch(() => {
        reject();
      });
  });

  return p;
}

function getAccount(address) {
  const p = new Promise((resolve, reject) => {
    axios
      .get(url(`/accounts/${address}`))
      .then((res) => {
        resolve(res.data);
      })
      .catch(() => {
        reject();
      });
  });

  return p;
}

export {
  getInfo,
  getStats,
  getTransactions,
  getAccounts,
  getAccount,
};