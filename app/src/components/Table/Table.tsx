/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { get, isEmpty } from 'lodash';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cursor, TableConfig } from '../../types/generic';
import { TableProps } from './types';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { useSearchParams } from '@remix-run/react';
import { LoadingButton } from '@numaryhq/storybook';

const Table: FunctionComponent<TableProps> = ({
  id,
  renderItem,
  columns,
  withHeader = true,
  load,
  resource,
  withPagination = true,
  paginationSize = 15,
  path = 'data',
  items,
}) => {
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [pageSize, setPageSize] = useState(paginationSize);
  const [data, setData] = useState([]);
  const [metas, setMetas] = useState({} as Cursor<any>);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const init = async (results?: any) => {
    if (results) {
      const items = get(results, path, results.length > 0 ? results : []);
      setMetas(results as Cursor<any>);
      setData(items);
      const total = get(results, 'total.value', 1);
      if (withPagination) {
        setTotal(total);
        setHasMore(get(results, 'hasMore', false));
        setPageSize(get(results, 'pageSize', paginationSize));
        setHasPrevious(isEmpty(get(results, 'previous', false)));
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (load) {
        const results = await load();
        await init(results);
      }
      if (items) {
        await init(items);
      }
    })();
  }, [items]);

  const handleNextButtonClick = () => {
    setSearchParams({
      target: searchParams.get('target') as string,
      cursor: metas.next,
    });
  };

  const handlePreviousButtonClick = () => {
    setSearchParams({
      target: searchParams.get('target') as string,
      cursor: metas.previous,
    });
  };

  return (
    <>
      {data && (
        <Box pb={1} pt={1}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{
              border: ({ palette }) => `1px solid ${palette.neutral[200]}`,
              borderRadius: 0,
            }}
          >
            <TableContainer>
              <MuiTable aria-label="table" id={id}>
                {withHeader && (
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => {
                        if (column.key === TableConfig.ACTIONS) {
                          return (
                            <TableCell
                              key={TableConfig.ACTIONS}
                              sx={{ width: 10 }}
                            />
                          );
                        }

                        return (
                          <TableCell
                            key={column.key}
                            sx={{
                              width: `${column.width}%`,
                              borderColor: ({ palette }) =>
                                palette.neutral[200],
                            }}
                          >
                            {!column.hidden && (
                              <Typography color="primary.light">
                                {t(
                                  `pages.${resource}.table.columnLabel.${column.key}`
                                )}
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                )}
                <TableBody
                  sx={{
                    '& td': {
                      borderColor: ({ palette }) => palette.neutral[100],
                    },
                  }}
                >
                  {/* TODO fix ts-ignore */}
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore*/}
                  {data.length > 0 ? (
                    data.map((item: any, index: number, data: any) =>
                      renderItem(item, index, data)
                    )
                  ) : (
                    <TableRow>
                      <TableCell key="noResult" sx={{ borderBottom: 'none' }}>
                        <Typography>{t('common.noResults')}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </MuiTable>
            </TableContainer>
            {withPagination && data.length > 0 && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
              >
                <Box>
                  <Typography color="primary.light" sx={{ opacity: 0.4 }}>
                    {`${t('common.table.pagination.showing')} ${pageSize} ${t(
                      'common.table.pagination.of'
                    )} ${total} ${t('common.table.pagination.results')}`}
                  </Typography>
                </Box>
                <Box>
                  <LoadingButton
                    id="pagination-previous"
                    disabled={hasPrevious}
                    onClick={handlePreviousButtonClick}
                    endIcon={<ArrowLeft />}
                  />
                  <LoadingButton
                    id="pagination-next"
                    disabled={!hasMore}
                    onClick={handleNextButtonClick}
                    endIcon={<ArrowRight />}
                  />
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      )}
    </>
  );
};

export default Table;
