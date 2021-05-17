import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';



export default function QueueInfo(props) {

    const [clientName, setName] = useState('John');
    const [clientNumber, setClientNumber] = useState('+12265785478');
    //const [clientName, setName] = useState('John');
    //const [clientName, setName] = useState('John');

    const taskTable = (task) => {
        // console.log(task)
        return(
            <tr>
                <td>
                {task.task.attributes.from}
                </td>
                <td>
                {task.reservationStatus}
                </td>
                <td>
                {task.task.assignmentStatus}
                </td>
                <td>
                {task.workerName}
                </td>
                
            </tr>
            
        )
    }
    
  return (
    <Grid item sm={12} md={12} lg={12}>
        <section className='accountInformation_header'> <p>All Calls Status</p></section>
        <table>
        <tr>
        <th>Caller Number</th>
        <th>Reservation Status</th>
        <th>Assignment Status</th>
        <th>Agent Name</th>
        </tr>
        {props.totalTasks.length > 0 &&
         props.totalTasks.map(taskTable)   
        }
        </table>
        
    </Grid>
  );
}