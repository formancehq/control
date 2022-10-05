import { Cursor } from "~/src/types/generic";
import { Account } from "~/src/types/ledger";

export type AccountListProps = {
  accounts: Cursor<Account>;
};
