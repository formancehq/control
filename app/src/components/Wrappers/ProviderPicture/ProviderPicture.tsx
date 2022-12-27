import React, { FunctionComponent } from "react";

import { Box, Typography } from "@mui/material";
import { get } from "lodash";

import { ProviderPictureProps } from "./types";

import { providersMap } from "~/src/utils/providersMap";

const ProviderPicture: FunctionComponent<ProviderPictureProps> = ({
  provider,
}) => {
  const logoAttr = get(providersMap, provider.toLowerCase());

  return (
    <Box
      component="span"
      display="flex"
      alignItems="center"
      sx={{
        "& img": {
          marginRight: 1,
          width: logoAttr ? logoAttr.width : "initial",
        },
      }}
    >
      {logoAttr && <img src={logoAttr.path} alt={provider} />}
      <Typography sx={{ textTransform: "capitalize" }}>{provider}</Typography>
    </Box>
  );
};

export default ProviderPicture;
