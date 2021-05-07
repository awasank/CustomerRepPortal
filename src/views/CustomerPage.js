import React, {useEffect, useState} from "react";
import { set, useForm } from "react-hook-form";
import api from "../api"
import helper from "../utils/helper"
import {Button} from "@material-ui/core"
import Box from '@material-ui/core/Box';

import {makeStyles} from "@material-ui/styles"
import Grid from '@material-ui/core/Grid';

import '../index.css';


import {connect} from "react-redux";
import {fetchReservations} from "../actions/taskRouterActions"


const useStyle = makeStyles(() => ({
    body:{
        padding: "2rem"
    },
    root: {
        flexGrow: 1,
      },
    btn: {
        margin: "1rem 1rem",
        width: "10rem",
        height: "5rem",
        color: "#0099CC",
        border: "2px solid #0099CC",
        borderRadius: "6px",
        


    },
    paper: {
        height: "100%"
      }
}))

function CustomerPage(props) {
  const { register, handleSubmit } = useForm();
  const [value, setValue] = useState({})
  const classes = useStyle()
  const [logs, setLogs] = useState('logs here.....................................................')

  const [token, setToken] = useState(false)  
  const [online, setOnline] = useState(true)    
  const [offline, setOffline] = useState(true)    
  const [accept, setAccept] = useState(true)    
  const [reject, setReject] = useState(true)    
  const [end, setEnd] = useState(true)   
  const [tokenSet, setTokenSet] = useState();
  const [reservationFn, setReservationFn] = useState(false)

  const [isReserved, setIsReserved] = useState(false)
  const [numReserved, setNumReserved] = useState([]);

  const [workerActivity, setWorkerActivity] = useState('Logged Out')

  const [agentName, setAgentName] = useState('')

  useEffect(() => {
      setInterval(() => {
        if (token) fetchReservations()    
      }, 5000);
      
   }, [workerActivity === 'Available'])  

   useEffect (() => {
    switch (workerActivity) {
        case "Logged Out":
            // $('#btn-online').prop('disabled', true);
            // $('#btn-offline').prop('disabled', true);
            // $('#btn-acceptTR').prop('disabled', true);
            // $('#btn-rejectTR').prop('disabled', true);
            // $('#btn-trHangup').prop('disabled', true);
            // getTrActivies();
            setOnline(true)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
        case "Available":
            // $('#btn-online').prop('disabled', true);
            // $('#btn-offline').prop('disabled', false);
            // $('#btn-acceptTR').prop('disabled', true);
            // $('#btn-rejectTR').prop('disabled', true);
            // $('#btn-trHangup').prop('disabled', true);
            setOnline(true)
            setOffline(false)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
        case "Offline":
            // $('#btn-online').prop('disabled', false);
            // $('#btn-offline').prop('disabled', true);
            // $('#btn-acceptTR').prop('disabled', true);
            // $('#btn-rejectTR').prop('disabled', true);
            // $('#btn-trHangup').prop('disabled', true);
            setOnline(false)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
        case "Incoming Reservation":
            // $('#btn-online').prop('disabled', true);
            // $('#btn-offline').prop('disabled', true);
            // $('#btn-acceptTR').prop('disabled', false);
            // $('#btn-rejectTR').prop('disabled', false);
            // $('#btn-trHangup').prop('disabled', true);
            setOnline(true)
            setOffline(true)
            setAccept(false)
            setReject(false)
            setEnd(true)
            break;
        case 'Reservation Accepted':
            // $('#btn-online').prop('disabled', true);
            // $('#btn-offline').prop('disabled', true);
            // $('#btn-acceptTR').prop('disabled', true);
            // $('#btn-rejectTR').prop('disabled', true);
            // $('#btn-trHangup').prop('disabled', false);
            setOnline(true)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(false)
            
            break;
        case "In a Call":
            // $('#btn-online').prop('disabled', true);
            // $('#btn-offline').prop('disabled', true);
            // $('#btn-acceptTR').prop('disabled', true);
            // $('#btn-rejectTR').prop('disabled', true);
            // $('#btn-trHangup').prop('disabled', false);
            setOnline(true)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(false)
            break;
        case "canceled":
            // $('#btn-online').prop('disabled', true);
            // $('#btn-offline').prop('disabled', false);
            // $('#btn-acceptTR').prop('disabled', true);
            // $('#btn-rejectTR').prop('disabled', true);
            // $('#btn-trHangup').prop('disabled', true);
            setOnline(true)
            setOffline(false)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
    }
   }, [workerActivity])


  const onSubmit = (data) => {
    console.log(data)
    setAgentName(data.Name)
    
    api.apiTaskRouter.getGrToken(data).then((res) => {
          // console.log(res.data)
          setToken(true)
          setTokenSet(res.data.token)
          setLogs(logs + "\n" + res.data.message)
        //   fetchReservations()
        // goOnline()
    })
    // setValue({name: '', password: ''}) 
     
    // setOnline(false)
    setWorkerActivity('Offline')
  };

  const [callSid, setCallSid] = useState();
  const fetchReservations = () => {
    console.log("Fetch Reservations ")  
    var worker = new Twilio.TaskRouter.Worker(tokenSet);
    // console.log(worker)
    var queryParams = {"ReservationStatus":"pending"};
    worker.fetchReservations(
        function (error, reservations) {
            if(error) {
                console.log(error.code);
                console.log(error.message);
                return;
            }
            var data = reservations.data;
            for(i=0; i<data.length; i++) {
                console.log(data[0].task.attributes.call_sid);
                
            }
            // console.log(reservations[0])
            // setCallSid(reservations.data[0].task.attributes.call_sid)
            // console.log("State Call SID" + callSid)
            setLogs(logs + "\nFetching Reservations" )
            data.forEach(d => setLogs(logs + "\n" + d.sid))    
            setLogs(logs + "\nNumber of reservations " + data.length)
            if (data.length > 0) {
                setNumReserved(reservations)
                setWorkerActivity('Incoming Reservation')
                
            }
        },
        queryParams
    );  
    // console.log(typeof numReserved)
    // console.log(Object.keys(numReserved))
    // console.log(numReserved.data.task)
    // console.log(numReserved[0].task.attributes.call_sid)
  }
  

  const goOnline = () => {
    var worker = new Twilio.TaskRouter.Worker(tokenSet);
    // console.log(worker)
    var queryParams = {"ReservationStatus":"pending"};
    worker.on("ready", function(worker) {
    console.log(worker.sid)             // 'WKxxx'
    console.log(worker.friendlyName)    // 'Worker 1'
    console.log(worker.activityName)    // 'Reserved'
    console.log(worker.available)       // false

    var payload = {
        available:true,
        workerSID: worker.sid
    }
    api.apiTaskRouter.online(payload).then((res) => {
        setLogs(logs + "\n" + res.data)
        
    })
    }); 
    console.log("Here")
    // setLogs(logs + "\nStatus Online")  
    setWorkerActivity('Available')
  }

  const goOffline = () => {
    
    var worker = new Twilio.TaskRouter.Worker(tokenSet);
    // console.log(worker)
    var queryParams = {"ReservationStatus":"pending"};
    worker.on("ready", function(worker) {
    console.log(worker.sid)             // 'WKxxx'
    console.log(worker.friendlyName)    // 'Worker 1'
    console.log(worker.activityName)    // 'Reserved'
    console.log(worker.available)       // false

    var payload = {
        available:false,
        workerSID: worker.sid
    }
    api.apiTaskRouter.online(payload).then((res) => {
        setLogs(logs + "\n" + res.data)
        
    })
    }); 
    setLogs(logs + "\nStatus Offline")  
    setWorkerActivity('Offline')
  }

  const acceptCall = () => {
    // console.log(token)
    // var worker = new Twilio.TaskRouter.Worker(tokenSet);
    // // console.log(worker)
    // setLogs(logs + "\nAccepting Reservation")
    // //var queryParams = {"ReservationStatus":"pending"};
    // worker.on("Reservation Accepted", function(reservation) {
    //     console.log("reservation accepted")
    //     console.log(reservation.task.attributes)      // {foo: 'bar', baz: 'bang' }
    //     console.log(reservation.task.priority)        // 1
    //     console.log(reservation.task.age)             // 300
    //     console.log(reservation.task.sid)             // WTxxx
    //     console.log(reservation.sid)                  // WRxxx
    // });
    
    console.log(numReserved.data[0])
    const payload = {
        data: numReserved.data[0],
        request: true,
        callSid: callSid
    }
    setLogs(logs + "\nCall Accepted")
    api.apiTaskRouter.acceptReject(payload).then((res) => {
        console.log(res)
        // api.apiTaskRouter.dequeueConference(payload).then((res) => {
        // console.log(res)
        // })
    })
    


    setWorkerActivity("In a Call")
    }

  const rejectCall = (token) => {
    // console.log("Get Gr Token")
    // console.log(token)
    // var worker = new Twilio.TaskRouter.Worker(tokenSet);
    // // console.log(worker)
    // var queryParams = {"ReservationStatus":"pending"};
    // worker.on("reservation.rejected", function(reservation) {
    // console.log(reservation.task.attributes)      // {foo: 'bar', baz: 'bang' }
    // console.log(reservation.task.priority)        // 1
    // console.log(reservation.task.age)             // 300
    // console.log(reservation.task.sid)             // WTxxx
    // console.log(reservation.sid)                  // WRxxx
    // })
    console.log(numReserved.data[0])
    const payload = {
        data: numReserved.data[0],
        request: false
    }
    api.apiTaskRouter.acceptReject(payload).then((res) => {
        console.log(res)
    })
    setWorkerActivity("Offline")
  }

  const endConference = () => {
    var worker = new Twilio.TaskRouter.Worker(tokenSet);
    // console.log(worker)
    var queryParams = {"ReservationStatus":"pending"};
    worker.on("ready", function(worker) {
    console.log(worker.sid)             // 'WKxxx'
    console.log(worker.friendlyName)    // 'Worker 1'
    console.log(worker.activityName)    // 'Reserved'
    console.log(worker.available)       // false

    var payload = {
        data: numReserved.data[0],
        workerSID: worker.sid
    }
    api.apiTaskRouter.endConference(payload).then((res) => {
        setLogs(logs + "\n" + res.data)
        
    })
    }); 
    setLogs(logs + "\nStatus Offline")  
    setWorkerActivity('Offline')  
    setTimeout(() => {
       setWorkerActivity("Available") 
    }, 2000);
  }
  
  

  return (
      
     <div className={classes.body}>
    <div className={classes.root}>
    <Grid container spacing={5} direction="row" justify="flex-start" alignItems="flex-start">
        <Grid item sm={4} md={4} lg={3} className="left_panel" style={{ minHeight:"900px"}}>
            <div style={{minHeight:"75px", backgroundColor:"rgb(54, 49, 119)", color:"white", marginBottom:"1rem"}}><h4 style={{textAlign: "center", paddingTop:"10px"}}>Customer Representative Portal</h4></div>
        <form onSubmit={handleSubmit(onSubmit)}>

        <div className='login_div' style={{display: workerActivity === 'Logged Out' ? "inline" : "none"}}>
        <input className="form-control" {...register("Name", {required:true})} placeholder="Custome Name" />
        <input className="form-control" {...register("Password", {required:true})} type="password" placeholder="password" />
        <Button disabled={token && true} className='login_btn' variant="contained" type="submit">Login</Button>
        </div>
        <div className='status_div'>
            <div style={{display: workerActivity !== 'Logged Out' ? "inline" : "none"}}>
                <h2>Agent Name: {agentName}</h2> 
            </div>
        
            <div>
                <h3 style={{color: workerActivity === "Incoming Reservation" ? "red" : "black"}}>Current Status: {workerActivity}</h3>
            </div>
        </div>
        <div className='agent_buttons'>
            <Button onClick={goOnline} disabled={online && true} className={classes.btn} variant="contained">Go Online</Button>
            <Button onClick={goOffline} disabled={offline} className={classes.btn} variant="contained">Go Offline</Button>
            <Button onClick={acceptCall} disabled={accept && true} className={classes.btn} variant="contained">Accept</Button>
            <Button onClick={rejectCall} disabled={reject && true} className={classes.btn} variant="contained">Reject</Button>
            <Button onClick={endConference} disabled={end && true} className={classes.btn} variant="contained">End Conference</Button>
        </div>
        <div>
        {/* <textarea style={{width: "50%", margin: "2rem auto"}} value={logs} name="logs" placeholder="logs here" rows="5" className="form-control" readOnly></textarea> */}
        </div>
        </form>
        </Grid>
        <Grid item sm={8} md={8} lg={9} className='right_panel' style={{ minHeight:"900px"}}>
            <Grid className="customer_info_border_wrap" container spacing={5} direction="row" justify="flex-start" alignItems="flex-start">
                <Grid item sm={12} md={12} lg={12} style={{ minHeight:"100px", borderBottom:"5px ridge #E0C4BA"}}>
                    hello
                </Grid>
                <Grid   item sm={12} md={12} lg={12} style={{ minHeight:"780px"}}>
                    hello
                </Grid>

            </Grid>
        </Grid>
    </Grid>
    </div>
    </div> 
  );
}

const mapStateToProps = state => ({
    reservations: state.task.reservations
})

export default connect(mapStateToProps, {fetchReservations})(CustomerPage)