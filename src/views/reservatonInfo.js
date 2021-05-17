import React, { useEffect, useState } from "react"
import Grid from '@material-ui/core/Grid';
import api from "../api";

const ReservationInfo = (props) => {
    const [reservation, setReservation] = useState(props.numReserved)
    const [totalTask, setTotalTask] = useState(props.totalTask)
    const [userInfoByNum, setUserInfoByNum] = useState()
    const [userInfo, setUserInfo] = useState()

    useEffect(() => {
        setReservation(props.numReserved)
        fetchUserInfo()
    },[props.numReserved])

    const fetchUserInfo = () => {
        setUserInfo("Searching database...")
        setUserInfoByNum("Searching database...")
        if (reservation.length > 0){
            api.apiTaskRouter.fetchUserByNumber(reservation[0].task.attributes.from).then((res) => {
                if (res.data.success) {
                    console.log(res.data.data.first_name)
                    setUserInfoByNum(res.data.data)
                } else {
                    setUserInfoByNum("No records found")
                }
                
            })
            // console.log(reservation[0].task.attributes.dob)    
            console.log(reservation[0].task.attributes.code)
            api.apiTaskRouter.fetchUserByInfo(reservation[0].task.attributes.code).then((res) => {
                if (res.data.success) {
                    console.log(res.data.data)
                    setUserInfo(res.data.data)
                } else {
                    setUserInfo("No records founds")
                }

            })
        }
    }

    const userInfoList = () => {
        return (
            <>

            {userInfoByNum.first_name ? 
            <div>
            <p>Name: {userInfoByNum.first_name} {userInfoByNum.middle_name} {userInfoByNum.last_name}</p>
            <p>Status: {userInfoByNum.status}</p>
            <p>Email: {userInfoByNum.email}</p>
            <p>Date Of Birth: {userInfoByNum.dob}</p>
            <p>Address: {userInfoByNum.street_address}, {userInfoByNum.city}, {userInfoByNum.province} - {userInfoByNum.postal_code}</p>
            <p>Credit Limit: {userInfoByNum.credit_limit}</p>
            
            </div>
            : <p>{userInfoByNum}</p>
            }
            
            </>
        )
    }

    const userInfoList1 = () => {
        return (
            <>
            {userInfo.first_name ? 
            <div>
            <p>Name: {userInfo.first_name} {userInfo.middle_name} {userInfo.last_name}</p>
            <p>Status: {userInfo.status}</p>
            <p>Email: {userInfo.email}</p>
            <p>Date Of Birth: {userInfo.dob}</p>
            <p>Address: {userInfo.street_address}, {userInfo.city}, {userInfo.province} - {userInfo.postal_code}</p>
            <p>Credit Limit: {userInfo.credit_limit}</p>
            </div>
            : <p>{userInfo}</p>
            }
            
            </>
        )
    }

    const listInfo  = () => {
        return(
            <>
            {/* <p>{reservation[0].task.attributes.skills}</p> */}
            <p>Caller Number: {reservation[0].task.attributes.from}</p>
            <p>Caller City: {reservation[0].task.attributes.from_city}</p>
            <Grid
            container 
            spacing={3}>
                <Grid
                item
                sm={6} md={6} lg={6}
                >
                <h5>Fetching Caller Info By Number...</h5>
                {userInfoList()}
                </Grid>
                <Grid
                item
                sm={6} md={6} lg={6}
                >
                <h5>Fetching Caller Info By User Info...</h5>
                {userInfoList1()}    
                </Grid>
            </Grid>
            

            </>
        )
        

        // "from_country":"CA","called":"+15878164297","to_country":"CA","to_city":"","to_state":"Alberta","skills":"support","caller_country":"CA","call_sid":"CA585048148c0e591345b7162ad3704887","account_sid":"AC3d6ad1b00c45dfd5212fca2f1cd4129d","from_zip":"","from":"+16136507610","direction":"inbound","callSid":"CA585048148c0e591345b7162ad3704887","called_zip":"","caller_state":"ON","to_zip":"","called_country":"CA","from_city":"KINGSTON","called_city":"","caller_zip":"","api_version":"2010-04-01","called_state":"Alberta","from_state":"ON","caller":"+16136507610","caller_city":"KINGSTON","to":"+15878164297"
    }

    return (
        <>
        <Grid item sm={12} md={12} lg={12}>
        <h5>Caller Info:</h5>
        {reservation.length > 0 &&
        // reservation[0].task.attributes.skills
            listInfo() 
        }
        </Grid>
        </>
    )
}

export default ReservationInfo