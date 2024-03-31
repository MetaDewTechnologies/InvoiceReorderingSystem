import React from 'react';
import { Box, makeStyles, Avatar } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    width:theme.spacing(9),
    height: theme.spacing(5),
  }
}));

const Logo = (props) => {

  const classes = useStyles();
  return (
    <Box>
      <Avatar
        src="/static/images/logo/clientLogo2.jpg"
        to="/newLoader"
        className={classes.avatar}
        variant="square"
      />

    </Box>

  );
};

export default Logo;
