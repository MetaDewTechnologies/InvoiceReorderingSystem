import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import NavBar from './NavBar'
import TopBar from './TopBar'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 275
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const styles = {
    modal: {
      backgroundColor: "transparent",
      boxShadow: "none",
      overflow: "none",
    },
  };
  return (
    <>
      <div className={classes.root} >
        <div style={{ zIndex: 2 }}>
          <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
        </div>

        <div style={{ zIndex: 2 }}>
          <NavBar
            onMobileClose={() => setMobileNavOpen(false)}
            openMobile={isMobileNavOpen}
          />
        </div>

        <div className={classes.wrapper}>
          <div className={classes.contentContainer}>
            <div className={classes.content}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
