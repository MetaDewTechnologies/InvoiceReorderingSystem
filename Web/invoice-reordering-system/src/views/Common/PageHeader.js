import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const PageHeader = ({ className, title, onClick, isEdit, ...rest }) => {

  const classes = useStyles();
  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Box style={{marginRight:'5px',paddingTop:'5px'}}>
          {rest.customLabel}
        </Box>
        <Button
          style={{ color:'#FFFFFF', backgroundColor:"#489EE7" }} 
          variant="contained"
          onClick={onClick}
        >
        <SvgIcon
            fontSize="medium"
            color="action"
        >
        {isEdit ? <AddIcon style={{ color:'#FFFFFF', backgroundColor:"#489EE7" }}  /> : <ArrowBackIcon style={{ color:'#FFFFFF', backgroundColor:"#489EE7" }}  /> }
        </SvgIcon>
        </Button>
      </Box>
    </div>
  );
};

PageHeader.propTypes = {
  className: PropTypes.string
};

export default PageHeader;
