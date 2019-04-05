//__________________________________________________________
//GLOBAL VARIABLES
//__________________________________________________________

//Initialize Firebase
var config = {
  apiKey: "AIzaSyBZvgarykUuLI_PI_XYyX2YRaY625Y8brw",
  authDomain: "train-scheduler-579d9.firebaseapp.com",
  databaseURL: "https://train-scheduler-579d9.firebaseio.com",
  projectId: "train-scheduler-579d9",
  storageBucket: "train-scheduler-579d9.appspot.com",
  messagingSenderId: "809459230620"
};

firebase.initializeApp(config);

var database = firebase.database();


function timer(){
  //Current Time
  var currentTime = moment();  
  var time = moment(currentTime).format("hh:mm:ss");
  // Puts the current time under the title
  $("#time").text("Current Time: " + time);
}

setInterval(timer, 1000);

$("#add-user").on("click", function(event) {

  // Stops it from submitting to default
  event.preventDefault();

  // Saves the inputs in a variable
  var name = $("#name-input").val()
  var destination = $("#destination-input").val()
  var time = $("#time-input").val().trim();
  var frequency = $("#frequency-input").val()

  // Puts the information in the Firebase Database
  database.ref().push({
    name: name,
    destination: destination,
    time: time,
    frequency: frequency,
  })

  // Clears all of the text-boxes
  $("#employee-name-input").val("");
  $("#role-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
})

database.ref().on("child_added", function(snapshot) {
  console.log(snapshot.val());

  alert("A new train has been added!");
  
  // Saves the value from the Database in a variable
  var newTrain = snapshot.val().name;
  var newDestination = snapshot.val().destination;
  var newTime = snapshot.val().time;
  var newFrequency = snapshot.val().frequency;


  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(newTime, "HH:mm").subtract(1, "years");

 // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
 

  //Time apart (remainder)
  var tRemainder = diffTime % newFrequency;

  // Minute Until Train
  var tMinutesTillTrain =  newFrequency - tRemainder;


  

  // Creating a new row to save and display the information that is saved to the database
  var newRow = $("<tr>")
  var newTrainRow = "<th scope='row'>" + newTrain + "</th>";
  var newDestinationRow = "<td>" + newDestination + "</td>";
  var newTimeRow = "<td>" + newTime + "</td>";
  var newFrequencyRow = "<td>" + newFrequency + "</td>";
  var arrivalTimeRow = "<td>" + tMinutesTillTrain + "</td>";

  // Adds the information to the row
  newRow.append(newTrainRow);
  newRow.append(newDestinationRow);
  newRow.append(newFrequencyRow);
  newRow.append(newTimeRow);
  newRow.append(arrivalTimeRow);
  
  // Adds the row to the HTML page
  $("#table-body").append(newRow)
})