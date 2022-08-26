export default {
  translation: {
    topbar: {
      search: {
        title: 'Search anything',
        suggestions: {
          sections: {
            transactions: 'Transactions',
            accounts: 'Accounts',
            payments: 'Payments',
          },
          more: 'More',
        },
      },
      ledger: {
        form: {
          dialog: {
            title: 'Create a new ledger',
            createButton: 'Create',
            closeButton: 'Close',
          },
        },
        content: {
          title: 'Ledgers',
          addButton: 'New ledger',
          tooltip: {
            copy: {
              info: 'Copy ledger slug',
            },
          },
        },
      },
      notifications: {
        tooltip: 'No new notifications',
      },
    },
    navbar: {
      title: {
        overview: 'Overview',
        accounts: 'Accounts',
        transactions: 'Transactions',
        ledgers: 'Ledgers',
        payments: 'Payments',
      },
    },
    pages: {
      overview: {
        title: 'Overview',
        status: 'Status',
        tasks: 'Tasks',
        subtitle: 'We hope all is well and you have a great day',
        hello: 'Hello !',
        setUp: {
          sectionTitle: 'Set-up',
          connexion: {
            title: 'Add Connection',
            description:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            buttonText: 'Go to connectors',
          },
          ledger: {
            title: 'Submit Ledger Transactions ',
            description:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            buttonText: 'Add Ledger Transaction',
          },
        },
        stats: {
          transactions: 'Transactions',
          accounts: 'Accounts',
        },
        emptyState: {
          title: 'There is nothing here, yet',
          description: 'Connect your tools, set up tasks and start right away.',
          button: 'Get started',
        },
      },
      payment: {
        title: 'Payments Details',
        stripeBtnTitle: 'View on Stripe dashboard',
        id: 'ID',
        copyToClipboardTooltip:
          '{{value}} has successfully been copied to clipboard !',
        reference: 'Reference',
        type: 'Type',
        processor: 'Processor',
        status: 'Status',
        netValue: 'Net Value',
        initialAmount: 'Initial Amount',
        capturedAmount: 'Captured Amount',
        refoundedAmount: 'Refounded Amount',
        eventJournal: {
          title: 'Events journal',
          netValueChange: 'Net value changed from {{value1}} to {{value2}}',
          statusChange: 'Status changed from {{value1}} to {{value2}}',
        },
        reconciliation: {
          title: 'Reconciliation',
          subTitle: 'Attached ledger transactions found',
        },
        metadata: 'Metadata',
        rawObject: 'Raw Object',
      },
      payments: {
        title: 'Payments',
        filters: {
          type: 'Type',
        },
        table: {
          columnLabel: {
            provider: 'Provider',
            status: 'Status',
            type: 'Type',
            value: 'Value',
            reference: 'Reference',
            date: 'Date',
          },
        },
        payin: {
          tab: 'Pay-in',
        },
        payout: {
          tab: 'Payout',
        },
      },
      account: {
        title: 'Account',
        table: {
          columnLabel: {
            balance: {
              asset: 'Asset',
              value: 'Balance',
            },
            volume: {
              asset: 'Asset',
              sent: 'Sent',
              received: 'Received',
            },
            metadata: {
              key: 'Key',
              value: 'Value',
            },
          },
        },
        balances: {
          title: 'Balances',
        },
        volumes: {
          title: 'Volumes',
        },
        transactions: {
          title: 'Transactions',
        },
        metadata: {
          title: 'Metadata',
        },
      },
      accounts: {
        tab: 'Accounts',
        title: 'Accounts',
        table: {
          columnLabel: {
            address: 'Address',
            ledger: 'Ledger',
          },
        },
        filters: {},
      },
      transactions: {
        title: 'Transactions',
        tab: 'Transactions',
        filters: {},
        table: {
          columnLabel: {
            txid: '# Txid',
            status: 'Status',
            value: 'Value',
            source: 'Source',
            destination: 'Destination',
            ledger: 'Ledger',
            date: 'Date',
            actions: 'Actions',
          },
        },
      },
      transaction: {
        title: 'Transaction',
        table: {
          columnLabel: {
            metadata: {
              key: 'Key',
              value: 'Value',
            },
            txid: 'Txid',
            status: 'Status',
            amount: 'Amount',
            source: 'Source',
            destination: 'Destination',
            date: 'Date',
          },
        },
        postings: {
          title: 'Postings',
        },
        graph: {
          title: 'Graph',
        },
        metadata: {
          title: 'Metadata',
        },
      },
    },
    common: {
      showMore: 'Show more',
      filters: {
        ledgers: 'Ledgers',
      },
      boundaries: {
        errorState: {
          error: {
            title: 'Well, this is unexpected. Sorry 🙏',
            description:
              'You can try again by refreshing your browser. If the error is still persisting, please feel free to ask for help on our discord.',
            button: 'Help !',
          },
          serviceDown: {
            title: 'Hm, we are experiencing technical difficulties.',
            description: 'You can checkout our status page to find out more.',
            button: 'Go to status page',
          },
          notFound: {
            title: 'Looks like what you are looking for is not here',
            description: 'No John Doe here !',
            button: 'Go back home',
          },
          unauthorized: {
            title: 'Looks like you do not have required permission!',
            description: 'Checkout with your admin !',
            button: 'Go back home',
          },
          forbidden: {
            title: 'Looks like you can not be here',
            description: 'Sorry bro',
            button: 'Go back home',
          },
        },
        title: 'Uh oh!',
      },
      soon: 'Soon!',
      title: 'Formance',
      noResults: 'No results',
      table: {
        actionColumnLabel: 'Actions',
        metadata: {
          columnLabel: {
            value: 'Value',
          },
        },
        pagination: {
          showing: 'Showing',
          results: 'results',
          separator: 'of',
          previous: 'Prev',
          after: 'Next',
        },
      },
      tooltip: {
        copied: 'Copied! ✔️',
      },
      search: {
        viewAll: 'View all {{target}}',
        title: 'Results for "{{value}}" accross {{target}}',
        placeholder: 'Search anything',
        targets: {
          ledger: 'Ledger',
          account: 'Account',
          transaction: 'Transaction',
          payment: 'Payment',
        },
      },
      dialog: {
        createTitle: 'Create',
        updateTitle: 'Update',
        cancelButton: 'Cancel',
        saveButton: 'Save',
      },
      forms: {
        metadata: {
          json: {
            prettify: 'Prettify',
            label: 'JSON',
            placeholder: 'Add some metadata (JSON)',
            errors: {
              valid: 'JSON syntax error',
            },
          },
        },
      },
    },
  },
};
