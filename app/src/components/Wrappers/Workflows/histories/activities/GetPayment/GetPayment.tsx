import React, { FunctionComponent } from 'react';

import { CreditCard } from '@mui/icons-material';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Chip, Date, JsonViewer } from '@numaryhq/storybook';

import { PaymentSchemeChip } from '~/src/components/Wrappers/PaymentSchemeChip/PaymentSchemeChip';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import StatusChip from '~/src/components/Wrappers/StatusChip';
import {
  paymentColorMap,
  paymentIconMap,
  paymentTypeColorMap,
  paymentTypeIconMap,
} from '~/src/components/Wrappers/StatusChip/maps';
import NodeTitle from '~/src/components/Wrappers/Workflows/CustomNode/NodeTitle';
import { GetPaymentProps } from '~/src/components/Wrappers/Workflows/histories/activities/GetPayment/types';
import {
  chipContainer,
  containerSx,
  jsonContainer,
  typoSx,
} from '~/src/components/Wrappers/Workflows/stages/utils';
import { useToggle } from '~/src/hooks/useToggle';

const GetPayment: FunctionComponent<GetPaymentProps> = ({
  reference,
  status,
  scheme,
  raw,
  type,
  initialAmount,
  provider,
  createdAt,
  asset,
}) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [show, toggle] = useToggle(false);

  return (
    <Box
      className="react-flow__node-default"
      sx={{
        borderRadius: '15px',
        border: ({ palette }) => `1px dotted ${palette.red.bright}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.getPayment.title')}
        color={palette.red.light}
        onToggle={toggle}
        icon={<CreditCard />}
      />
      {show && (
        <>
          <Box component="span" display="block" sx={containerSx} mt={1}>
            <Box
              mt={1}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ProviderPicture
                provider={provider}
                text={false}
                border={false}
              />
              <StatusChip
                status={status}
                iconMap={paymentIconMap}
                colorMap={paymentColorMap}
              />
              <PaymentSchemeChip scheme={scheme} />
              <StatusChip
                status={type}
                iconMap={paymentTypeIconMap}
                colorMap={paymentTypeColorMap}
              />
            </Box>
            <Box sx={chipContainer} mt={1}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getPayment.reference')}
              </Typography>
              <Chip label={reference} variant="square" color="brown" />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getPayment.createdAt')}
              </Typography>
              <Date timestamp={createdAt} />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getPayment.initialAmount')}
              </Typography>
              <Chip
                label={`${initialAmount} ${asset}`}
                variant="square"
                color="yellow"
              />
            </Box>
            <Box sx={jsonContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getPayment.raw')}
              </Typography>
              <JsonViewer jsonData={raw} expanded />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default GetPayment;
