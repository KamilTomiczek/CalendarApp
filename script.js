var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var d = new Date()
var selectedDate = new Date()

let option = { day: "2-digit", month: "2-digit", year: "numeric"}

function getEvents() {
    let events

    if(localStorage.getItem('events') === null){
        events = []
    }else {
        events = JSON.parse(localStorage.getItem('events'))
    }
    
    return events
}

function loadMainItems(){

    let x = getEvents()

    if(selectedDate.getDay() == 0){
        var dateContainer = new Date(selectedDate - (1000 * 60 * 60 * 24 * (selectedDate.getDay() + 6)))
    }
    else{
        var dateContainer = new Date(selectedDate - (1000 * 60 * 60 * 24 * (selectedDate.getDay() - 1)))
    }

    let elements = document.querySelectorAll(".main .day")

    for(let i = 0; i < 7; i++){
        elements[i].querySelector(".items").innerHTML = ""
        elements[i].querySelector(".dateContainer p").innerHTML = dateContainer.toLocaleString("en-US", option)


        if(x.length != 0){
            for(let j = 0; j < x["items"].length; j++){
                if(x["items"][j].date == dateContainer.toLocaleString("en-US", option)){
                    elements[i].querySelector(".items").innerHTML += '<div class="item" style="background: ' + x["items"][j].color + ';"><h4>' + x["items"][j].title + '</h4><p>' + x["items"][j].time + '</p><img src="img/trash.png" onclick="delEvent(' + j + ')" alt=""></div>'
                }
            }
        }

        dateContainer.setDate(dateContainer.getDate() + 1)
    }     
}

function delEvent(indx){
   
    let events = getEvents()
    events["items"].splice(indx, 1)

    localStorage.setItem('events', JSON.stringify(events))

    loadMainItems()
}

function addEvent(){
    let events = getEvents()

    let title = document.getElementById("title")
    let color = document.getElementById("color")
    let from = document.getElementById("from")
    let to = document.getElementById("to")

    let time

    if(from.value > to.value){
        time = to.value + " - " + from.value
    }
    else{
        time = from.value + " - " + to.value
    }

    events["items"].push(JSON.parse('{"title": "' + title.value + '","date": "' + selectedDate.toLocaleString("en-US", option) + '","time": "' + time + '","color": "' + color.value + '"}'))

    localStorage.setItem('events', JSON.stringify(events))

    title.value = ""
    color.value = "#ffffff"
    from.value = ""
    to.value = ""

    loadMainItems()
}


function getDays(year, month) {
    return new Date(year, month, 0).getDate();
}

function createCalendar(){
    let calendar = "<tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr>"

    let f = true
    let l = 0

    let daysNumber = getDays(d.getFullYear(), d.getMonth() + 1);

    for(let j = 1; j <= daysNumber; j){

        calendar += "<tr>"

        if(f){
            for(let i = 1; i < new Date(d.getFullYear(), d.getMonth(), 1).getDay(); i++){
                calendar += "<td></td>"
                l++
            }

            f = false
        }
        
        for(let i = 0; i < 7 - l; i++){
            if(j != d.getDate()){
                if(j <= daysNumber){
                    calendar += '<td><input type="radio" onclick="valueChanged(this);" name="day" value="' + j + '">' + j + '<span class="checkmark"></td>'
                    j++
                }
                else{
                    break
                }
            }
            else{
                calendar += '<td><input type="radio" name="day" onclick="valueChanged(this);" checked value="' + j + '">' + j + '<span class="checkmark"></td>'
                j++
            }
        }

        l = 0

        calendar += "</tr>"
    }    

    document.querySelector(".calendar").innerHTML = calendar
    document.querySelector(".month").innerHTML = months[d.getMonth()] + " " + d.getFullYear()
}

createCalendar()
loadMainItems()

// Clock

var options = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"}
const datetimeItem = document.querySelector(".datetime p")

setInterval( () => {
    var now = new Date(Date.now())
    datetimeItem.innerHTML = now.toLocaleString("en-US", options)
}, 1000)


// Events

var nav = d.getMonth()

function valueChanged(el){
    selectedDate.setFullYear(d.getFullYear())
    selectedDate.setMonth(d.getMonth())
    selectedDate.setDate(el.value)

    loadMainItems()
}

function changeDate(i){
    if(i != 0){
        if(nav == 0 && i < 0){
            d.setMonth(nav = 11)
            d.setFullYear(d.getFullYear() - 1)
            d.setDate(1)
        }
        else if(nav == 11 && i > 0){
            d.setMonth(nav = 0)
            d.setFullYear(d.getFullYear() + 1)
            d.setDate(1)
        }
        else {
            d.setMonth(nav += i)
            d.setDate(1)
        }
    }
    else{
        let _now = new Date(Date.now())

        d.setFullYear(_now.getFullYear())
        d.setMonth(_now.getMonth())
        d.setDate(_now.getDate())

        nav = _now.getMonth()
    }
    
    selectedDate = d

    loadMainItems()
    createCalendar()
}