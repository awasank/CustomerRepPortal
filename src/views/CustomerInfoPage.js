import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';



export default function CustomerInfoPage() {

    const [clientName, setName] = useState('John');
    const [clientNumber, setClientNumber] = useState('+12265785478');
    //const [clientName, setName] = useState('John');
    //const [clientName, setName] = useState('John');

  return (
    <Grid item sm={12} md={12} lg={12}>
        <section className='accountInformation_header'> <p>Account Information</p></section>
        <form noValidate autoComplete="off" className='clientInformation_form'>
            <section>
                Name: {' '}
                <Input value={clientName} disabled  style={{color: 'black'}}/>
            </section>
            <section>
                Name: {' '}
                <Input value={clientNumber}  disabled style={{color: 'black'}}/>
            </section>

        </form>
    </Grid>
  );
}