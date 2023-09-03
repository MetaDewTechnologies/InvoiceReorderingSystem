import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  Tooltip
} from '@material-ui/core';
import tokenService from '../../../utils/tokenDecoder'
import { CommonGet } from '../../../helpers/HttpClient';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionIcon from '@material-ui/icons/Reorder';
import ReorderIcon from '@material-ui/icons/Reorder';
import ReceiptIcon from '@material-ui/icons/Receipt';

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 275
  },
  desktopDrawer: {
    width: 275,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  parentMainMenu: {
    background: '#3f51b5',
    color: "#FFFFFF",
    width: 50,
    height: 'calc(100%)',

  },
  parentMainMenuList: {
  },
  menuList: {
    width: '100%',
    overflowY: 'scroll',
    overflowX: 'hidden',
    backgroundColor:"#373942"
  },
  RootClass: {
    overflow: 'hidden'
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const role = sessionStorage.getItem('role')
  let screenList = [
    {
      routePath:"/app/manageInvoices/listing",
      screenName:"Bill Registration / Update",
      screenID:1
    },
    {
      routePath:"/app/invoices/listing",
      screenName:"Invoices",
      screenID:2
    }
  ]
  if (role == 'ACCOUNTANT' || role == 'ADMIN' ){
    screenList.push(
      {
        routePath:"/app/reorderInvoices/listing",
        screenName:"Reorder Invoices",
        screenID:3
      }
    )
  }
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="row"
    >
      <Divider />
      <Box className={classes.menuList}>
        <List >
          {screenList.map((item) => (
            <div key={item.screenID}>
                <div>
                <RouterLink key={item.screenID} to={item.routePath} aria-label="group" className="link">
                  <ListItem
                    button
                    style={{ paddingLeft: "10%"}} >
                    <ListItemIcon >
                      {item.screenID === 1? <ReceiptIcon style={{color:'#FFFFFF'}}/>:item.screenID===2?<ReceiptIcon style={{color:'#FFFFFF'}}/>:<ReorderIcon style={{color:'#FFFFFF'}}/>}

                    </ListItemIcon>
                    <ListItemText style={{ fontSize: 12, color:"#FFFFFF" }}
                      primary={item.screenName}
                    />
                  </ListItem>
                </RouterLink>
                </div>
            </div>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;
