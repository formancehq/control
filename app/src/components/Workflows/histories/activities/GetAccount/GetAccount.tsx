import React, { FunctionComponent } from 'react';

import { AccountTree } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { JsonViewer } from '@numaryhq/storybook';

import { getLedgerAccountDetailsRoute } from '~/src/components/Layout/routes';
import NodeTitle from '~/src/components/Workflows/CustomNode/NodeTitle';
import { GetAccountProps } from '~/src/components/Workflows/histories/activities/GetAccount/types';
import {
  chipContainer,
  containerSx,
  getPlaceholder,
  jsonContainer,
  typoSx,
} from '~/src/components/Workflows/stages/utils';
import RoutingChip from '~/src/components/Wrappers/RoutingChip/RoutingChip';
import { useToggle } from '~/src/hooks/useToggle';

const GetAccount: FunctionComponent<GetAccountProps> = ({
  metadata,
  address,
  ledger,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.blue.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.getAccount.title')}
        color={palette.blue.light}
        onToggle={toggle}
        icon={<AccountTree />}
      />
      {show && (
        <>
          <Box component="span" display="block" sx={containerSx} mt={1}>
            <Box sx={chipContainer(address)}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getAccount.address')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(address)}
                route={getLedgerAccountDetailsRoute(address, ledger)}
              />
            </Box>
            {!isEmpty(metadata) && (
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.activities.getAccount.metadata')}
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

export default GetAccount;
