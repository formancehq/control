import React, { FunctionComponent } from 'react';

import { Wallet } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Date, JsonViewer } from '@numaryhq/storybook';

import {
  getRoute,
  LEDGER_ROUTE,
  WALLET_ROUTE,
} from '~/src/components/Layout/routes';
import RoutingChip from '~/src/components/Wrappers/RoutingChip/RoutingChip';
import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import { GetWalletProps } from '~/src/components/Wrappers/Workflows/histories/activities/GetWallet/types';
import {
  chipContainer,
  containerSx,
  getPlaceholder,
  jsonContainer,
  placeholderSx,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { useToggle } from '~/src/hooks/useToggle';

const GetWallet: FunctionComponent<GetWalletProps> = ({
  metadata,
  name,
  createdAt,
  ledger,
  id,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.yellow.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.getWallet.title')}
        color={palette.yellow.light}
        onToggle={toggle}
        icon={<Wallet />}
      />
      {show && (
        <>
          <Box component="span" display="block" sx={containerSx} mt={1}>
            <Box sx={chipContainer(name)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getWallet.name')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(name)}
                color="blue"
                route={getRoute(WALLET_ROUTE, id)}
              />
            </Box>
            <Box sx={chipContainer(ledger)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getWallet.ledger')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(ledger)}
                color="brown"
                route={getRoute(LEDGER_ROUTE, ledger)}
              />
            </Box>
            <Box sx={chipContainer()}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getWallet.createdAt')}
              </Typography>
              {createdAt ? (
                <Date timestamp={createdAt} />
              ) : (
                <Typography variant="placeholder" sx={placeholderSx}>
                  {getPlaceholder()}
                </Typography>
              )}
            </Box>
            {!isEmpty(metadata) && (
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.activities.getWallet.metadata')}
                </Typography>
                <JsonViewer jsonData={metadata} expanded />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default GetWallet;
