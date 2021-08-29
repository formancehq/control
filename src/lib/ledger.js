import * as axios from 'axios';

class Ledger {
  constructor(name) {
    this.name = name || (localStorage['ledger_name'] || 'quickstart');
  }

  getInfo() {
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

  getStats() {
    const p = new Promise((resolve, reject) => {
      axios
      .get(url(`/${this.name}/stats`))
      .then(res => {
        resolve(res.data);
      })
      .catch(() => {
        reject();
      })
    });
  
    return p;
  }

  getTransactions(query) {
    const params = query || {};
  
    console.log(params);
  
    const p = new Promise((resolve, reject) => {
      axios
        .get(url(`/${this.name}/transactions`), {
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

  getAccounts(query) {
    const params = query || {};

    const p = new Promise((resolve, reject) => {
      axios
        .get(url(`/${this.name}/accounts`), {
          params,
        })
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

  getAccount(address) {
    const p = new Promise((resolve, reject) => {
      axios
        .get(url(`/${this.name}/accounts/${address}`))
        .then((res) => {
          resolve(res.data);
        })
        .catch(() => {
          reject();
        });
    });
  
    return p;
  }
}

function url(path) {
  return `${localStorage['ledger_uri'] || 'http://localhost:3068'}${path || ''}`;
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

export default (name) => {
  return new Ledger(name);
};

export {
  getInfo,
  url,
};