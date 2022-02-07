import Cluster from 'numary';

let overrides = {};

if (localStorage['ledger_opts']) {
  overrides = JSON.parse(localStorage['ledger_opts']);
}

const opts = {
  name: 'quickstart',
  uri: `${'http://localhost:3068'}`,
  ...overrides,
};

const cluster = new Cluster(opts);

function getInfo() {
  return cluster.getInfo();
}

export default (name) => {
  return cluster.getLedger(name || opts.name);
};

export {
  getInfo,
};