// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getUserIds, getData, addData, clearData} from "./storage.js";


let formInput = document.querySelector("#form-input");


function hideForm() {
  let formInput = document.querySelector("#form-input");
  if (formInput) {
    formInput.style.display = "none"; // Hide form
  }
}

function setTodayDate() {
  const dateInput = document.querySelector("#date-form");
  if (dateInput) {
    // Get today's date in the format YYYY-MM-DD
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0]; // Formats as "YYYY-MM-DD"
    
    // Set the value of the date picker to today's date
    dateInput.value = todayFormatted;
  }
}


//creating the dropdown for 5 users
const users = getUserIds();


function createDropDown(users) {
  let dropdownSelect = document.querySelector("#dropdown");
  for (let i = 0; i < users.length; i++) {
    let option = document.createElement("option");
    option.id = i + 1;
    option.innerHTML = `User ${users[i]}`;
    dropdownSelect.appendChild(option);
  }
  dropdownSelect.addEventListener("change", ()=>{
    formInput.style.display = "block"; // Show form
    let selectedOption = dropdownSelect.options[dropdownSelect.selectedIndex];
    let userId = selectedOption.id;
    console.log(userId);
    formData(userId);
    let gettingData = getData(userId);
    console.log(gettingData);
    displayAgendas(userId, gettingData);
  })
}

// function formData(userId){ // getting data from form and add them to local storage
  
//   let formTopic = document.querySelector("#topic-form");
//   let dateForm = document.querySelector("#date-form");
//   let buttonForm = document.querySelector("#form-button");
  
//   buttonForm.onclick = function(event) { // Overwrites previous event listener

//  //Fix form submission to handle empty input fields and display error message
//     let formTopicValue = formTopic.value;
//     let dateFormValue = dateForm.value;

//     if (formTopicValue === "" || dateFormValue === "") {
//         // Show message if either field is empty
//         alert("Input field is empty");
//         event.preventDefault(); // Prevent form submission
//         return;
//     }

    
//     let dataForm = {
//         topic: formTopic.value,
//         date: dateForm.value
//     };
//     console.log(dataForm);

//     addData(userId, dataForm);
// };

// }

function formData(userId) {  
  let formTopic = document.querySelector("#topic-form");  
  let dateForm = document.querySelector("#date-form");  
  let buttonForm = document.querySelector("#form-button");  

  buttonForm.onclick = function (event) {  
    let formTopicValue = formTopic.value;  
    let dateFormValue = dateForm.value;  

    if (formTopicValue === "" || dateFormValue === "") {  
      alert("Input field is empty");  
      event.preventDefault();  
      return;  
    }  

    let selectedDate = new Date(dateFormValue);  

    // Generate revision dates correctly  
    let revisionDates = [  
      new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000), // +1 week  
      new Date(new Date(selectedDate).setMonth(selectedDate.getMonth() + 1)), // +1 month  
      new Date(new Date(selectedDate).setMonth(selectedDate.getMonth() + 3)), // +3 months  
      new Date(new Date(selectedDate).setMonth(selectedDate.getMonth() + 6)), // +6 months  
      new Date(new Date(selectedDate).setFullYear(selectedDate.getFullYear() + 1)) // +1 year  
    ];  

    let dataForm = revisionDates.map(date => ({  
      topic: formTopicValue,  
      date: date.toISOString().split('T')[0] // Store in "YYYY-MM-DD" format  
    }));  

    dataForm.forEach(entry => addData(userId, entry));  

    displayAgendas(userId, getData(userId)); // Update UI  
  };  
}  

function displayAgendas(userId, gettingData1) {
  let ulAgendas = document.querySelector("#agenda");
  ulAgendas.innerHTML = ""; // Clear previous content

  if (!gettingData1 || gettingData1.length === 0) {
    ulAgendas.innerHTML = "<p>No upcoming agenda for this user.</p>";
  }
  // Sort the gettingData array by date
  let gettingData = gettingData1.sort((a, b) => {
    // Convert date strings into Date objects for comparison
    let dateA = new Date(a.date);
    let dateB = new Date(b.date);

    // Sort in ascending order: Date A comes before Date B
    return dateA - dateB;  // If dateA < dateB, result is negative, meaning a comes first
  });
  // Create a list of upcoming topics
  
  for(let i of gettingData){
    let liElement = document.createElement("li");
    liElement.innerHTML = `${i.topic}, ${formatDate(userId, i.date)}`
    ulAgendas.appendChild(liElement);
  }

}


function formatDate(userId, date){
  let dateArr = date.split("-"); // for example "2025-02-01"  ---> ["2025", "02", "01"]
  let day = (dateArr[2] == "01" || dateArr[2] == "21" || dateArr[2] == "31") 
  ? `${dateArr[2]}st`
  : (dateArr[2] == "02" || dateArr[2] == "22") 
  ? `${dateArr[2]}nd`
  : (dateArr[2] == "03" || dateArr[2] == "23") 
  ? `${dateArr[2]}rd`
  : `${dateArr[2]}th`; // fixing st nd rd th for days

  let month = (dateArr[1] == "01") ? "January" : (dateArr[1] == "02") ? "February" : (dateArr[1] == "03") ? "March"
  : (dateArr[1] == "04") ? "April" : (dateArr[1] == "05") ? "May" : (dateArr[1] == "06") ? "June" : (dateArr[1] == "07") ? "July"
  : (dateArr[1] == "08") ? "August" : (dateArr[1] == "09") ? "September" : (dateArr[1] == "10") ? "October"
  : (dateArr[1] == "11") ? "November" : "December";  // months names

  let year = dateArr[0];
  if(userId == 3){ // if user 3 selected then we show date as months till future date
    let today = new Date();
    let currentYear = today.getFullYear(); // current year
    let currentMonth = today.getMonth() + 1;  // Add 1 to get the month as 1-based index
    let futureMonth = Number(dateArr[1]); // future month
    let futureYear = Number(dateArr[0]); // future year

    let monthsDifference = (futureYear - currentYear) * 12 + (futureMonth - currentMonth); // calculating months

    return `${monthsDifference} months in the future (the same day of the month as today)`;
  }
  else{
    const formattedDate = `${day} ${month} ${year}`; // otherwise shows normal date if user is not user 3
    return formattedDate;
  }
  
}

window.onload = function () {
  createDropDown(users);
  hideForm();
  setTodayDate();
  console.log(getData(users[1]));
};


export {createDropDown, hideForm,setTodayDate}