import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  Typography,
  withStyles
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import Logo from '../../components/Logo';

const useStyles = makeStyles(() => ({
  root: {
    background: '#489EE7'
  },
  avatar: {
    width: 40,
    height: 40
  }
}));

const NameTextTypography = withStyles({
  root: {
    color: "#5D605F"
  }
})(Typography);

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();

  const [userName, setUserName] = useState()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const navigate = useNavigate();

  const logout = async (values) => {
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const user = sessionStorage.getItem('userName')
    setUserName(user)
  }, []);

  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <Hidden mdDown>
          <RouterLink to="/app/manageInvoices/listing">
            <Logo />
          </RouterLink>
          <Box flexGrow={1} />
        </Hidden>
          <Box flexGrow={1} />
          <Box
            paddingRight="5px">
            <NameTextTypography
              variant="h6"  style={{ color: '#FFFFFF' }}>
              {userName}
            </NameTextTypography>
          </Box>
          <IconButton>
            <InputIcon 
              onClick={logout}
              style={{ color: '#FFFFFF' }}
            />
          </IconButton>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
