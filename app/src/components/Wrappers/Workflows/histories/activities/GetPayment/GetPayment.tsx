import React, { FunctionComponent } from 'react';

import { Box, Typography, useTheme } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Chip, Date, JsonViewer } from '@numaryhq/storybook';

import { getRoute, PAYMENT_ROUTE } from '~/src/components/Layout/routes';
import { PaymentSchemeChip } from '~/src/components/Wrappers/PaymentSchemeChip/PaymentSchemeChip';
import ProviderPicture from '~/src/components/Wrappers/ProviderPicture';
import RoutingChip from '~/src/components/Wrappers/RoutingChip/RoutingChip';
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
  getPlaceholder,
  jsonContainer,
  placeholderSx,
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
        border: ({ palette }) => `1px dotted ${palette.neutral[50]}`,
        width: '100%',
      }}
    >
      <NodeTitle
        label={t('pages.flow.activities.getPayment.title')}
        color={palette.neutral[50]}
        onToggle={toggle}
        icon={
          <ProviderPicture provider={provider} text={false} border={false} />
        }
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
                '& .MuiSvgIcon-root': {
                  width: '0.6em',
                  height: '0.6em',
                },
              }}
            >
              <StatusChip
                status={getPlaceholder(status)}
                iconMap={paymentIconMap}
                colorMap={paymentColorMap}
              />
              <PaymentSchemeChip scheme={scheme} />
              <StatusChip
                status={getPlaceholder(type)}
                iconMap={paymentTypeIconMap}
                colorMap={paymentTypeColorMap}
              />
            </Box>

            <Box sx={chipContainer} mt={1}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getPayment.reference')}
              </Typography>
              <RoutingChip
                label={getPlaceholder(reference)}
                color="brown"
                route={getRoute(PAYMENT_ROUTE, id)}
              />
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getPayment.createdAt')}
              </Typography>
              {createdAt ? (
                <Date timestamp={createdAt} />
              ) : (
                <Typography variant="placeholder" sx={placeholderSx}>
                  {getPlaceholder()}
                </Typography>
              )}
            </Box>
            <Box sx={chipContainer}>
              <Typography sx={typoSx} variant="bold">
                {t('pages.flow.activities.getPayment.initialAmount')}
              </Typography>
              <Chip
                label={getPlaceholder(`${initialAmount} ${asset}`)}
                variant="square"
                color="yellow"
              />
            </Box>
            {raw && !isEmpty(raw) && (
              <Box sx={jsonContainer}>
                <Typography sx={typoSx} variant="bold">
                  {t('pages.flow.activities.getPayment.raw')}
                </Typography>
                <JsonViewer jsonData={raw} expanded />
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default GetPayment;
