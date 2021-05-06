const fetchReservations = (token) => {
    console.log("Get Gr Token")
    console.log(token)
    
    var worker = new Twilio.TaskRouter.Worker(token);
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
                console.log(data[i].sid);
            }
            return reservations
        }
    );
    // worker.fetchReservations().then((error, reservations) => {
    //             if(error) {
    //             console.log(error.code);
    //             console.log(error.message);
    //             return;
    //         }
    //         var data = reservations.data;
    //         for(i=0; i<data.length; i++) {
    //             console.log(data[i].sid);
    //         }
    //         return "reservations"
    // })
}



const helper = {
    fetchReservations
} 

export default {helper}