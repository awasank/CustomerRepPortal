import React, {useEffect, useState} from "react";
import { set, useForm } from "react-hook-form";
import api from "../api"
import helper from "../utils/helper"
import {Button} from "@material-ui/core"

import {makeStyles} from "@material-ui/styles"
import Grid from '@material-ui/core/Grid';

import '../index.css';


import {connect} from "react-redux";
import {fetchReservations} from "../actions/taskRouterActions"
import QueueInfo from "./QueueInfo";
import AdditionalInfoPage from "./AdditionalInfoPage";
import ReservationInfo from "./reservatonInfo";


const useStyle = makeStyles(() => ({
    body:{
        padding: "0.5rem 1rem"
    },
    root: {
        flexGrow: 1,
      },
    btn: {
        margin: "1rem 1rem",
        minWidth: "90%",
        height: "4rem",
        color: "white",
        border: "2px solid #0099CC",
        borderRadius: "40px !important",
        backgroundColor: "#87C550",
        '&:hover': {
            background: "#FD7E14",
        },


    },
    paper: {
        height: "100%"
      }
}))

function CustomerPage(props) {
  const { register, handleSubmit } = useForm();
  
  const classes = useStyle()
  const [logs, setLogs] = useState('logs here.....................................................')

  const [token, setToken] = useState(false)  
  const [online, setOnline] = useState(true)    
  const [offline, setOffline] = useState(true)    
  const [accept, setAccept] = useState(true)    
  const [reject, setReject] = useState(true)    
  const [end, setEnd] = useState(true)   
  const [tokenSet, setTokenSet] = useState();
  
  const [numReserved, setNumReserved] = useState([]);

  const [workerActivity, setWorkerActivity] = useState('Logged Out')

  const [agentName, setAgentName] = useState('')

  const [wrapping, setWrapping] = useState(10)

  const [fetchRes, setFetchRes] =  useState(false)
  const [intervalRes, stIntervalRes] = useState(8000)

//   useEffect(() => {
//     stRes()
//   }, [workerActivity === "Available"])  

  const stRes = () => setInterval(() => {
   
    if (workerActivity  === 'Available') {
    console.log("Worker Activity Use Effect " + workerActivity)
    fetchReservations()    
    }
    // stIntervalRes(stRes())
   }, 8000); 
 
   useEffect (() => {
    switch (workerActivity) {
        case "Logged Out":
            setOnline(true)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
        case "Available":
            setOnline(true)
            setOffline(false)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
        case "Offline":
            setOnline(false)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
        case "Incoming Reservation":
            setOnline(true)
            setOffline(true)
            setAccept(false)
            setReject(false)
            setEnd(true)
            break;
        case 'Reservation Accepted':
            setOnline(true)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(false)            
            break;
        case "In a Call":
            setOnline(true)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(false)
            break;
        case "canceled":
            setOnline(true)
            setOffline(false)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
        case "Wrapping up":
            setOnline(true)
            setOffline(true)
            setAccept(true)
            setReject(true)
            setEnd(true)
            break;
    }
   }, [workerActivity])


  const onSubmit = (data) => {
    console.log("On Submit" + data)
    setAgentName(data.Name)
    
    api.apiTaskRouter.getGrToken(data).then((res) => {
          
          setToken(true)
          setTokenSet(res.data.token)
          setLogs(logs + "\n" + res.data.message)
    })
    setWorkerActivity('Offline')
  };

  const [callSid, setCallSid] = useState();
  const [totalTasks, setTotalTask] = useState([])

  const fetchReservations = () => {
    console.log("Fetching Reservations " + workerActivity)
    // if (workerActivity  === 'Available' || workerActivity === "Incoming Reservation") {  
    console.log("Fetch Reservations ")  
    var worker = new Twilio.TaskRouter.Worker(tokenSet);
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
                console.log(data[0]);
                
            }
            // console.log(reservations[0])
            // setCallSid(reservations.data[0].task.attributes.call_sid)
            // console.log("State Call SID" + callSid)
            setLogs(logs + "\nFetching Reservations" )
            data.forEach(d => setLogs(logs + "\n" + d.sid))    
            setLogs(logs + "\nNumber of reservations " + data.length)

            if (data.length > 0) {
                setNumReserved(data)
                setWorkerActivity('Incoming Reservation')    
            }

            // const wrappingTask = data.filter(d => d.task.assignmentStatus === 'wrapping')
            // if (wrappingTask.length > 0) {
            // wrappingTask.map((w) => {
            //     const payload = {
            //         data: w
            //     }

            //     api.apiTaskRouter.completeTask(payload).then((res) => {
            //         console.log(res)
            //     })
            // })}
            // const reservedTask = data.filter(d => d.task.assignmentStatus === 'reserved')
            // if (reservedTask.length > 0) {
            //     console.log(reservedTask)
            //     setNumReserved(reservedTask)
            //     setWorkerActivity('Incoming Reservation')
                
            // } 
            // const cancelledTask = data.filter(d => d.task.assignmentStatus === 'pending')
            // if (cancelledTask.length > 0) {
            //     setWorkerActivity("Available")
            // }
        },
        queryParams
    );  
    worker.fetchReservations(
        function (error, reservations) {
            if(error) {
                console.log(error.code);
                console.log(error.message);
                return;
            }
            var data = reservations.data;
            for(i=0; i<data.length; i++) {
                console.log(data[0].task.assignmentStatus);
                
            }
            // console.log(reservations[0])
            // setCallSid(reservations.data[0].task.attributes.call_sid)
            // console.log("State Call SID" + callSid)
            setLogs(logs + "\nFetching Reservations" )
            data.forEach(d => setLogs(logs + "\n" + d.sid))    
            setLogs(logs + "\nNumber of reservations " + data.length)

            // if (data.length > 0) {
            //     setNumReserved(data)
            //     setWorkerActivity('Incoming Reservation')    
            // }
            setTotalTask(data)
            const wrappingTask = data.filter(d => d.task.assignmentStatus === 'wrapping')
            if (wrappingTask.length > 0) {
            wrappingTask.map((w) => {
                const payload = {
                    data: w
                }

                api.apiTaskRouter.completeTask(payload).then((res) => {
                    console.log(res)
                })
            })}
            // const reservedTask = data.filter(d => d.task.assignmentStatus === 'reserved')
            // if (reservedTask.length > 0) {
            //     console.log(reservedTask)
            //     setNumReserved(reservedTask)
            //     setWorkerActivity('Incoming Reservation')
                
            // } 
            // const cancelledTask = data.filter(d => d.task.assignmentStatus === 'pending')
            // if (cancelledTask.length > 0) {
            //     setWorkerActivity("Available")
            // }
        },
        // queryParams
    ); 
    // console.log(typeof numReserved)
    // console.log(Object.keys(numReserved))
    // console.log(numReserved.data.task)
    // console.log(numReserved[0].task.attributes.call_sid)
    // }
  }
  

  const fetchWorkerActivity = () => {
    //   console.log("Fetching Worker Activity")
      var worker = new Twilio.TaskRouter.Worker(tokenSet);
      console.log("Fetching Worker Activity " + worker.workerSid)
      const payload = {
          workerSid: worker.workerSid
      }
    //   console.log(payload)  
      api.apiTaskRouter.fetchWorkersBySid(payload).then((res) => {
        console.log("response fetch Worker activity" + res.data.data)
        setWorkerActivity(res.data.data.activityName)
      })
  }
  
  const [intv, setIntv] = useState();

  const goOnline = () => {
      clearInterval(wrappingTime)
    setWorkerActivity('Available')
    const intvl = setInterval(() => {
        console.log("Set Interval")
        // if (workerActivity  === 'Available') {
        console.log("Worker Activity Use Effect " + workerActivity)
        fetchReservations()    
        // }
        // stIntervalRes(stRes())
    }, 8000);  
    // intvl()
    setIntv(intvl) 
    var worker = new Twilio.TaskRouter.Worker(tokenSet);


    var payload = {
        available:true,
        workerSID: worker.workerSid
    }
    api.apiTaskRouter.online(payload).then((res) => {
        setLogs(logs + "\n" + res.data)
        
    })
    
    setFetchRes(true)
  }

  
  const goOffline = () => {
    setWorkerActivity('Offline')
    
    setFetchRes(false)
    console.log(intervalRes)
    clearInterval(intv)

    console.log("Going Offline " + workerActivity)
    var worker = new Twilio.TaskRouter.Worker(tokenSet);
 

    var payload = {
        available:false,
        workerSID: worker.workerSid
    }
    api.apiTaskRouter.online(payload).then((res) => {
        
        setLogs(logs + "\n" + res.data)
        
    })
    setLogs(logs + "\nStatus Offline")  
    
  }

  const acceptCall = () => {
    
    console.log("Accept Call" + numReserved[0])
    const payload = {
        data: numReserved[0],
        request: true,
        callSid: callSid
    }
    setLogs(logs + "\nCall Accepted")
    api.apiTaskRouter.acceptReject(payload).then((res) => {
        console.log("response accept call" + res)
    })
    


    setWorkerActivity("In a Call")
    }

  const rejectCall = () => {
    
    // setWorkerActivity('Offline')
    // setFetchRes(false)
    // clearInterval(intervalRes)
    goOffline()
    const payload = {
        data: numReserved[0],
        request: false
    }
    api.apiTaskRouter.acceptReject(payload).then((res) => {
        console.log("response reject call" + res)
    })
    
  }

  
//   const [dateNow, setDateNow] = useState();
//   const calculateTimeLeft = () => {
//     // let year = new Date().getFullYear();
//     let difference = +new Date() - +dateNow;
//     let timeLeft;

//     if (difference > 0) {
//         timeLeft = Math.floor((difference / 1000) % 60)
//     }
//     console.log("Time left is")

//     return timeLeft;

//     }
    
    const [wrappingTime, setWrappingTime] = useState()
    // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [tL, setTL] = useState([])
    const [timeNow, setTimeNow] = useState()

    const endConference = () => {
    var worker = new Twilio.TaskRouter.Worker(tokenSet);

    var payload = {
        data: numReserved[0],
        workerSID: worker.workerSid
    }
    api.apiTaskRouter.endConference(payload).then((res) => {
        setLogs(logs + "\n" + res.data)
        
    })

    setLogs(logs + "\nStatus Offline")  
      
    goOffline()
    setWorkerActivity('Wrapping up')
    setTimeout(() => {
       goOnline() 
       setWorkerActivity("Available") 
    }, wrapping*1000);
    setNumReserved([])

    // setDateNow(new Date());
    // const t = setInterval(() => {
    //     setTimeLeft(calculateTimeLeft())
    // }, 1000);
    // setWrappingTime(t)
 
     
     setT()
  }


  const setT = () => {
    const n = new Date() 
    // setTimeNow(n)

   const wt = setInterval(() => {
        const nD = new Date()
        // setTL(nD)
        const diffTime = Math.abs(nD -n)
        const diffSec = Math.ceil(diffTime / (1000))
        setTL(wrapping - diffSec)
    }, 1000);
    setWrappingTime(wt)
 }

  

    
  return (
      
     <div className={classes.body}>
         
    <div className={classes.root}>
    
        <div className='mainGrid'>
            
    <Grid container spacing={5} direction="row" justify="flex-start" alignItems="flex-start" >
        <Grid item sm={4} md={4} lg={3} className="left_panel" style={{ minHeight:"900px"}}>
        {/* <button onClick={setT}>Set timer</button>
         <p>Time Remaining: {tL}</p> */}
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
        {workerActivity === 'Wrapping up' && 
        <>
        {/* <h3>You will be online in {wrapping} seconds</h3> */}
        {/* <Button variant="contained" onClick={() => setWrapping(wrapping + 15)}>+15 seconds</Button> */}
        </>
        }
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
                    <AdditionalInfoPage
                    numReserved = {numReserved}
                    totalTasks = {totalTasks}
                    />
                </Grid>
                {/* {workerActivity === "Incoming Reservation"} */}
                <ReservationInfo 
                numReserved = {numReserved} 
                totalTasks = {totalTasks}
                />
                <Grid   item sm={12} md={12} lg={12} style={{ minHeight:"780px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <QueueInfo 
                    totalTasks = {totalTasks}/>
                </Grid>

            </Grid>
        </Grid>
    </Grid></div>
    </div>
    </div> 
  );
}

const mapStateToProps = state => ({
    reservations: state.task.reservations
})

export default connect(mapStateToProps, {fetchReservations})(CustomerPage)