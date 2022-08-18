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
        docsContent: 'Read the Docs',
        airtableContent: 'Vote for Connectors',
        discordContent: 'Join the Discord',
        newsletterContent: 'Join the Newsletter',
        githubContent: 'Star !',
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
      transaction: {
        title: 'Transaction',
      },
      payment: {
        title: 'Payment',
      },
      payments: {
        title: 'Payments',
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
      ledgers: {
        title: 'Ledgers',
        emptyState: {
          title: 'There is nothing here, yet',
          description: 'You can start by selecting a ledger',
        },
        select: {
          label: 'Select a ledger',
        },
        accounts: {
          tab: 'Accounts',
          title: 'Accounts',
          table: {
            columnLabel: {
              address: 'Address',
            },
          },
          details: {
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
        },
        transactions: {
          title: 'Transactions',
          tab: 'Transactions',
          table: {
            columnLabel: {
              txid: '# Txid',
              status: 'Status',
              value: 'Value',
              source: 'Source',
              destination: 'Destination',
              date: 'Date',
              actions: 'Actions',
            },
          },
          details: {
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
            transaction: {
              title: 'Transaction',
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
      },
    },
    common: {
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
        search: 'Search',
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
        more: 'More',
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
