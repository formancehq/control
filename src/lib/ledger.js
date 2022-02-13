import Cluster from 'numary';

let overrides = {};

if (localStorage['ledger_opts']) {
  overrides = JSON.parse(localStorage['ledger_opts']);
}

const defaultName = 'quickstart';

let opts = {
  name: defaultName,
  uri: `${'http://localhost:3068'}`,
  auth: {},
  ...overrides,
};

const cluster = new Cluster(opts);

function getInfo() {
  return cluster.getInfo();
}

function getName() {
  return opts.name;
}

function setName(name) {
  setOpts({
    name: name || defaultName,
  });
}

function setOpts(update) {
  opts = {
    ...opts,
    ...update,
    "auth": {
      ...opts.auth,
      ...update.auth,
    }
  };

  localStorage['ledger_opts'] = JSON.stringify(opts);
  window.location.pathname = '/';
}

export default function getLedger (name) {
  return cluster.getLedger(name || opts.name);
};

export {
  getInfo,
  getLedger,
  getName,
  setName,
  setOpts,
  opts,
};