import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import * as mock from './data';

export default (async () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Ledger api mock
  app.get('/api/ledger/_info', (req: any, res: any) => {
    res.send(401, {});
  });
  app.get('/api/ledger/:id/stats', (req: any, res: any) => {
    res.send(401, {});
  });
  app.get('/ledger/:ledger/accounts/:account', (req: any, res: any) => {
    res.send({ data: mock.account });
  });
  app.post(
    '/ledger/:ledger/accounts/:account/metadata',
    (req: any, res: any) => {
      res.status(204);
    }
  );
  app.get('/ledger/:ledger/transactions/:transaction', (req: any, res: any) => {
    res.send({ data: mock.transaction });
  });
  app.post(
    '/ledger/:ledger/transactions/:transaction/metadata',
    (req: any, res: any) => {
      res.status(204);
    }
  );

  // Payment api mock
  app.get('/payments/payments/:payment', (req: any, res: any) => {
    res.send({ data: mock.payment });
  });

  // Search api mock
  app.post('/search', (req: any, res: any) => {
    const { body } = req;
    if (body.target === 'PAYMENT') {
      return res.send(mock.paymentList1);
    }
    if (!body.target && body.size === 3) {
      return res.send(mock.autocomplete);
    }
    if (body.target === 'ACCOUNT' && !body.terms) {
      return res.send(mock.accountList1);
    }
    if (body.target === 'TRANSACTION' && !body.terms) {
      return res.send(mock.transactionList1);
    }
    if (body.target === 'TRANSACTION' && body.terms.length === 2) {
      return res.send(mock.transactionList1);
    }

    return res.send(422);
  });

  const port = process.env.PORT || 5001;

  app.listen(port, () => {
    console.log(`Control-Mock-Cloud API is running on ${port}`);
  });
})();
