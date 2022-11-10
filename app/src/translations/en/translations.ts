export default {
  translation: {
    topbar: {
      logout: 'Logout',
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
        connectors: 'Connectors',
      },
    },
    pages: {
      overview: {
        title: 'Overview',
        status: 'Status',
        tasks: {
          title: 'Tasks',
          tuto: {
            title: 'Hello World',
            description: 'Start quickly by following our  tutorial',
            buttonText: 'Go to the docs',
          },
          useCaseLib: {
            title: 'Use cases',
            description: 'Checkout what use case you want to implement',
            buttonText: 'Go to the library',
          },
        },
        subtitle: 'We hope all is well and you have a great day',
        hello: 'Hello !',
        setUp: {
          sectionTitle: 'Set-up',
          connexion: {
            title: 'Add connection',
            description:
              'Add connectors for your favorites PSP and get analyse payments.',
            buttonText: 'Go to connectors',
          },
          ledger: {
            title: 'Submit ledger transactions ',
            description:
              'Create transactions and accounts, and checkout financial flows',
            buttonText: 'Add ledger transaction',
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
        title: 'Payment',
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
          status: 'Status',
          provider: 'Provider',
          reference: 'Reference',
          value: 'Value',
          source: 'Source',
          destination: 'Destination',
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
      connectors: {
        title: 'Connectors',
        table: {
          columnLabel: {
            name: 'Name',
            type: 'Type',
            status: 'Status',
          },
        },
        tabs: {
          apps: {
            title: 'Apps',
            pageButton: {
              actionLabel: 'Add a Connector',
              actionId: 'createApps',
              actionEvent: 'open-create-apps-modal',
            },
          },
          webhooks: {
            title: 'Webhooks',
            pageButton: {
              actionLabel: 'Add a Webhook',
              actionId: 'oauth-clients',
              actionEvent: 'open-create-webhooks-modal',
            },
          },
          oAuthClients: {
            title: 'OAuth Clients',
            pageButton: {
              actionLabel: 'Add an Oauth Client',
              actionId: 'oauth-clients',
              actionEvent: 'open-create-oauth-modal',
            },
          },
        },
      },
      apps: {
        title: 'App',
        form: {
          errors: {
            inputTypeDoesntExist:
              'Form builder has no method factory for field type {{fieldType}}',
            errorOrDuplicate:
              '{{connectorName}} connector could not be created it might already exist 😣',
          },
        },
      },
      app: {
        table: {
          errorLogs: 'Error Logs',
          showErrorLogs: 'Show error logs',
        },
        dangerZone: {
          deleteConnector: 'Delete connector instance',
          deleteConnectorInfo:
            'This will remove this connector instance and all its associated payments data.',
          resetConnector: 'Reset connector instance',
          resetConnectorInfo:
            'This will delete all the historical payments data for this connector and restart synchronization from scratch.',
        },
      },
      oAuthClient: {
        title: 'OAuth Client',
        sections: {
          details: {
            title: 'Details',
            name: 'Name',
            description: 'Description',
            public: 'Public',
            trusted: 'Trusted',
            redirectUris: 'Redirect uris',
            postLogoutRedirectUris: 'Post logout redirect uris',
            uris: {
              placeholder: 'Not configured',
            },
          },
          dangerZone: {
            title: 'Manage',
            delete: {
              title: 'Delete OAuth Client',
              description:
                "This action will definitely delete your OAuth Client. You won't be able to use your secret for machine to machine treatments.",
            },
          },
          secrets: {
            title: 'Secrets',
            create: 'Create new secret',
            deleteFeedback: 'Secret',
            clear:
              'For security purpose, full clear secret display is only ephemeral. Keep it safe somewhere',
          },
        },
        forms: {
          createSecret: {
            name: {
              label: 'Name',
            },
          },
          deleteSecret: {
            name: {
              label: 'Name',
            },
          },
        },
      },
      oAuthClients: {
        table: {
          columnLabel: {
            name: 'Name',
            public: 'Type',
            id: 'ID',
            description: 'Description',
          },
          rows: {
            public: 'public',
            private: 'private',
          },
        },
        form: {
          create: {
            name: {
              label: 'Name',
              errors: {
                required: 'Oauth client name is required',
              },
            },
            description: {
              placeholder: 'Write a quick description',
            },
            redirectUri: {
              label: 'Redirect URI',
            },
            postLogoutRedirectUri: {
              label: 'Redirect post logout URI',
            },
          },
        },
      },
      webhook: {
        title: 'Webhook',
        secret: 'Webhook secret',
        sections: {
          details: {
            title: 'Details',
            endpoint: 'Endpoint',
            events: 'Events',
            createdAt: 'Created at',
            modifiedAt: 'Updated at',
          },
          dangerZone: {
            title: 'Manage',
            delete: {
              title: 'Delete webhook',
              description:
                'This action will definitely delete your webhook config and will no longer work.',
            },
          },
          secrets: {
            title: 'Secrets',
            reveal: 'Reveal',
            renew: 'Renew',
          },
        },
      },
      webhooks: {
        table: {
          columnLabel: {
            endpoint: 'Endpoint',
            eventTypes: 'Events',
            active: 'Status',
            createdAt: 'Creation date',
          },
          rows: {
            active: 'Active',
            inactive: 'Inactive',
          },
        },
        form: {
          create: {
            endpoint: {
              label: 'Endpoint',
              errors: {
                valid:
                  'The endpoint URL should be a valid https URL and be unique.',
              },
            },
            eventTypes: {
              label: 'Events',
              errors: {
                valid: 'You must choose at least one event',
              },
            },
          },
        },
      },
    },
    common: {
      status: {
        active: 'Active',
        paused: 'paused',
        error: 'Error',
      },
      formErrorsMessage: {
        requiredInputs: '{{inputName}} is required',
      },
      showMore: 'Show more',
      filters: {
        ledgers: 'Ledgers',
      },
      buttons: {
        delete: 'Delete',
      },
      feedback: {
        error: 'Something wrong happened',
        delete: '{{item}} could not be deleted',
        create: '{{item}} could not be created',
        update: '{{item}} could not be updated',
      },
      units: {
        seconds: 'seconds',
      },
      boundaries: {
        errorState: {
          error: {
            title: 'Well, this is unexpected. Sorry',
            description:
              'You can try again by refreshing your browser. If the error is still persisting, please feel free to ask for help to our support team.',
            button: 'Refresh !',
          },
          serviceDown: {
            title: 'Hm, we are experiencing technical difficulties.',
            description: 'You can checkout our status page to find out more.',
            button: 'Go to status page',
          },
          notFound: {
            title: '',
            description: 'Hm, no results found',
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
      breadcrumbs: {
        targets: {
          payments: 'Payments',
          ledgers: 'Ledgers',
          accounts: 'Accounts',
          transactions: 'Transactions',
          oAuthClients: 'OAuth Clients',
          webhooks: 'Webhooks',
        },
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
        createTitle: 'Creation',
        updateTitle: 'Update',
        resetTitle: 'Reset',
        confirmation: '{{action}} confirmation ✋',
        deleteTitle: 'Delete confirmation ✋',
        cancelButton: 'Cancel',
        saveButton: 'Save',
        confirmButton: 'Confirm',
        messages: {
          reset:
            '⚠️ Are you sure you want to reset <bold>{{item}}</bold> ? It will uninstall and reinstall the following provider and delete all previous payments linked to it, This action is not reversible.',
          confirmDelete:
            'Are you sure you want to delete <bold>{{item}}</bold> ? This action is not reversible.',
        },
      },
      forms: {
        selectEntity: 'Select a {{entityName}}',
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
