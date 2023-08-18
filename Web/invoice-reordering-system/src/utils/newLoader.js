import React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import {RotateSpinner} from "react-spinners-kit";
import { Grid } from '@material-ui/core';

export const LoadingComponent = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  const styles = {
    modal: {
      backgroundColor: "transparent",
      boxShadow: "none",
      overflow: "none",
    },
  };

  return (
    <Grid >
      <Modal
        center
        open={promiseInProgress}
        onClose={promiseInProgress}
        showCloseIcon={false}
        focusTrapped={false}
        styles={styles}
        closeOnOverlayClick={false}
      >

        <RotateSpinner 
          size={90}
          color="#4863A0"
          open={promiseInProgress}
          onClose={promiseInProgress}
        />

      </Modal>

    </Grid>
  );

};
