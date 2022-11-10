import React, { FunctionComponent, useEffect } from "react";

import { ArrowDropDown, Person } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import Search from "./../Search";

import { Navbar as FormanceNavbar } from "@numaryhq/storybook";

import LinkWrapper from "../Wrappers/LinkWrapper";

import {
  getRoute,
  OVERVIEW_ROUTE,
  routerConfig,
} from "~/src/components/Navbar/routes";
import { useService } from "~/src/hooks/useService";
import { CurrentUser } from "~/src/utils/api";

const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const { api, setCurrentUser, currentUser, metas } = useService();

  const getCurrentUser = async () => {
    try {
      const user = await api.getResource<CurrentUser>(
        `${metas.openIdConfig.userinfo_endpoint.split("api")[1]}`
      );
      if (user) {
        const pseudo =
          user && user.email ? user.email.split("@")[0] : undefined;

        setCurrentUser({
          ...user,
          avatarLetter: pseudo ? pseudo.split("")[0].toUpperCase() : undefined,
          pseudo,
        });
      }
    } catch (e) {
      console.info("Current user could not be retrieved");
    }
  };

  useEffect(() => {
    (async () => {
      await getCurrentUser();
    })();
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();

    window.location.href = `${metas.origin}/auth/redirect-logout`;
  };

  const formattedRouterConfig = routerConfig.map((route) => ({
    ...route,
    label: t(route.label),
  }));

  const settings = [t("topbar.logout")];

  return (
    <FormanceNavbar
      onLogoClick={() => navigate(getRoute(OVERVIEW_ROUTE))}
      logo={<img src="/images/logo.svg" alt="logo" />}
      routes={formattedRouterConfig}
      location={location}
      linkWrapper={
        <LinkWrapper to={""} prefetch={"none"} color={""}>
          <Box />
        </LinkWrapper>
      }
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "120px",
        }}
      >
        <Search />
        {currentUser && (
          <>
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt="User Avatar"
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: theme.palette.green.bright,
                }}
              >
                {currentUser.avatarLetter ? (
                  currentUser.avatarLetter
                ) : (
                  <Person />
                )}
              </Avatar>
            </IconButton>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <ArrowDropDown sx={{ color: theme.palette.grey[500] }} />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleLogout}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>
    </FormanceNavbar>
  );
};

export default Navbar;
