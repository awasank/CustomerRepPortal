import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';



export default function CustomerInfoPage() {

    const [reservation, setReservation] = useState('999');
    const [clientNumber, setClientNumber] = useState('+12265785478');


  return (
    <Grid item sm={12} md={12} lg={12}>
        <form noValidate autoComplete="off" className='clientInformation_form'>
            <section>
                Active Reservation: {' '}
                <Input value={reservation} disabled  style={{color: 'black'}}/>
            </section>

        </form>
    </Grid>
  );
}