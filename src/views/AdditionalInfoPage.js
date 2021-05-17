import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';



export default function CustomerInfoPage(props) {

    const [reservation, setReservation] = useState(props.numReserved);
    
    const [clientNumber, setClientNumber] = useState('+12265785478');
  
  useEffect(() => {
    setReservation(props.numReserved)
  },[props.numReserved])  

  return (
    <Grid item sm={12} md={12} lg={12}>
        {/* <form noValidate autoComplete="off" className='clientInformation_form'>
            <section>
                Active Reservation: {' '}
                <Input value={reservation.length} disabled  style={{color: 'black'}}/>
            </section>

        </form> */}
        {/* <h5>Active Reservation: {reservation.length}</h5> */}
        <h5>Total calls in queue: {props.numReserved.length}</h5>
    </Grid>
  );
}