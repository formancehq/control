import React, { FunctionComponent } from "react";

import { Box } from "@mui/material";
import { useSearchParams } from "@remix-run/react";
import { isEmpty } from "lodash";
import { URLSearchParamsInit } from "react-router-dom";

import { TextField } from "@numaryhq/storybook";

import { Filters } from "~/src/components/Wrappers/Table/Filters/filters";
import { TextProps } from "~/src/components/Wrappers/Table/Filters/Text/types";
import { buildQuery } from "~/src/utils/search";

const Text: FunctionComponent<TextProps> = ({ placeholder, name }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Box
      sx={{
        "& .MuiFormControl-root": {
          m: 0,
          p: 0,
        },
      }}
    >
      <TextField
        placeholder={placeholder}
        name={Filters.TERMS}
        onKeyDown={(e: any) => {
          const value = e.target.value;
          if (e.keyCode === 13 && value && !isEmpty(value)) {
            const formattedValue = `${name}=${value}`;
            const query = buildQuery(searchParams) as any;
            const found = query.terms
              ? query.terms.find((val: string) => val === formattedValue)
              : undefined;
            if (!found) {
              query.terms = query.terms
                ? [...query.terms, formattedValue]
                : [formattedValue];
            }
            setSearchParams(query as URLSearchParamsInit);
          }
        }}
        sx={{
          m: 0,
          p: 0,
        }}
      />
    </Box>
  );
};
export default Text;
