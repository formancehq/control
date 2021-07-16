import * as axios from 'axios';

class Ledger {
  constructor(name) {
    this.name = name || 'quickstart';
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
    const p = new Promise((resolve, reject) => {
      axios
        .get(url(`/${this.name}/accounts`))
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

export default (name) => {
  return new Ledger(name);
};

export {
  getInfo,
  getStats,
  getTransactions,
  getAccounts,
  getAccount,
};