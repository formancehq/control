import express from 'express';
import cors from 'cors';
import { searchResults } from './data';
import bodyParser from 'body-parser';

export default (async () => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Search API
  app.post('/search', (req, res) => {
    const { body } = req;
    if (body.target === 'PAYMENT') {
      return res.send(searchResults.paymentsFirstPage);
    }
    if (body.target === 'ASSET') {
      return res.send(searchResults.accountWorldDetailsAssets);
    }
    if (!body.target && body.size === 3) {
      return res.send(searchResults.worldAutocomplete);
    }
    if (body.target === 'ACCOUNT' && !body.terms) {
      return res.send(searchResults.accountsFirstPage);
    }
    if (body.target === 'TRANSACTION' && !body.terms) {
      return res.send(searchResults.transactionsFirstPage);
    }
    if (body.target === 'ACCOUNT' && body.terms && body.terms.length > 0) {
      return res.send(searchResults.worldAccountSearch);
    }
    if (body.target === 'TRANSACTION' && body.terms && body.terms.length > 0) {
      return res.send(searchResults.worldTransactionSearch);
    }
  });

  const port = process.env.PORT || 5001;

  app.listen(port, () => {
    console.log(`Control-Mock-Cloud API is running on ${port}`);
  });
})();
