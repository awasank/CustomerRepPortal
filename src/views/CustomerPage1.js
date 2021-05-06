import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import api from "../api"
import helper from "../utils/helper"
import {Button} from "@material-ui/core"
import {makeStyles} from "@material-ui/styles"

import {connect} from "react-redux";
import {fetchReservations} from "../actions/taskRouterActions"


const useStyle = makeStyles(() => ({
    body:{
        padding: "2rem"
    },
    btn: {
        margin: "2rem 2rem",
        width: "10rem",
        height: "5rem"

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
  useEffect(() => {
      if (tokenSet) {
      props.fetchReservations(tokenSet)
      setReservationFn(true)  
      }
    
  },[tokenSet])

  useEffect(() => {
    if (reservationFn) reservationsUpdate()
  },[reservationFn])

 const reservationsUpdate = () =>{
   console.log("Rervation Update " + props.reservations.message)
    setLogs(logs + "\n" + props.reservations.message)
 }
  const onSubmit = (data) => {
    console.log(data)
    
    api.apiTaskRouter.getGrToken(data).then((res) => {
          // console.log(res.data)
          setToken(true)
          setTokenSet(res.data.token)
          setLogs(logs + "\n" + res.data.message)
    })
    // setValue({name: '', password: ''}) 
     
    setOnline(false)
  };
  

  const createTask = () => {
    //   api.apiTaskRouter.createTask().then((res) => {
    //       console.log(res)
    //   })
  }

  const goOnline = () => {
    setLogs(logs + "\nStatus Online")  
    setOnline(true)
    setOffline(false)
  }

  const goOffline = () => {
    setLogs(logs + "\nStatus Offline")  
    setOnline(false)
    setOffline(true)
  }

  const acceptCall = () => {

  }

  const rejectCall = () => {

  }

  const endConference = () => {

  }
  
  return (
     <div className={classes.body}>
         <h1>Customer Representative Portal</h1>
    <form onSubmit={handleSubmit(onSubmit)}>


      <input style={{width: "20%", margin: "2rem auto"}} className="form-control" {...register("Name", {required:true})} placeholder="Custome Name" />
      <input style={{width: "20%", margin: "2rem auto"}} className="form-control" {...register("Password", {required:true})} type="password" placeholder="password" />
      
       <br></br>
       <br></br>
      <Button disabled={token && true} className={classes.btn} variant="contained" type="submit">Get Token</Button>
      <Button onClick={goOnline} disabled={online && true} className={classes.btn} variant="contained">Go Online</Button>
      <Button onClick={goOffline} disabled={offline} className={classes.btn} variant="contained">Go Offline</Button>
      <Button onClick={acceptCall} disabled={accept && true} className={classes.btn} variant="contained">Accept</Button>
      <Button onClick={rejectCall} disabled={reject && true} className={classes.btn} variant="contained">Reject</Button>
      <Button onClick={endConference} disabled={end && true} className={classes.btn} variant="contained">End Conference</Button>
      <div>
      <textarea style={{width: "50%", margin: "2rem auto"}} value={logs} name="logs" placeholder="logs here" rows="5" className="form-control" readOnly></textarea>
      </div>
    </form>
    </div> 
  );
}

const mapStateToProps = state => ({
    reservations: state.task.reservations
})

export default connect(mapStateToProps, {fetchReservations})(CustomerPage)