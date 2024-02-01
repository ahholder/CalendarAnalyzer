//------------------------------------------------------------------------------------------------------------------------------------------------------
//Global Variables
//------------------------------------------------------------------------------------------------------------------------------------------------------

let overlay;
let board;
let context;
let mapTerrain; //Unused?
let layers = []; //Unused?
let boardWidth = 700;
let boardHeight = 700;
let fps = 60;
let winds = [];

let pixes = 3;
let globalAnimationCycle = 0;
let animatedZones = [];
let animationsList = [];
let moverList = [];

let eventQueue = [];
let repeatQueue = [];
let blockedAreas = [];

let gameActive = true; //Unused?

let gridSize = [70, 70, 0, 0]; //Unused?
let totalTiles; //Unused?
let grid = []; //Unused?
let selected = -1; //Unused?
let mouseSpot = [];

let dropdowns;
let holidayList = [];
//let holidayDefaults = []; //Unused?

let HPs = []; //Unused?
let pathfinder = []; //Unused?
let weather = []; //Unused?

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Startup Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Initial Load
window.onload = function () {
    makeFoundationalElements();
    //makeGrid();
    //makeHPs();

    newGame();
}

//Foundational Element Log and Creation
function makeFoundationalElements() {

    overlay = document.getElementById("contents");
    overlay.width = boardWidth;
    overlay.height = boardHeight;
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");
    addAnimationZone(context);

    //let board2 = document.getElementById("board2");
    //board2.width = board.width;
    //board2.height = board.height;
    //board2.width = boardWidth;
    //board2.height = boardHeight;
    //mapTerrain = board2.getContext("2d");

    //makeCanvasLayers();
    overlay.addEventListener("mousemove", mouseMoved);
    document.addEventListener("keydown", presser);

    dropdowns = {
        "weekday": document.getElementById("weekdays"), "freq": document.getElementById("frequency"), "interval": document.getElementById("intervals"),
        "dday": document.getElementById("dday"), "dmonth": document.getElementById("dmonth"), "dyear": document.getElementById("dyear"), "sdate": [],
        "fday": document.getElementById("fday"), "fmonth": document.getElementById("fmonth"), "style": document.getElementById("soc1"),
        "result": document.getElementById("results"), "results": [], "rest": document.getElementById("resultt"), "fti": document.getElementById("ftitle"),
        "wti": document.getElementById("wtitle"), "purpose": document.getElementById("soc2"), "sday": document.getElementById("soc3"),
        "subb": document.getElementById("so3"), "holb": document.getElementById("so4"), "shol": document.getElementById("soc4"),
        "wdt": document.getElementById("label1")
    };

    makeAllDropdowns();

}

//Make Canvases
function makeCanvasLayers() {
    let totalLayers = 4;

    let winPendingId;
    let winTerms;
    let winValues;
    let winStyling;

    let w = boardWidth;
    let h = boardHeight;

    for (let i = 0; i < totalLayers; i++) {
        winPendingId = "CDL-" + i;
        winTerms = ["pos", "display", "w", "h", "bg", "marl", "mart", "z", "user"];
        winValues = ["absolute", "flex", w, h, "none", 0, 0, i, "none"];
        winStyling = cssMake(winValues, winTerms);
        layers[i] = logWin(overlay, winPendingId, "canvas", winStyling, ["none", "none"], false, false, false, false).win.getContext("2d");
        addAnimationZone(layers[i]);
    }

}

//Starts a New Program
function newGame() {

    //Final
    requestAnimationFrame(update);
}

//Determines Colors for HP Values
function makeHPs() {
    let max = 100;
    let current = [max, 0, 0];
    let topics = 7;
    let diff = 5;
    let change = [2, -1, 3, -2, 1, 2, 0];

    for (let i = 0; i < topics; i++) {
        let cycles = max / diff;
        if (i == topics - 1) cycles += 1;
        for (let i2 = 0; i2 < cycles; i2++) {

            //Setting Current
            let result = "#";
            let comp = [];
            for (let i3 = 0; i3 < current.length; i3++) {
                if (current[i3] >= 100) {
                    comp[i3] = "ff";
                } else if (current[i3] <= 9) {
                    comp[i3] = "0" + current[i3].toString();
                } else {
                    comp[i3] = current[i3];
                }
                result += comp[i3];
            }

            HPs[HPs.length] = result;

            //Modifying Next
            if (change[i] != 0) {
                let mod = Math.abs(change[i]) - 1;
                if (change[i] < 0) {
                    current[mod] -= diff;
                } else {
                    current[mod] += diff;
                }
            } else {
                for (let i3 = 0; i3 < current.length; i3++) {
                    current[i3] -= diff;
                }
            }
        }
    }
}

//A Test Run Each Frame
function testFrameOne() {

    //Single-Instance Test(s)
    if (globalAnimationCycle == 1) {
        //commonWeather("light rain");
        //makePathfinder();

        /*console.log(makeHolidayDefaults(2024));
        console.log(checkLunarCalendar(new Date(2024, 1, 1)));
        console.log(findNextLunarPhase("Full", getEquinox(2024, "spring"), 1));
        console.log(getEquinox(2024, "spring"));
        console.log(checkLunarCalendar(new Date(2024, 2, 24)));
        console.log(checkLunarCalendar(new Date(2024, 2, 23)));
        console.log(applyHolidays([new Date(2024, 9, 14)], true, false));
        console.log(applyHolidays([new Date(2024, 9, 14)], false, false));*/
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//To-Do Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//-Create an Alternate Query Function Displaying Anomalous Payroll Periods
  //-Payroll Every 2 Weeks, Making 2 Months of the Year with 3 Payroll Payouts
    //-CLARIFY WHEN THIS HAPPENS ~ When a Pay Period Ends Between End of Pay Period and Submission?
  //-Specialized Alert for January* to Remind Jennifer to Submit on Thursday
    //-Makes February the Month with an Additional Pay Period, Giving More Time to Accrue Funds

//Future Project: Make Dropdown Menu to Enable Selection of Holidays from Federal/Major Holidays

//<div id="spclTest" style="width: 200px; height: 100%; border: 1px solid red; background: skyblue; display: flex; position: relative"></div>

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Calendar Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Adds a Dropdown Menu Option
function makeDropdownOption(drop, value, content) {
    let inner = "<option value=" + value + ">" + content + "</option>";
    drop.innerHTML += inner;
}

//Modifies All Starting Dropdown Menus
function makeAllDropdowns() {
    let clock;
    makeDropdownWeekday();
    makeDropdownInterval();

    makeDropdownDyear();
    makeDropdownDmonth();
    clock = checkTime("month");
    dropdowns.dmonth.selectedIndex = clock;
    makeDropdownDday();
    clock = checkTime("monthday") - 1;
    dropdowns.dday.selectedIndex = clock;

    makeDropdownFmonth();
    makeDropdownFday();

    makeDropdownSstyle();
    makeDropdownSpurpose();
    makeDropdownSday();
    makeDropdownShol();

    dropdowns.sdate = makeSdate();
    makeAllCalendarResults();
}

//Returns the Full Value for Calculated sDate
function makeSdate() {
    let result = [];
    result[result.length] = dropdowns.dmonth.value;
    result[result.length] = dropdowns.dyear.value;
    result[result.length] = dropdowns.fmonth.value;
    result[result.length] = dropdowns.weekday.value;
    result[result.length] = dropdowns.freq.value;
    result[result.length] = dropdowns.interval.value;
    result[result.length] = dropdowns.style.value;
    result[result.length] = dropdowns.dday.value;
    result[result.length] = dropdowns.fday.value;
    result[result.length] = dropdowns.purpose.value;
    if (dropdowns.purpose.value == "Payroll") result[result.length] = dropdowns.sday.value;
    result[result.length] = dropdowns.shol.value;

    return result;
}

//Adds Options to Dropdown Menu Weekday
function makeDropdownWeekday() {
    let drop = dropdowns.weekday;
    let dayz = nameWeekday(-1, false);
    for (let i = 0; i < dayz.length; i++) {
        makeDropdownOption(drop, dayz[i], dayz[i]);
    }
}

//Adds Options to Dropdown Menu Interval
function makeDropdownInterval() {
    let drop = dropdowns.interval;
    let units = ["Week", "Bi-Week", "Month", "Quarter", "Year"];
    for (let i = 0; i < units.length; i++) {
        makeDropdownOption(drop, units[i], units[i]);
    }
}

//Adds Options to Dropdown Menu DYear
function makeDropdownDyear() {
    let drop = dropdowns.dyear;
    let buffer = 10;
    let year = checkTime("year");
    for (let i = year - buffer; i < year + buffer + 1; i++) {
        //makeDropdownOption(drop, "y" + i, i);
        makeDropdownOption(drop, i, i);
    }
    drop.selectedIndex = buffer;
}

//Adds Options to Dropdown Menu DMonth
function makeDropdownDmonth() {
    let drop = dropdowns.dmonth;
    drop.innerHTML = "";
    let units = getMonthDays(-1).length;
    for (let i = 0; i < units; i++) {
        //makeDropdownOption(drop, "m" + i, i + 1);
        makeDropdownOption(drop, i + 1, i + 1);
    }
}

//Adds Options to Dropdown Menu DDay
function makeDropdownDday() {
    let drop = dropdowns.dday;
    drop.innerHTML = "";
    let dayz = getMonthDays(dropdowns.dmonth.selectedIndex);
    for (let i = 0; i < dayz; i++) {
        //makeDropdownOption(drop, "d" + i, i + 1);
        makeDropdownOption(drop, i + 1, i + 1);
    }
}

//Adds Options to Dropdown Menu FMonth
function makeDropdownFmonth() {
    let drop = dropdowns.fmonth;
    drop.innerHTML = "";
    let units = getMonthDays(-1).length;
    for (let i = 0; i < units; i++) {
        //makeDropdownOption(drop, "m" + i, i + 1);
        makeDropdownOption(drop, i, getMonth(i, false));
    }
}

//Adds Options to Dropdown Menu FDay
function makeDropdownFday() {
    let drop = dropdowns.fday;
    drop.innerHTML = "";
    let dayz = getMonthDays(dropdowns.fmonth.selectedIndex);
    for (let i = 0; i < dayz; i++) {
        //makeDropdownOption(drop, "d" + i, i + 1);
        makeDropdownOption(drop, i + 1, i + 1);
    }
}

//Adds Options to Dropdown Menu Sstyle
function makeDropdownSstyle() {
    let drop = dropdowns.style;
    let units = ["Numeric", "Formal"];
    for (let i = 0; i < units.length; i++) {
        makeDropdownOption(drop, units[i], units[i]);
    }
}

//Adds Purpose to Dropdown Menu Spurpose
function makeDropdownSpurpose() {
    let drop = dropdowns.purpose;
    let units = ["Default", "Payroll"];
    for (let i = 0; i < units.length; i++) {
        makeDropdownOption(drop, units[i], units[i]);
    }
}

//Adds Options to Dropdown Menu SDay
function makeDropdownSday() {
    if (dropdowns.purpose.value == "Default") {
        dropdowns.subb.style.display = "none";
        //dropdowns.holb.style["border-right"] = "none";
        document.getElementById("freq").style.display = "inline-block";
        return;
    }

    dropdowns.subb.style.display = "block";
    //dropdowns.holb.style["border-right"] = "1px solid black";
    document.getElementById("freq").style.display = "none";

    let drop = dropdowns.sday;
    drop.innerHTML = "";
    let dayz = nameWeekday(-1, false);
    for (let i = 0; i < dayz.length; i++) {
        makeDropdownOption(drop, dayz[i], dayz[i]);
    }
}

//Adds Holidays to Dropdown Menu Shol
function makeDropdownShol() {
    let drop = dropdowns.shol;
    let units = ["Banking", "All Major", "Ignored"];
    for (let i = 0; i < units.length; i++) {
        makeDropdownOption(drop, units[i], units[i]);
    }
}

//Returns a Color Code for a Result Box (Default)
function getGenResultColor(day) {
    let result = "#D0EEEE";
    if (dropdowns.shol.value == "Hidden") return result;

    return result;
}

//Returns a Color Code for a Result Box (Payroll)
function getResultColor(day, id) {
    if (dropdowns.purpose.value == "Default") {
        return getGenResultColor(day);
    }

    let result = "#D0EEEE";

    switch (id) {
        case 0:
            result = "#dd4040";
            break;
        case 1:
            result = "#dd4040";
            break;
        case 2:
            result = "#dd4040";
            break;
        case 3:
            result = "#dd4040";
            break;
        case 4:
            result = "#dd4040";
            break;
        case 5:
            result = "#dd4040";
            break;
        case 6:
            result = "#dd4040";
            break;
        case 7:
            result = "#dd4040";
            break;
        case 8:
            result = "#dd4040";
            break;
        case 9:
            result = "#dd4040";
            break;
        case 10:
            result = "#dd4040";
            break;
        case 11:
            result = "#dd4040";
            break;
        default:
            break;
    }

    return result;
}

//Clears the Results Elements
function clearCalendarResults() {
    if (dropdowns.results.length < 1) {
        dropdowns.results = [];
        return;
    }
    for (let i = 0; i < dropdowns.results.length; i++) {
        dropdowns.results[i].parentNode.removeChild(dropdowns.results[i]);
    }

    dropdowns.results = [];
}

//Creates an Element for Results (Default)
function makeCalendarResult(result) {
    let winTerms;
    let winValues;
    let winStyling;
    let winDisplay = "";
    let w = 100;
    let h = 25 - 1;
    let c = getGenResultColor(result);
    let p = 5;
    let b = "none";
    let r = 4;
    let m = 10;
    let t = "center";
    let tp = p + 1;
    let f = 18;

    winDisplay = styleCalDate(result, dropdowns.style.value, true, false);

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size"];
    winValues = [w, h, c, p, b, r, m, t, tp, f];

    winStyling = cssMake(winValues, winTerms);

    dropdowns.results[dropdowns.results.length] = createWin(dropdowns.result, "dr" + dropdowns.results.length, "div", winStyling);

    dropdowns.results[dropdowns.results.length - 1].innerText = winDisplay;
}

//Creates an Element for Results (Payroll)
function makePayrollResult(baseline, era) {
    let result = applyHolidays([baseline], false, false)[0];
    let subd = applyHolidays([getPayrollSubDate(baseline, false)], true, false)[0];
    let verifiers = [getPayrollSubDate(baseline, false), baseline];
    let verified = false;
    for (let i = 0; i < holidayList.length; i++) {
        if (datesAreSame(verifiers[0], holidayList[i]) || datesAreSame(verifiers[1], holidayList[i])) {
            verified = true;
            i = holidayList.length;
        }
    }
    let winTerms;
    let winValues;
    let winStyling;
    let winDisplay = "";
    let w = 100;
    let h = (25 * 4) - 3;
    let c = getResultColor(result, era);
    let p = 5;
    let b = "none";
    let r = 4;
    let m = 10;
    let t = "center";
    let tp = p + 3;
    let f = 18;
    if (verified) {
        let bpx = 2;
        if (result.getDate() > 9 && result.getMonth() > 8) {
            bpx = 1;
        }
        b = bpx + "px solid red";
        if (c != "#D0EEEE") b = bpx + "px solid black";
        w -= bpx * 2;
        h -= bpx * 2;
    }

    winDisplay = "" + styleCalDate(result, dropdowns.style.value, true, false) + "\n\nSubmitted:\n" + styleCalDate(subd, dropdowns.style.value, true, false);

    winTerms = ["w", "h", "bg", "pad", "border", "border-radius", "margin", "text-align", "padding-top", "font-size"];
    winValues = [w, h, c, p, b, r, m, t, tp, f];
    winStyling = cssMake(winValues, winTerms);

    dropdowns.results[dropdowns.results.length] = createWin(dropdowns.result, "dr" + dropdowns.results.length, "div", winStyling);

    dropdowns.results[dropdowns.results.length - 1].innerText = winDisplay;
}

//Changes Certain Titles on the Display
function titleCalendar() {
    dropdowns.wti.innerText = "Starting Date";
    if (dropdowns.purpose.value == "Payroll") dropdowns.wti.innerText = "Year's First Payroll Date";

    dropdowns.wdt.innerText = "Weekday";
    if (dropdowns.purpose.value == "Payroll") dropdowns.wdt.innerText = "Pay Period End Day";
}

//Updates Information Based on Selected Details
function updateCalendar() {
    let curDate = makeSdate();
    if (compArrays([dropdowns.sdate, curDate]) == false) {
        let curDaySel = dropdowns.dday.selectedIndex;
        let curDaySel2 = dropdowns.fday.selectedIndex;
        let curDaySel3 = dropdowns.sday.selectedIndex;
        let curDaySel4 = dropdowns.freq.selectedIndex;
        makeDropdownDday();
        makeDropdownFday();
        makeDropdownSday();
        //QOL Starting Date Selection
        if (curDaySel < dropdowns.dday.options.length) {
            dropdowns.dday.selectedIndex = curDaySel;
        } else {
            dropdowns.dday.selectedIndex = 0;
        }
        //QOL Fiscal Start Selection
        if (curDaySel2 < dropdowns.fday.options.length) {
            dropdowns.fday.selectedIndex = curDaySel2;
        } else {
            dropdowns.fday.selectedIndex = 0;
        }
        //QOL Setting Submitted Selection
        if (curDaySel3 < dropdowns.sday.options.length && curDaySel3 >= 0) {
            dropdowns.sday.selectedIndex = curDaySel3;
        } else {
            dropdowns.sday.selectedIndex = 0;
        }
        //QOL Frequency Selection
        if (curDaySel4 < dropdowns.freq.options.length && curDaySel4 >= 0) {
            dropdowns.freq.selectedIndex = curDaySel4;
        } else {
            dropdowns.freq.selectedIndex = 0;
        }
        makeAllCalendarResults();
        dropdowns.sdate = makeSdate();
    }
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
//Calendar Calculation Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Makes Results for Calendar Readout
function makeAllCalendarResults() {
    clearCalendarResults();
    let mustWrap = 35;
    let perRow = 5;
    let defML = 10;
    let calendarUsed = gatherCalendarDates();
    let min = calendarUsed.cur;
    //let gathered = removeEarlyCalendarDates(applyHolidays(calendarUsed.result, false, false), min);
    let gathered = removeEarlyCalendarDates(calendarUsed.result, min);
    let mTrack;
    if (dropdowns.purpose.value == "Payroll") mTrack = checkMonthPayPer(gathered, true);
    titleCalendar();

    if (gathered.length < perRow) {
        let adjMarg = (defML + ((perRow - gathered.length) * 70));
        if (gathered.length == 1) adjMarg -= 10;
        adjMarg = adjMarg + "px";
        dropdowns.result.style["margin-left"] = adjMarg;
    } else {
        dropdowns.result.style["margin-left"] = defML + "px";
    }

    if (gathered.length > mustWrap) {
        dropdowns.result.style["overflow-y"] = "text";
    } else {
        dropdowns.result.style["overflow-y"] = "none";
    }

    for (let i = 0; i < gathered.length; i++) {
        if (dropdowns.purpose.value == "Default") {
            makeCalendarResult(gathered[i]);
        } else {
            makePayrollResult(gathered[i], parseInt(mTrack[getPayrollSubDate(gathered[i], false).getMonth()]));
        }
    }

    if (isNaN(calendarUsed.cur) == false && isNaN(calendarUsed.end) == false) {
        let d1 = styleCalDate(calendarUsed.cur, dropdowns.style.value, false, true);
        let d2 = styleCalDate(calendarUsed.end, dropdowns.style.value, false, true);

        let titleText = d1 + " - " + d2;
        if (dateComesBefore(calendarUsed.end, calendarUsed.cur)) titleText = d2 + " - " + d1;
        dropdowns.rest.innerText = titleText;
    } else {
        dropdowns.rest.innerText = "No Results!";
    }

}

//Removes all Calendar Results Before a Specific Date
function removeEarlyCalendarDates(catalogue, min) {
    let result = [];
    for (let i = 0; i < catalogue.length; i++) {
        if (dateComesAfter(catalogue[i], min) || datesAreSame(catalogue[i], min)) result[result.length] = catalogue[i];
    }

    return result;
}

//Determines the Payroll Date Based on Submitted Date and Weekday
function getPayrollSubDate(endDate, delayWeek) {
    let needed = nameWeekday(dropdowns.sday.value, false);
    let result = -1;
    if (parseInt(endDate.getDay()) == needed) {
        if (delayWeek) {
            result = new Date(endDate.getFullYear(), endDate.getMonth(), parseInt(endDate.getDate()) + 7);
        } else {
            result = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        }
    } else {
        for (let i = 0; i < 7; i++) {
            let temp = new Date(endDate.getFullYear(), endDate.getMonth(), parseInt(endDate.getDate()) - i);
            if (temp.getDay() == needed) result = temp;
        }
    }

    return result;
}

//Accounts for Holidays in Final Tally
function applyHolidays(calendar, forward, avoidWeekends) {
    let years = [];
    for (let i = 0; i < calendar.length; i++) {
        if (doesInclude(years, calendar[i].getFullYear()) == false) years[years.length] = calendar[i].getFullYear();
    }

    makeHolidayList(years);

    for (let i = 0; i < calendar.length; i++) {
        let same = false;
        for (let i2 = 0; i2 < holidayList.length; i2++) {
            if (datesAreSame(calendar[i], holidayList[i2])) {
                same = true;
                i2 = holidayList.length;
            }
        }
        if (same) {
            if (forward) {
                calendar[i] = new Date(calendar[i].getFullYear(), calendar[i].getMonth(), parseInt(calendar[i].getDate()) + 1);
            } else {
                calendar[i] = new Date(calendar[i].getFullYear(), calendar[i].getMonth(), parseInt(calendar[i].getDate()) - 1);
            }
        }
        if (avoidWeekends && isWeekend(calendar[i])) {
            if (forward) {
                if (calendar[i].getDay() == 6) {
                    calendar[i] = new Date(calendar[i].getFullYear(), calendar[i].getMonth(), parseInt(calendar[i].getDate()) + 2);
                } else {
                    calendar[i] = new Date(calendar[i].getFullYear(), calendar[i].getMonth(), parseInt(calendar[i].getDate()) + 1);
                }
            } else {
                if (calendar[i].getDay() == 6) {
                    calendar[i] = new Date(calendar[i].getFullYear(), calendar[i].getMonth(), parseInt(calendar[i].getDate()) - 1);
                } else {
                    calendar[i] = new Date(calendar[i].getFullYear(), calendar[i].getMonth(), parseInt(calendar[i].getDate()) - 2);
                }
            }
        }
    }

    return calendar;
}

//Returns a List of Applied Holidays
function makeHolidayList(years) {
    holidayList = [];
    if (dropdowns.shol.value == "Ignored") return;

    if (typeof years == "number") years = [years];
    for (let i = 0; i < years.length; i++) {
        holidayList = combineArrays(holidayList, makeHolidayDefaults(years[i]));
    }
}

//Returns a List of All Holidays Across One or More Calendar Years
function makeHolidayDefaults(year) {
    let result = [];
    let temp;

    //Banking Holidays
    result[result.length] = new Date(year, 0, 1); //New Year's Day
    result[result.length] = getMonthOccasion(year, 0, 1, 2); //MLK's Birthday
    result[result.length] = getMonthOccasion(year, 1, 1, 2); //Washington's Birthday
    result[result.length] = getMonthOccasion(year, 1, 1, "Last"); //Memorial Day
    result[result.length] = new Date(year, 5, 19); //Juneteenth
    result[result.length] = new Date(year, 6, 4); //Independence Day
    result[result.length] = getMonthOccasion(year, 8, 1, "First"); //Labor Day
    result[result.length] = getMonthOccasion(year, 9, 1, 1); //Columbus Day
    result[result.length] = new Date(year, 10, 11); //Veteran's Day
    result[result.length] = getMonthOccasion(year, 10, 4, 3); //Thanksgiving
    result[result.length] = new Date(year, 11, 25); //Christmas Day

    if (dropdowns.shol.value == "Banking") return result;

    //Other Major Holidays
    temp = result[result.length - 2];
    result[result.length] = new Date(year, temp.getMonth(), parseInt(temp.getDate() + 1)); //Day After Thanksgiving

    result[result.length] = new Date(year, 11, 24); //Christmas Eve
    if (year % 4 == 0) {
        result[result.length] = new Date(year, 0, 20); //Inauguration Day
        if (result[result.length - 1] == 6) result[result.length - 1] = new Date(year, 0, 21);
    }

    temp = getNextDay(findNextLunarPhase("Full", getEquinox(year, "spring"), 2), 0, 1);
    result[result.length] = new Date(year, temp.getMonth(), temp.getDate()); //Easter
    temp = result[result.length - 1];
    result[result.length] = new Date(year, temp.getMonth(), parseInt(temp.getDate()) - 47); //Mardi Gras
    result[result.length] = new Date(year, temp.getMonth(), parseInt(temp.getDate()) - 2); //Good Friday

    result[result.length] = getMonthOccasion(year, 1, 1, 3); //President's Day

    return result;
}

//Returns if a Day is a Weekend
function isWeekend(day) {
    let weekday = day.getDay();
    if (weekday == 6 || weekday == 0) return true;
    return false;
}

//Returns Montsh with Anomalous Numbers of Pay Periods
function checkMonthPayPer(calendar, numeric) {
    let result = [];
    let list = [];

    let normal = 1;
    if (dropdowns.interval.value == "Week") normal = 4;
    if (dropdowns.interval.value == "Bi-Week") normal = 2;

    for (let i = 0; i < calendar.length; i++) {
        list[list.length] = parseInt(getPayrollSubDate(calendar[i], false).getMonth());
    }

    for (let i = 0; i < 12; i++) {
        result[i] = false;
        let tally = timesIncluded(list, i);
        if (tally > normal) result[i] = true;
    }

    if (numeric) {
        for (let i = 0; i < result.length; i++) {
            if (result[i]) {
                result[i] = 0;
            } else {
                result[i] = -1;
            }
        }
    }

    return result;
}

//Returns a String Reading a Date in Style
function styleCalDate(day, style, spaced, parenthesis) {
    if (day == -1) return "? / ? / ?";
    let d = day.getDate();
    let m = parseInt(day.getMonth()) + 1;
    let y = day.getFullYear();

    let spacer = "/";
    if (spaced) spacer = " / ";

    let result = "";
    if (style == "Numeric") result = m + spacer + d + spacer + y;
    if (style == "Formal") result = (getMonth(m - 1, true).toString()) + " " + d + ", " + y;

    if (parenthesis && spaced) result = "( " + result + " )";
    if (parenthesis && spaced == false) result = "(" + result + ")";

    return result;
}

//Returns an Calendar with an Additional Fiscal Year as Needed
function getFullCalendar(catalogue) {
    let calendar = catalogue;
    let fisc = new Date(dropdowns.dyear.value, dropdowns.fmonth.value, dropdowns.fday.value);
    let cur = new Date(dropdowns.dyear.value, parseInt(dropdowns.dmonth.value) - 1, dropdowns.dday.value);
    let cap = new Date(parseInt(dropdowns.dyear.value) + 1, dropdowns.fmonth.value, dropdowns.fday.value);
    let altFisc = false;
    let min;
    let max;
    let supportCalendar;

    let qStart = new Date(dropdowns.dyear.value, dropdowns.fmonth.value, dropdowns.fday.value);
    let qEnd = new Date(dropdowns.dyear.value, parseInt(dropdowns.fmonth.value) + 3, dropdowns.fday.value);

    supportCalendar = catalogueCalendarYear(parseInt(dropdowns.dyear.value) + 1);
    calendar = combineArrays(catalogue, supportCalendar);
    supportCalendar = catalogueCalendarYear(parseInt(dropdowns.dyear.value) - 1);
    calendar = combineArrays(supportCalendar, calendar);

    if (datesAreSame(cur, fisc) == false) {
        if (dateComesBefore(fisc, cur)) {

            fisc = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
            cap = new Date(parseInt(dropdowns.dyear.value) + 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value) - 1);

            min = fisc;
            max = cap;


            qStart = new Date(dropdowns.dyear.value, dropdowns.fmonth.value, dropdowns.fday.value);
            qEnd = new Date(dropdowns.dyear.value, parseInt(dropdowns.fmonth.value) + 3, dropdowns.fday.value);




        } else {

            fisc = new Date(parseInt(dropdowns.dyear.value) - 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
            cap = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value) - 1);

            min = fisc;
            max = cap;

            qStart = new Date(parseInt(dropdowns.dyear.value) - 1, dropdowns.fmonth.value, dropdowns.fday.value);
            qEnd = new Date(parseInt(dropdowns.dyear.value) - 1, parseInt(dropdowns.fmonth.value) + 3, dropdowns.fday.value);

        }
        altFisc = true;
    } else {
        fisc = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, dropdowns.fday.value);
        cap = new Date(parseInt(dropdowns.dyear.value) + 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value) - 1);
        min = fisc;
        max = cap;
    }
    let checkDays = calendar.length;


    let result = {
        "calendar": calendar, "fisc": fisc, "cur": cur, "cap": cap, "altFisc": altFisc, "checkDays": checkDays,
        "qStart": qStart, "qEnd": qEnd, "min": min, "max": max
    };

    return result;
}

//Returns if Two Dates are the Same
function datesAreSame(cur, comp) {
    if (cur.getFullYear() == comp.getFullYear() && cur.getMonth() == comp.getMonth() && cur.getDate() == comp.getDate()) return true;
    return false;
}

//Returns if One Date Falls Before Another
function dateComesBefore(cur, comp) {
    if (datesAreSame(cur, comp)) return false;
    if (cur.getFullYear() < comp.getFullYear()) return true;
    if (cur.getFullYear() > comp.getFullYear()) return false;
    if (cur.getMonth() < comp.getMonth()) return true;
    if (cur.getMonth() > comp.getMonth()) return false;
    if (cur.getDate() < comp.getDate()) return true;
    if (cur.getDate() > comp.getDate()) return false;
    if (cur.getHours() < comp.getHours()) return true;
    if (cur.getHours() > comp.getHours()) return false;
    if (cur.getMinutes() < comp.getMinutes()) return true;
    if (cur.getMinutes() > comp.getMinutes()) return false;
    if (cur.getSeconds() < comp.getSeconds()) return true;
    if (cur.getSeconds() > comp.getSeconds()) return false;

    return false;
}

//Returns if One Date Falls After Another
function dateComesAfter(cur, comp) {
    if (dateComesBefore(cur, comp)) return false;
    //if (datesAreSame(cur, comp)) return false;
    return true;
}

//Returns Instances of Specific Dates
function gatherCalendarDates() {
    let day = nameWeekday(dropdowns.weekday.value, false);
    let interv = dropdowns.interval.value;
    let freq = dropdowns.freq.value;
    let catalogue = getFullCalendar(catalogueCalendarYear(dropdowns.dyear.value));
    let result = relevantCalendarDates(catalogue, day, interv, freq);

    result = {
        "result": result, "start": catalogue.min, "end": new Date(catalogue.cap.getFullYear(), catalogue.cap.getMonth(), parseInt(catalogue.cap.getDate())),
        "cur": catalogue.cur
    };

    return result;
}

//Determines if a Weekday Falls on a Date
function checkDayWeekday(subject, weekday) {
    let day = nameWeekday(subject.getDay(), false);
    if (typeof weekday == "number") weekday = nameWeekday(weekday, false);

    if (day == weekday) return true;
    return false;
}

//Returns a List of Calendar Days Matching Requirements -- Active WIP
function relevantCalendarDates(catalogue, day, interv, freq) {
    let result = [];
    let qs;
    switch (interv) {
        case "Week":
            qs = getCalendarWeeks(catalogue);
            break;
        case "Bi-Week":
            qs = getCalendarBiWeeks(catalogue);
            break;
        case "Month":
            qs = getCalendarMonths(catalogue);
            break;
        case "Quarter":
            qs = getCalendarQuarters(catalogue, false);
            break;
        case "Year":
            qs = getCalendarYears(catalogue, false);
            break;
        default:
            qs = catalogue;
            break;
    }

    for (let i = 0; i < qs.length; i++) {
        let winner = -1;
        for (let i2 = 0; i2 < qs[i].length; i2++) {
            if (freq == "first" || dropdowns.purpose.value == "Payroll") {
                if (checkDayWeekday(qs[i][i2], day)) {
                    result[result.length] = qs[i][i2];
                    i2 = qs[i].length;
                }
            } else {
                if (checkDayWeekday(qs[i][i2], day)) {
                    winner = qs[i][i2];
                }
            }
        }
        if (freq != "first" & winner != -1) result[result.length] = winner;
    }

    return result;
}

//Returns the Numeric Number of the Day in the Year from the Catalogue
function getCalendarDayNumber(catalogue, month, day) {
    for (let i = 0; i < catalogue.length; i++) {
        if (catalogue[i].getMonth() == month && catalogue[i].getDate() == day) {
            return i;
        }
    }

    return -1;
}

//Returns a Catalogue of All a Year's Days
function catalogueCalendarYear(year) {
    if (typeof year == "string") year = parseInt(year);

    //let year = dropdowns.dyear.value;
    let checkDays = 365;
    if (checkLeapYear(year)) checkDays += 1;
    let catalogue = [];
    let needFinalDay = false;

    for (let i = 0; i < checkDays; i++) {
        catalogue[catalogue.length] = new Date(year, 0, i); //year, monthIndex, day, hours, minutes, seconds, milliseconds ~ Wraps if Needed
        if (catalogue[catalogue.length - 1].getFullYear() != year) {
            catalogue.pop();
            needFinalDay = true;
        }
    }

    if (needFinalDay) {
        catalogue[catalogue.length] = new Date(parseInt(year) + 1, 0, 0);
    }

    return catalogue;
}

//Returns a Matching Month Name or Number Based on Input
function getMonth(id, abbreviated) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let abb = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (isNaN(parseInt(id)) == false) {
        id = parseInt(id);
    }

    if (typeof id == "number") {

        if (id < 0 || id >= months.length) {
            if (abbreviated) return abb;
            return months;
        }

        if (abbreviated) return abb[id];
        return months[id];

    } else {
        for (let i = 0; i < months.length; i++) {
            if (abb[i] == id || months[i] == id) {
                return i;
            }
        }
    }

    //Failsafe
    if (abbreviated) return abb;
    return months;

}

//Returns Number of Days in a Month
function getMonthDays(id) {
    if (typeof id != "number") id = getMonth(id, false);
    let dayCounts = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (checkLeapYear(false)) dayCounts[1] += 1;

    if (id < 0 || id >= dayCounts.length) return dayCounts;

    return dayCounts[id];
}

//Determines if a Year is a Leap Year
function checkLeapYear(special) {
    let result = false;
    let year = dropdowns.dyear.value;
    if (year == "") year = checkTime("year"); //Checks the Current Year if No Year is Input
    if (typeof special == "number") {
        if (special > 0) year = special;
    }
    if (typeof year != "number") year = year + 0;

    if (year % 4 == 0) {
        if (year % 100 != 0) {
            result = true;
        } else {
            if (year % 400 == 0) {
                result = true;
            }
        }
    }

    return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Period Calculation Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Returns the Dates of a Year's Quarters
function getCalendarQuarters(catalogue, currentOnly) {
    let quarters = 4;
    let result = [];
    let calendar = catalogue.calendar;
    let cur = catalogue.cur;
    let fisc = catalogue.fisc;
    let cap = catalogue.cap;
    let altFisc = catalogue.altFisc;
    let checkDays = catalogue.checkDays;
    let qStart = catalogue.qStart;
    let qEnd = catalogue.qEnd;
    let checkQuarter = 0;
    let min;
    let max;
    if (dateComesBefore(new Date(dropdowns.dyear.value, fisc.getMonth(), fisc.getDate()), cur)) {
        min = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
        max = new Date(parseInt(dropdowns.dyear.value) + 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
    } else {
        min = new Date(parseInt(dropdowns.dyear.value) - 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
        max = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));

        qStart = new Date(parseInt(dropdowns.dyear.value) - 1, dropdowns.fmonth.value, dropdowns.fday.value);
        qEnd = new Date(parseInt(dropdowns.dyear.value) - 1, parseInt(dropdowns.fmonth.value) + 3, dropdowns.fday.value);

        if (datesAreSame(new Date(dropdowns.dyear.value, fisc.getMonth(), fisc.getDate()), cur)) {
            min = cur;
            max = cap;

            qStart = cur;
            qEnd = new Date(dropdowns.dyear.value, cur.getMonth() + 3, cur.getDate());
        }
    }

    for (let i = 0; i < quarters; i++) {
        result[i] = [];
    }

    for (let i = 0; i < checkDays; i++) {
        if (i == 0) {
        }

        if (datesAreSame(calendar[i], qEnd)) {
            qStart = qEnd;
            qEnd = new Date(qStart.getFullYear(), parseInt(qStart.getMonth()) + 3, qStart.getDate());
            checkQuarter += 1;
        }

        //if (altFisc == false && (dateComesBefore(calendar[i], min) || dateComesAfter(calendar[i], max))) {
        if (dateComesBefore(calendar[i], min) || dateComesAfter(calendar[i], max)) {
        } else {
            if (dateComesAfter(calendar[i], min) && dateComesBefore(calendar[i], max) && checkQuarter < quarters) {
                result[checkQuarter][result[checkQuarter].length] = calendar[i];
            }
        }
    }

    if (currentOnly == false) return result;

    let currentQ = getFiscalQuarter(result);
    if (currentQ < 0 || currentQ >= quarters) return result;
    return result[currentQ];
}

//Returns the Current Quarter for the Fiscal Year
function getFiscalQuarter(quarters) {
    let cur = new Date(dropdowns.dyear.value, dropdowns.dmonth.value, dropdowns.dday.value);
    for (let i = 0; i < quarters.length; i++) {
        for (let i2 = 0; i2 < quarters[i].length; i2++) {
            if (datesAreSame(cur, quarters[i][i2])) return i;
        }
    }
    return -1;
}

//Returns the Dates of a Year's Weeks
function getCalendarWeeks(catalogue) {
    let resetDay = 0;
    let week = 0;
    let result = [];
    let calendar = catalogue.calendar;
    let cur = catalogue.cur;
    let fisc = catalogue.fisc;
    let cap = catalogue.cap;
    let checkDays = catalogue.checkDays;
    let min;
    let max;
    if (dateComesBefore(new Date(dropdowns.dyear.value, fisc.getMonth(), fisc.getDate()), cur)) {
        min = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
        max = new Date(parseInt(dropdowns.dyear.value) + 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
    } else {
        min = new Date(parseInt(dropdowns.dyear.value) - 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
        max = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));

        if (datesAreSame(new Date(dropdowns.dyear.value, fisc.getMonth(), fisc.getDate()), cur)) {
            min = cur;
            max = cap;
        }
    }

    result[week] = [];

    for (let i = 0; i < checkDays; i++) {
        if (dateComesBefore(calendar[i], min) || dateComesAfter(calendar[i], max)) {
        } else {
            if (dateComesAfter(calendar[i], min) && dateComesBefore(calendar[i], max)) {
                if (calendar[i].getDay() == resetDay && result[week].length > 0) {
                    week += 1;
                    result[week] = [];
                }
                result[week][result[week].length] = calendar[i];
            }
        }
    }

    return result;
}

//Returns the Dates of a Year's Bi-Weeks
function getCalendarBiWeeks(catalogue) {
    let qs = getCalendarWeeks(catalogue);
    let result = [];
    for (let i = 0; i < qs.length; i++) {
        if (i % 2 == 0) {
            if (i + 1 < qs.length) {
                result[result.length] = combineArrays(qs[i], qs[i + 1]);
            } else {
                result[result.length] = qs[i];
            }
        }
    }

    return result;
}

//Returns the Dates of a Year's Months
function getCalendarMonths(catalogue) {
    let resetDay = 1;
    let month = 0;
    let result = [];
    let calendar = catalogue.calendar;
    let cur = catalogue.cur;
    let fisc = catalogue.fisc;
    let cap = catalogue.cap;
    let checkDays = catalogue.checkDays;
    let min;
    let max;
    if (dateComesBefore(new Date(dropdowns.dyear.value, fisc.getMonth(), fisc.getDate()), cur)) {
        min = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
        max = new Date(parseInt(dropdowns.dyear.value) + 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
    } else {
        min = new Date(parseInt(dropdowns.dyear.value) - 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
        max = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));

        if (datesAreSame(new Date(dropdowns.dyear.value, fisc.getMonth(), fisc.getDate()), cur)) {
            min = cur;
            max = cap;
        }
    }

    result[month] = [];

    for (let i = 0; i < checkDays; i++) {
        if (dateComesBefore(calendar[i], min) || dateComesAfter(calendar[i], max)) {
        } else {
            if (dateComesAfter(calendar[i], min) && dateComesBefore(calendar[i], max)) {
                if (calendar[i].getDate() == resetDay && result[month].length > 0) {
                    month += 1;
                    result[month] = [];
                }
                result[month][result[month].length] = calendar[i];
            }
        }
    }

    return result;
}

//Returns the Dates of a Year's Years
function getCalendarYears(catalogue) {
    let year = 0;
    let result = [];
    let calendar = catalogue.calendar;
    let cur = catalogue.cur;
    let fisc = catalogue.fisc;
    let cap = catalogue.cap;
    let checkDays = catalogue.checkDays;
    let min;
    let max;
    if (dateComesBefore(new Date(dropdowns.dyear.value, fisc.getMonth(), fisc.getDate()), cur)) {
        min = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
        max = new Date(parseInt(dropdowns.dyear.value) + 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
    } else {
        min = new Date(parseInt(dropdowns.dyear.value) - 1, dropdowns.fmonth.value, parseInt(dropdowns.fday.value));
        max = new Date(parseInt(dropdowns.dyear.value), dropdowns.fmonth.value, parseInt(dropdowns.fday.value));

        if (datesAreSame(new Date(dropdowns.dyear.value, fisc.getMonth(), fisc.getDate()), cur)) {
            min = cur;
            max = cap;
        }
    }
    //let reseters = [1, 0, parseInt(dropdowns.dyear.value)];
    let rs = [1, 0, parseInt(dropdowns.dyear.value)];

    result[year] = [];

    for (let i = 0; i < checkDays; i++) {
        if (dateComesBefore(calendar[i], min) || dateComesAfter(calendar[i], max)) {
        } else {
            if (dateComesAfter(calendar[i], min) && dateComesBefore(calendar[i], max)) {
                let toReset = false;
                if (calendar[i].getDate() == rs[0] && calendar[i].getMonth() == rs[1] && calendar[i].getFullYear() != rs[2]) {
                    toReset = true;
                }

                if (toReset && result[year].length > 0) {
                    year += 1;
                    result[year] = [];
                    rs = [1, 0, rs[2] + 1];
                }
                result[year][result[year].length] = calendar[i];
            }
        }
    }

    return result;
}

//Returns Specific Day(s) in a Month
function getMonthOccasion(year, month, day, num) {
    let tracker = month + 0;
    let tally = 1;
    let collection = [];
    collection[collection.length] = new Date(year, month, tally);
    while (tracker == month) {
        tally += 1;
        let sample = new Date(year, month, tally);
        tracker = sample.getMonth();
        if (tracker == month) {
            collection[collection.length] = new Date(year, month, tally);
        } 
    }

    let result = [];
    for (let i = 0; i < collection.length; i++) {
        if (collection[i].getDay() == day) result[result.length] = collection[i];
    }

    if (typeof num == "number") {
        if (num < 0 || num > 7 || num >= result.length) return result;

        return result[num];
    }

    if (typeof num == "string") {
        if (num == "First" || num == "first") return result[0];
        if (num == "Last" || num == "last") return result[result.length - 1];
        return result;
    }

    return result; //Failsafe
}

//Returns the Next Instance of a Specific Day Past a Date
function getNextDay(day, weekday, skip) {
    if (typeof weekday == "string") weekday = nameWeekday(weekday, false);

    result = -1;
    let tally = 0;
    let cap = 365;
    let skipped = 0;
    while (result == -1) {
        tally += 1;
        let check = new Date(day.getFullYear(), day.getMonth(), parseInt(day.getDate()) + tally);
        if (check.getDay() == weekday) {
            skipped += 1;
            if (skipped >= skip) result = check;
        } else {
            if (tally >= cap) result = day;
        }
    }

    return result;
}

//Returns Details for a Lunar Calendar
function checkLunarCalendar(day) {
    let dir;
    let lunarMonth = 29.530588853;
    let julian = (day.getTime() / 86400000) - (day.getTimezoneOffset() / 1440) + 2440587.5;
    let base = (julian - 2451550.1) / lunarMonth;
    let progress = (base - Math.floor(base));
    if (progress < 0) progress += 1;
    let lunarAge = progress * lunarMonth;
    if (lunarAge <= 14.765) {
        dir = "Waxing";
    } else {
        dir = "Waning";
    }

    let thresholds = [1.84566, 5.53699, 9.22831, 12.91963, 16.61096, 20.30288, 23.99361, 27.68493];
    let titles = ["New", dir + " Crescent", "First Quarter", dir + " Gibbous", "Full", dir + " Gibbous", "Last Quarter", dir + " Crescent"];
    for (let i = 0; i < thresholds.length; i++) {
        if (lunarAge < thresholds[i]) return titles[i];
    }

    return titles[0];
}

//Finds the First Time of a Lunar Phase After a Date
function findNextLunarPhase(phase, day, skip) {
    result = -1;
    let tally = 0;
    let cap = 365;
    let skipped = 0;
    while (result == -1) {
        tally += 1;
        let check = new Date(day.getFullYear(), day.getMonth(), parseInt(day.getDate()) + tally);
        if (checkLunarCalendar(check) == phase) {
            skipped += 1;
            if (skipped >= skip) result = check;
        } else {
            if (tally >= cap) result = day;
        }
    }

    return result;
}

//Returns a Day for an Equinox
function getEquinox(year, type) {
    let day;
    if (type == "spring" || type == "Spring") {
        if (checkLeapYear(year)) {
            day = new Date(year, 2, 19);
        } else {
            day = new Date(year, 2, 20);
        }
    }
    if (type == "summer" || type == "Summer") day = new Date(year, 5, 21);
    if (type == "winter" || type == "Winter") day = new Date(year, 11, 21);
    if (type == "fall" || type == "Fall" || type == "autumn" || type == "Autumn") {
        let c = 23.042;
        if (year < 2000) c = 23.822;
        let temp = year.toString();
        let yr = temp[temp.length - 2] + temp[temp.length - 1];
        let cent = temp[0] + temp[1];
        let lp = 0;
        for (let i = 0; i < 100; i++) {
            let x = i.toString();
            if (i < 10) x = "0" + i.toString();
            x = parseInt(cent.toString() + x);
            if (checkLeapYear(x)) lp += 1;
        }
        let fall = (yr * 0.2422 + c) - (lp/4);
        if (year == 1927) fall += 1;
        day = new Date(year, 8, fall);
    }

    return day;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Simple Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//(De)activate User Input
function activate(state) {
    gameActive = state;
}

//Returns a Random Value Between Specified Values
function rng(min, max) {
    max += 1 - min;
    let result = Math.floor(Math.random() * max);
    result += min;
    return result;
}

//Randomly Returns a Positive or Negative for the Value
function plusMinus(value) {
    let change = rng(0, 1);
    if (change == 0) {
        return value;
    } else {
        return value * -1;
    }
}

//Randomly Returns True or False
function trueFalse() {
    let result = plusMinus(1);
    if (result > 0) {
        return true;
    } else {
        return false;
    }
}

//Determines if Objects' Spaces Overlap
function checkCollision(ax, ay, aw, ah, bx, by, bw, bh) {
    let hits = false;
    if (ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by) {
        hits = true;
    }
    return hits;
}

//Returns if an Array Includes a Value
function doesInclude(batch, value) {
    let result = false;
    for (let i = 0; i < batch.length; i++) {
        if (batch[i] == value) result = true;
    }

    return result;
}

//Returns the Number of Times an Array Includes a Value
function timesIncluded(batch, value) {
    let result = 0;
    for (let i = 0; i < batch.length; i++) {
        if (batch[i] == value) result += 1;
    }

    return result;
}

//Returns a Random Item from a List and the (Potentially) Modified List
function randomFromList(list, doesModifyList) {
    let rand;
    let important = list;
    if (typeof list != "object") return important;

    if (list.length <= 1) {
        rand = 0;
    } else {
        rand = rng(0, list.length - 1);
    }
    important = list[rand];


    if (doesModifyList) {
        for (let i = rand; i < list.length; i++) {
            if (i != list.length - 1) list[i] = list[i + 1];
        }
        list.pop();
    }


    //return result;
    return important;
}

//Returns an Array that Overrides Values from a Point and Removes Last Element
function deleteElement(list, num) {
    if (typeof list != "object") return list;
    if (list.length <= 0) return [];
    for (let i = num; i < list.length; i++) {
        if (i != list.length - 1) list[i] = list[i + 1];
    }
    list.pop();

    return list;
}

//Determines if a Space is on its Artwork's Border
function isOnBorder(id, w, h, yesNoOnly, horzRead) {
    //Left, Right, Top, Bottom
    let result = [false, false, false, false];
    if (horzRead) {
        if (id % h == 0) result[0] = true;
        if ((id + 1) % h == 0) result[1] = true;
        if (id < w) result[2] = true;
        if (id >= (w * (h - 1))) result[3] = true;
    } else {
        if (id < w) result[0] = true;
        if (id >= (w * (h - 1))) result[1] = true;
        if (id % h == 0) result[2] = true;
        if ((id + 1) % h == 0) result[3] = true;
    }

    if (yesNoOnly) {
        for (let i = 0; i < result.length; i++) {
            if (result[i] == true) return true;
        }
        return false;
    }

    return result;
}

//Returns the Column or Row # for a Place on a Grid
function getLineNum(id, w, h, getCol) {
    let result;

    if (getCol) {
        result = Math.floor(id / h);
    } else {
        result = Math.floor(id % w);
    }

    return result;
}

//Returns an Array with Max & Min Values of a Line on a Grid
function getLineEnds(id, w, h, getCol) {
    let result = [];

    if (getCol) {
        result[0] = id * h;
        result[1] = result[0] + (h - 1);
    } else {
        result[0] = id;
        result[1] = ((w * h) - h) + result[0];
    }

    return result;
}

//Sets a Number to the Max or Min in a Range if Outside that Range
function rangeNum(num, min, max) {
    if (num > max) num = max;
    if (num < min) num = min;
    return num;
}

//Increases or Decreases a Number by an Amount Until it is Within a Range
function nudgeNum(num, change, min, max) {
    let result = num;
    if (min > max || max - min < change) {
        if (change == 1 && min == max) {

        } else {
            return result;
        }
    }
    if (num >= min && num <= max) return result;
    if (num > max) result -= change;
    if (num < min) result += change;

    if (result < min || result > max) return nudgeNum(result, change, min, max);
    return result;
}

//Returns if a Compared Set of Arrays is Identical -- Added for Seeker
function compArrays(comped) {
    if (comped.length <= 1) return true;
    for (let i = 1; i < comped.length; i++) {
        if (comped[0].length > comped[i].length) return false;
        for (let i2 = 0; i2 < comped[0].length; i2++) {
            if (comped[i][i2] != comped[0][i2]) return false;
        }
    }

    return true;
}

//Returns Part of the Current Time -- Added for Seeker
function checkTime(unit) {
    let part = unit.toLowerCase();
    let timez = new Date();
    let result = [timez.getSeconds(), timez.getMinutes(), timez.getHours(), timez.getFullYear(), timez.getTime(),
        timez.getDay(), timez.getMonth(), timez.getDate(), nameWeekday(timez.getDay(), false), timez.getTimezoneOffset(), nameTimezone(timez)];

    if (part == "second" || part == "seconds" || part == "s") return result[0];
    if (part == "minute" || part == "minutes" || part == "m") return result[1];
    if (part == "hour" || part == "hours" || part == "h") return result[2];
    if (part == "year" || part == "years" || part == "y") return result[3];
    if (part == "timestamp" || part == "timestamps" || part == "stamp") return result[4];
    if (part == "day" || part == "days" || part == "d") return result[5];
    if (part == "months" || part == "month" || part == "mo") return result[6];
    if (part == "monthday" || part == "md" || part == "monthly") return result[7];
    if (part == "weekday" || part == "wd" || part == "wkd" || part == "nameday" || part == "nmd" || part == "name") return result[8];
    if (part == "timezoneoffset" || part == "offset" || part == "tzo") return result[9];
    if (part == "zone" || part == "timezone" || part == "tz") return result[10];
    if (part == "all") return result;

    return timez;
}

//Returns a Named Weekday from Provided Number or Number from Provided Name -- Added for Seeker
function nameWeekday(day, abbreviated) {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let abrevs = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

    if (typeof day == "string") {
        for (let i = 0; i < days.length; i++) {
            if (days[i] == day || abrevs[i] == day) {
                return i;
            }
        }
        return -1;
    }

    if (day < 0 || day >= days.length) {
        if (abbreviated) return abrevs;
        return days;
    } else {
        if (abbreviated) return abrevs[day];
        return days[day];
    }
}

//Returns a Named Timezone -- Added for Seeker
function nameTimezone(zone) {
    let breakdown = zone.toString();
    breakdown = Array.from(breakdown);
    let result = [];
    let reading = false;
    for (let i = 0; i < breakdown.length; i++) {
        if (reading == false) {
            if (breakdown[i] == "(") reading = true;
        } else {
            if (breakdown[i] == ")") {
                reading = false;
            } else {
                result[result.length] = breakdown[i];
            }
        }
    }

    let final = [];
    for (let i = 0; i < result.length; i++) {
        final = final + result[i];
    }

    return final;
}

//Returns an Array of Characters Converted from a String or String-Like Object -- Added for Seeker
function stringToCharArray(text) {
    let result = text.toString();
    result = Array.from(result);

    return result;
}

//Returns an New Array with Contents of Passed Arrays -- Added for Calendar Marker
function combineArrays(primary, secondary) {
    let result = [];
    for (let i = 0; i < primary.length; i++) {
        result[result.length] = primary[i];
    }
    for (let i = 0; i < secondary.length; i++) {
        result[result.length] = secondary[i];
    }

    return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Grid Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Creates the Initial Objects and Elements for the Game's Grid
function makeGrid() {
    makeGridSize();
    for (let i = 0; i < sizeGrid("r"); i++) {
        for (let i2 = 0; i2 < sizeGrid("c"); i2++) {
            let x = sizeGrid("w") * i;
            let y = sizeGrid("h") * i2;
            let id = (i * sizeGrid("r")) + i2;

            let borders = [false, true, false, true]; //left, right, top, bottom
            if (i == 0) borders[0] = false;
            if (i == sizeGrid("r") - 0) borders[1] = false;
            if (i2 == 0) borders[2] = false;
            if (i2 == sizeGrid("c") - 0) borders[3] = false;

            let newSpace = makeGridSpace(x, y, id, borders);
            grid[id] = newSpace;
        }
    }

    makeGridTerrain(mapTerrain);
}

//Returns Values for Grid Sizes and Spacing
function sizeGrid(value) {
    if (value == "r" || value == "rows") {
        return gridSize[2];
    } else if (value == "c" || value == "columns") {
        return gridSize[3];
    } else if (value == "w" || value == "width") {
        return gridSize[0];
    } else if (value == "h" || value == "height") {
        return gridSize[1];
    } else {
        return 0;
    }

}

//Determines the Dimensions of a Grid Space
function makeGridSize() {
    gridSize[2] = boardHeight / sizeGrid("h");
    gridSize[3] = boardWidth / sizeGrid("w");
    totalTiles = gridSize[2] * gridSize[3];
}

//Makes a Space within the Grid
function makeGridSpace(x, y, id, borders) {
    x -= 0; //For Parsing Problems, return to "x -= 1"
    y -= 0; //For Parsing Problems, return to "y -= 1"
    let finalSpace;
    let winPendingId;
    let winTerms;
    let winValues;
    let winStyling;
    let winLogs = [];
    let defC = "none";
    let actC = changeGridColors("default");
    let op = gridOpacity();
    //let bd = "1px solid rgba(145,165,145,0.45)";
    let bd = "1px solid rgba(115,135,115,0.95)";
    let bb = ["brl", "brdr", "brt", "brb"];
    let bs = [bd, bd, bd, bd];
    if (borders[0] == false) bs[0] = "none"; //Left
    if (borders[1] == false) bs[1] = "none"; //Right
    if (borders[2] == false) bs[2] = "none"; //Top
    if (borders[3] == false) bs[3] = "none"; //Bottom
    let brr = ["brr", 0];
    let spbr = 5;
    if (id == 0) brr = ["brtl", spbr]; //Top-Left
    if (id == sizeGrid("r") - 1) brr = ["brbl", spbr]; //Bottom-Left
    if (id == (sizeGrid("r") - 1) * sizeGrid("c")) brr = ["brtr", spbr]; //Top-Right
    if (id == ((sizeGrid("r") - 1) * sizeGrid("c")) + (sizeGrid("c") - 1)) brr = ["brbr", spbr]; //Bottom-Right
    let smd = 0;
    let smd2 = 0;
    if (id >= (sizeGrid("c") * sizeGrid("r")) - sizeGrid("r")) smd = 2;
    if ((id + 1) % sizeGrid("c") == 0 && id != 1) smd2 = 2;

    //Clickable Div
    winPendingId = "GridSpace-D" + id;
    winTerms = ["pos", "br", "brr", "z", "w", "h", "user", "fs", "bg", "txt", "marl", "mart"];
    winValues = ["absolute", "none", 0, 4, sizeGrid("w") - smd, sizeGrid("h") - smd2, "none", 18, "none", "center", x, y];
    winStyling = cssMake(winValues, winTerms);
    winLogs[0] = logWin(overlay, winPendingId, "div", winStyling, [defC, defC], false, true, false, false);

    //Modified Values for Spacing
    let pvals = [];
    pvals[0] = propMin(getParentInfo(winLogs[0].win, "marl")) + 1;
    pvals[1] = propMin(getParentInfo(winLogs[0].win, "mart")) + 1;
    pvals[2] = sizeGrid("w") - 1 - (smd / 2);
    pvals[3] = sizeGrid("h") - 1 - (smd2 / 2);

    //Outlined Canvas
    winPendingId = "GridSpace-CA" + id;
    winTerms = ["pos", "bg", "w", "h", "marl", "mart", "z", "op", brr[0], bb[0], bb[1], bb[2], bb[3]];
    winStyling = cssMake(winValues, winTerms);
    winValues = ["absolute", "none", pvals[2], pvals[3], pvals[0], pvals[1], 1, op, brr[1], bs[0], bs[1], bs[2], bs[3]];
    winStyling = cssMake(winValues, winTerms);
    winLogs[1] = logWin(overlay, winPendingId, "canvas", winStyling, actC, false, false, false, false);

    finalSpace = {"id": id, "win": winLogs[0], "back": winLogs[1], "role": "none", "focused": false};

    return finalSpace;
}

//Determines if a Grid is Occupied
function checkGridOccupied(id) {
    if (typeof id == "string") id = getGridSpace(id, false);
    if (id.role == "none") return false;
    return true;
}

//Gets the ID for the GridSpace
function getGridSpaceId(id, numOnly) {
    if (typeof id == "number" && id < grid.length && numOnly == false) return grid[id];
    if (typeof id == "number" && id < grid.length && numOnly) return id;
    if (typeof id == "object") id = (id.id).toString();
    if (id.toString().includes("GridSpace-")) id = id.toString().replace("GridSpace-", "");
    if (id.toString().includes("D")) id = id.toString().replace("D", "");
    if (id.toString().includes("CA")) id = id.toString().replace("CA", "");
    if (id.toString().includes("CB")) id = id.toString().replace("CB", "");

    for (let i = 0; i < grid.length; i++) {
        if (id == grid[i].id || id == grid[i].win.win.id || id == grid[i].back.win.id) {
            if (numOnly) {
                return i;
            } else {
                return grid[i];
            }
        }
    }

    return "none";
}

//Returns the Default Selection Opacity for a Grid Space
function gridOpacity() {
    return 0.25;
}

//Returns the Selection Animation Cycle Details for the Selected Grid Space
function focusGridTile(id) {
    if (id != -1) {
        let box = grid[id].back.win;
        let incr = 0.002;
        let duration = fps * 2;
        let pivot = (duration / 2) + 0.5;
        let aStage = globalAnimationCycle % duration;
        let result = gridOpacity();

        if (aStage > pivot) {
            result = result + (incr * pivot) - (incr * (aStage - pivot));
        } else {
            result += (incr) * (aStage);

        }
        styleWin(box, result, "opacity");
    }
}

//Changes the Grid Selection
function changeGridSelection(id) {
    let space = getGridSpaceId(id, true);
    let tile = getGridSpaceId(id, false);
    let colors;
    let box;

    if (selected != -1) {
        box = grid[selected].back.win;
        colors = checkWinLog(box.id, false).colors;
        styleWin(box, colors[1], "background");
        //styleWin(box, gridOpacity(), "opacity");
        grid[selected].focused = false;
    }

    if (selected != space) {
        box = getGridSpaceId(id, false).back.win;
        colors = checkWinLog(box.id, false).colors;
        styleWin(box, colors[0], "background");
        selected = space;
        tile.focused = true;
    } else {
        selected = -1;
    }
        
}

//Returns a Set of Colors for a Grid's Status
function changeGridColors(status) {
    let result = ["lightyellow", "none"]; //Default

    return result;
}

//Resets the Colors of All Grid Spaces
function resetGridColors() {
    for (let i = 0; i < totalTiles; i++) {
        let tile = grid[i];
        tile.colors = changeGridColors("default");
    }
}

//Gets a Centered Point for the Grid Space, Optionally Including Parent Object
function centerGridSpace(space, size, includePrimary) {
    let spot = grid[space].win.win;
    let x = (propMin(spot.style[cssAbb("marl")]) + (propMin(spot.style[cssAbb("w")]) / 2)) - Math.floor(size / 2);
    let y = (propMin(spot.style[cssAbb("mart")]) + (propMin(spot.style[cssAbb("h")]) / 2)) - Math.floor(size / 2);

    if (includePrimary == false) {
        x -= propMin(spot.style[cssAbb("marl")]);
        y -= propMin(spot.style[cssAbb("mart")]);
    }

    return [x, y];
}

//Returns the Distance Between Grid Spaces with Non-Diagonal Movement
function getDist(a, b) {
    if (typeof a == "object") a = a.id;
    if (typeof b == "object") b = b.id;
    let r = sizeGrid("r");
    let c = sizeGrid("c");
    let as = [Math.floor(a / c), a % r];
    let bs = [Math.floor(b / c), b % r];

    let result = Math.abs(as[0] - bs[0]) + Math.abs(as[1] - bs[1]);
    if (a == b) result = 0;

    //Special for Blocked Spaces -- Enable if Needed
    //if (result != 0) result = blockSpaceDistCheck(result, a, b, r, c, as, bs);

    return result;
} 

//Returns Whether or Not a Space is on the Grid's Edge
function isOnGridEdge(id) {
    if (id < sizeGrid("c")) return true;
    if (id > grid.length - sizeGrid("c")) return true;
    if (id % sizeGrid("r") == 0) return true;
    if ((id + 1) % sizeGrid("r") == 0) return true;
    return false;
}

//Returns Which Grid Edges a Space Touches
function getGridEdges(id) {
    //Left, Right, Top, Bottom
    let touches = [false, false, false, false];
    if (isOnGridEdge(id) != true) return touches;

    if (id < sizeGrid("c")) touches[0] = true;
    if (id > grid.length - sizeGrid("c")) touches[1] = true;
    if (id % sizeGrid("r") == 0) touches[2] = true;
    if ((id + 1) % sizeGrid("r") == 0) touches[3] = true;

    return touches;
}

//Returns if the Grid Space Touches a Corner
function getGridCorner(id) {
    //None, Top-Left, Bottom-Left, Top-Right, Bottom-Right
    let corner = 0;
    let edges = getGridEdges(id);
    if (edges[0] && edges[2]) corner = 1;
    if (edges[0] && edges[3]) corner = 2;
    if (edges[1] && edges[2]) corner = 3;
    if (edges[1] && edges[3]) corner = 4;

    return corner;
}

//Gets Neighboring Spaces on a Grid (Left, Right, Top, Bottom)
function getGridNeighbors(id, w, h, max) {
    let result = [-1, -1, -1, -1];
    let edges = isOnBorder(id, w, h, false, false);

    let tally = 0; //Left
    if (edges[tally] == false) {
        result[tally] = id - w;
    }
    tally += 1; //Right
    if (edges[tally] == false) {
        result[tally] = id + w;
    }
    tally += 1; //Top
    if (edges[tally] == false) {
        result[tally] = id - 1;
    }
    tally += 1; //Bottom
    if (edges[tally] == false) {
        result[tally] = id + 1;
    }

    for (let i = 0; i < result.length; i++) {
        if (result[i] > max) result[i] = -1;
        if (result[i] < 0) result[i] = -1;
    }

    return result;
}

//Returns an Array of Surrounding Spaces on the Grid
function getGridSurrounding(id, distance, includeDiagonal, includeOrigin) {
    let max = grid.length - 1;
    let w = sizeGrid("c");
    let h = sizeGrid("r");
    let result = [];

    for (let i = 1; i <= distance; i++) {
        if (doesInclude(result, id - (w * i) == false)) result[result.length] = id - (w * i);
        if (doesInclude(result, id + (w * i) == false)) result[result.length] = id + (w * i);
        if (doesInclude(result, id - i == false)) result[result.length] = id - i;
        if (doesInclude(result, id + i == false)) result[result.length] = id + i;
        if (includeDiagonal) {
            let xs = [];
            let ys = [];
            xs[0] = nudgeNum(getLineNum(id, w, h, true) - 2, 1, 0, w - 1);
            xs[1] = nudgeNum(getLineNum(id, w, h, true) + 2, 1, 0, w - 1);
            ys[0] = nudgeNum(getLineNum(id, w, h, false) - 2, 1, 0, h - 1);
            ys[1] = nudgeNum(getLineNum(id, w, h, false) + 2, 1, 0, h - 1);
            let min = 0;
            let maxi = grid.length;

            for (let i2 = min; i2 < maxi; i2++) {
                let x = getLineNum(i2, w, h, true);
                let y = getLineNum(i2, w, h, false);
                if (x <= xs[1] && x >= xs[0]) {
                    if (y <= ys[1] && y >= ys[0]) {
                        if (doesInclude(result, i2) == false) {
                            result[result.length] = i2;
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < result.length; i++) {
        if (result[i] > max || result[i] < 0 || (includeOrigin == false && result[i] == id)) {
            result[i] = result[result.length - 1];
            result.pop();
            i -= 1;
        }
    }

    result.sort((a, b) => a - b);

    return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Terrain Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Creates Terrain Types for the Grid
function makeGridTerrain(region) {
    let dim = [sizeGrid("w"), sizeGrid("h")];
    let spaces = grid.length;

    for (let i = 0; i < spaces; i++) {
        grid[i].role = randomTerrain(true);
    }

    drawAllGridTerrain(region);
}

//Draws All Grid Terrains
function drawAllGridTerrain(region) {
    region.clearRect(0, 0, boardWidth, boardHeight);
    let dim = [sizeGrid("w"), sizeGrid("h")];
    let spaces = grid.length;

    for (let i = 0; i < spaces; i++) {
        let x = Math.floor(i / sizeGrid("c")) * dim[0];
        let y = (i % sizeGrid("r")) * dim[1];
        drawTerrain(region, i, grid[i].role, x, y, dim[0], dim[1]);
    }
}

//Draws Terrain in an Area
function drawTerrain(region, id, ter, x, y, w, h) {
    if (typeof ter == "number") ter = tType(ter);
    let colors = tColors(ter);
    let neighbors = getGridNeighbors(id, sizeGrid("c"), sizeGrid("r"), grid.length - 1);
    let borUsed = [0, 2];
    let artSpread = [];

    for (let i = 0; i < h; i++) {
        artSpread[i] = [];
        for (let i2 = 0; i2 < w; i2++) {
            let i3 = (i * h) + i2;
            artSpread[i][i2] = colors[0];
            if (isOnBorder(i3, w, h, true, true)) {
                let bordered = isOnBorder(i3, w, h, false, true);
                for (let i4 = 0; i4 < borUsed.length; i4++) {
                    if (sameNeighborTerrain(id, neighbors[borUsed[i4]]) == false && bordered[borUsed[i4]]) {
                        artSpread[i][i2] = colors[1];
                    }
                }
            }
        }
    }
    let art = makeDrawing(artSpread, false);
    drawSprite(region, art, x, y, 1);
}

//Checks if a Neighbor is the Same Terrain Type
function sameNeighborTerrain(a, b) {
    if (typeof a == "object") a = a.id;
    if (typeof b == "object") b = b.id;
    if (a > grid.length || b > grid.length) return true;
    if (a < 0 || b < 0) return true;
    if (grid[a].role == grid[b].role) return true;
    return false;
}

//Gets a List of Colors for a Terrain Type
function tColors(id) {
    //Format -- Area, Border, Special
    let terrains = tType(-1);
    if (typeof id == "number") id = tType(id);
    let result = ["", "", ""];

    if (id == terrains[0]) result = ["tan", "brown", "navajowhite"];
    if (id == terrains[1]) result = ["skyblue", "darkblue", "blue"];
    if (id == terrains[2]) result = ["", "", ""];

    return result;
}

//Returns a Specific Terrain Type or List of Terrain Types
function tType(id) {
    let terrains = ["ground", "water"];
    if (id < 0 || id > terrains.length) return terrains;
    return terrains[id];
}

//Returns a Random Terrain Type
function randomTerrain(useName) {
    let terrains = tType(-1);
    let rand = rng(0, terrains.length - 1);
    if (useName) return terrains[rand];
    return rand;
}


//------------------------------------------------------------------------------------------------------------------------------------------------------
//Player Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Applied Results for Clicking a Designated Window
function clickResults(id, box, wind) {

    //General Grid Selection
    if (getGridSpaceId(id, true) != "none") {
        changeGridSelection(id);
    }
}

//Changes the Weather
function presser(e) {
    if (e.code == "Space" && weather.length > 0) {
        let storm = weather[weather.length - 1].id;
        if (storm == "heavy rain") commonWeather("light rain");
        if (storm == "light rain") commonWeather("light snow");
        if (storm == "light snow") commonWeather("heavy snow");
        if (storm == "heavy snow") commonWeather("heavy rain");
        for (let i = 0; i < weather.length - 1; i++) {
            destroyWeather(i, false);
        }

    }


    if (e.code == "Enter") {
        for (let i = 0; i < pathfinder.length; i++) {
            if (pathfinder[i].walkable.length > 1) {
                pathfinder[i].walkable = [];
                pathfinder[i] = addWalkable(pathfinder[i], grid[pathfinder[i].space].role);
            } else {
                pathfinder[i].walkable = [];
                let terrainz = tType(-1);
                for (let i2 = 0; i2 < terrainz.length; i2++) {
                    pathfinder[i] = addWalkable(pathfinder[i], terrainz[i2]);
                }
            }
            pathfinder[i] = turnPather(pathfinder[i]);
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Pathing Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Returns the Values of a Common Pathing Type -- Added for Seeker
function patherPathingType(id) {
    let types = ["walking", "swimming", "flying"];
    if (id < 0) return types;
    let paths = [];
    paths[paths.length] = [0];
    paths[paths.length] = [1];
    paths[paths.length] = [0, 1];

    for (let i = 0; i < paths.length; i++) {
        for (let i2 = 0; i2 < paths[i].length; i2++) {
            paths[i][i2] = tType(paths[i][i2]);
        }
    }

    for (let i = 0; i < types.length; i++) {
        if (id == i || id == types[i]) {
            return paths[i];
        }
    }

    return -1;
}

//Determines a Pather's Common Pathing Type -- Added for Seeker
function checkPatherCommonType(pather) {
    let types = patherPathingType(-1);
    for (let i = 0; i < types.length; i++) {
        if (compArrays([pather.walkable, patherPathingType(i)])) {
            return types[i];
        }
    }

    return -1;
}

//Returns a Pather with Walkable Terrain from a Specified Pattern -- Added for Seeker
function patherCommonWalkable(pather, type) {
    let walks = {"walkable": []};
    switch (type) {
        case "walking":
            walks = addWalkable(walks, 0);
            break;
        case "swimming":
            walks = addWalkable(walks, 1);
            break;
        case "flying":
            let allTs = tType(-1);
            for (let i = 0; i < allTs.length; i++) {
                walks = addWalkable(walks, i);
            }
            break;
        default:
            walks.walkable = pather.walkable;
            break;
    }
    pather.walkable = walks.walkable;
    pather = turnPather(pather);
    return pather;
}

//Returns an Array of Colors for the Pather -- Modified for Seeker
function patherColors(walks) {
    let tWalk = { "walkable": walks };
    let types = patherPathingType(-1);
    let actual = checkPatherCommonType(tWalk);

    if (actual == types[0]) return ["none", "#ffffff", "#000000", "#992222", "#303030"];
    if (actual == types[1]) return ["none", "#004466", "#006699", "#ffaaaa", "#0000ff"];
    if (actual == types[2]) return ["none", "#000055", "#444455", "#ffffcc", "#aa6600"];

    return ["none", "#ffffff", "#000000", "#992222", "#303030"];
}

//Console Prints the Distances to All Other Spaces
function consoleLogAllDistances(origin, current) {
    let distances = [];
    console.log("Entering Space #" + current);
    console.log("Distances from Space #" + origin + ":");
    for (let i = 0; i < grid.length; i++) {
        if (i != origin) {
            distances[i] = getDist(i, origin);
            //let txt = i + " => " + origin + ": " + distances[i] + " blocks";
            //console.log(txt);
        }
    }

    let pool = [];

    for (let i2 = 0; i2 < grid.length; i2++) {
        if (i2 == current + 10) pool[pool.length] = i2;
        if (i2 == current + 1) pool[pool.length] = i2;
        if (i2 == current - 10) pool[pool.length] = i2;
        if (i2 == current - 1) pool[pool.length] = i2;
    }

    for (let i2 = 0; i2 < pool.length; i2++) {
        let i = pool[i2];
        let txt = i + " => " + distances[i] + " blocks";
        if (grid[i].role == "blocked") txt = i + " => BLOCKED";
        console.log(txt);
    }

    /*for (let i4 = 0; i4 < pool.length; i4++) {
        let i = pool[i4];
        if (i != origin && grid[i].role != "blocked") {
            let shortest = true;
            let longest = true;

            for (let i2 = 0; i2 < pool.length; i2++) {
                let i3 = pool[i2];
                if (i3 != i && i3 != origin) {
                    if (distances[i] < distances[i3]) longest = false;
                    if (distances[i] > distances[i3]) shortest = false;
                }
            }
            if (shortest) console.log("Shortest = #" + i + " @ " + distances[i] + " blocks");
            if (longest) console.log("Longest = #" + i + " @ " + distances[i] + " blocks");
        }
    }

    for (let i = 0; i < grid.length; i++) {
        if (grid[i].role == "blocked") distances[i] = "BLOCK";
    }

    console.log(distances);*/

    console.log("-----");
}

//Causes Pathfinder(s) to Walk to Goal(s)
function applyPathfinder() {

    for (let i = 0; i < pathfinder.length; i++) {
        pathfinder[i] = changePathGoal(pathfinder[i], selected);
        learnPath(pathfinder[i]);
    }

}

//Creates a Test Character for Pathfinding
function makePathfinder() {
    let anSize = 22;
    let anPix = 2;
    let defaultSpeed = 2;
    let spaced = [rng(0, sizeGrid("c") - 1), rng(0, sizeGrid("r") - 1)];
    let space = drawSpot(spaced[0], spaced[1], sizeGrid("r"));
    //let spot = grid[space].win.win;
    let xy = centerGridSpace(space, anSize * anPix, true);
    let id = pathfinder.length;

    removeAnimation("pathfinder");
    let anim = makeAnimation(animationBird(patherColors([tType(0)]), -1), -1, xy[0], xy[1], context, anPix, "pather" + pathfinder.length, 60);
    let recent = [];

    pathfinder[pathfinder.length] = {
        "id": id, "space": space, "loc": xy, "art": anim, "size": anSize * anPix, "speed": defaultSpeed, "recent": recent, "goal": -1,
        "dir": 0, "oob": [], "walkable": []
    };

    pathfinder[pathfinder.length - 1] = addWalkable(pathfinder[pathfinder.length - 1], grid[pathfinder[pathfinder.length - 1].space].role);
    pathfinder[pathfinder.length - 1].art.art = getPatherAnimation(pathfinder[pathfinder.length - 1]);

    let minimumMoves = getGridSurrounding(pathfinder[pathfinder.length - 1].space, 2, true, false);
    for (let i = 0; i < minimumMoves.length; i++) {
        grid[minimumMoves[i]].role = grid[pathfinder[pathfinder.length - 1].space].role;
    }
    drawAllGridTerrain(mapTerrain);

    /*pathfinder[pathfinder.length - 1] = addWalkable(pathfinder[pathfinder.length - 1], 0);
    pathfinder[pathfinder.length - 1] = addWalkable(pathfinder[pathfinder.length - 1], 1);
    pathfinder[pathfinder.length - 1] = removeWalkable(pathfinder[pathfinder.length - 1], 1);*/
}

//Returns a List of Spaces with a Specific Role
function getSpaceRoles(roleName) {
    let result = [];
    for (let i = 0; i < grid.length; i++) {
        if (grid[i].role == roleName) result[result.length] = i;
    }

    return result;
}

//Returns the Current Space Based on Provided Coordinates
function checkCurrentSpace(x, y) {
    let r = sizeGrid("r");
    let c = sizeGrid("c");

    let loc = [-1, -1];

    for (let i = 0; i < c; i++) {
        if (x <= (i + 1) * sizeGrid("w") && loc[0] == -1) loc[0] = i;
    }

    for (let i = 0; i < r; i++) {
        if (y <= (i + 1) * sizeGrid("h") && loc[1] == -1) loc[1] = i;
    }

    return drawSpot(loc[0], loc[1], sizeGrid("r"));
}

//Begins Walking Towards the Goal
function learnPath(pather) {
    //Initial Checks and Orientation
    let goal = pather.goal;
    if (goal < 0) return;
    let scope = [pather.loc[0], pather.loc[1]];
    let longDest = centerGridSpace(goal, pather.size, true);
    if (goal < pather.space) {
        for (let i = 0; i < scope.length; i++) {
            scope[i] += pather.size;
            longDest[i] += pather.size;
        }
    }
    pather.space = checkCurrentSpace(scope[0], scope[1]);
    if (doesInclude(pather.recent, pather.space) == false) pather.recent[pather.recent.length] = pather.space;
    if (pather.loc[0] == longDest[0] && pather.loc[1] == longDest[1]) return;
    if (canPath(goal, [pather.space], [pather.space], goal, pather.recent, pather.walkable) != true) return;

    let shortDest = startPathing(pather, true);
    if (shortDest < 0) return;
    if (pather.space == goal) shortDest = goal;
    let dest = centerGridSpace(shortDest, pather.size, true);
    let cur = pather.loc;
    let x = dest[0] - cur[0];
    let y = dest[1] - cur[1];

    if (Math.abs(x) > pather.speed) {
        if (x > 0) {
            x = pather.speed;
        } else {
            x = -1 * pather.speed;
        }
    }
    if (Math.abs(y) > pather.speed) {
        if (y > 0) {
            y = pather.speed;
        } else {
            y = -1 * pather.speed;
        }
    }

    pather.loc = [pather.loc[0] + x, pather.loc[1] + y];
    pather.art.x = pather.loc[0];
    pather.art.y = pather.loc[1];
    pather.dir = patherFacing(pather.space, shortDest, pather.dir);
    pather = turnPather(pather);
}

//Returns a List of Available Options for Travel
function assignSpaceOption(current) {
    let options = [];

    if (current >= sizeGrid("r")) options[options.length] = current - sizeGrid("c");
    if (current < (sizeGrid("r") * sizeGrid("c")) - sizeGrid("r")) options[options.length] = current + sizeGrid("c");
    if (current != 0 && current % sizeGrid("r") != 0) options[options.length] = current - 1;
    if ((current + 1) % sizeGrid("r") != 0) options[options.length] = current + 1;

    return options;
}

//Returns a List of Pathable Spaces
function assignSpaceAvailable(options, journey) {
    let available = [];
    let goal = journey.goal;
    let traveled = [];
    let denied = [];
    let bonusDenied = [];

    for (let i = 0; i < options.length; i++) {
        available[i] = canPath(options[i], traveled, denied, goal, bonusDenied, journey.walkable);
    }

    return available;
}

//Returns a Score for a Location Based on Distance from Start and Goal
function scoreSpace(space, goal, priorMoves) {
    let f = getDist(space, goal) + priorMoves;

    return f;
}

//Creates an Object Reflecting a Pathing Space's Characteristics
function makePathNode(prior, id) {
    let moves;
    if (prior == "none") {
        moves = 0;
    } else {
        moves = prior.moves + 1;
    }

    let node = { "prior": prior, "id": id, "moves": moves };

    return node;
}

//Returns Whether a Space is Already Assessed
function isNodeIncluded(id, nodes) {
    let checks = [];

    for (let i = 0; i < nodes.length; i++) {
        checks[i] = nodes[i].id;
    }

    return doesInclude(checks, id);
}

//Returns the Shortest Path from Available Nodes
function getShortestPath(nodes, excluded, goal) {
    let threshold = grid.length;
    let winner = -1;

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].moves < threshold && isNodeIncluded(nodes[i].id, excluded) == false) {
            threshold = scoreSpace(nodes[i], goal, countPriorMoves(nodes[i]));
            winner = i;
        }
    }

    if (winner != -1) return nodes[winner];
    return -1;
}

//Determines the Number of Prior Moves for a Space
function countPriorMoves(node, tally) {
    if (node.prior != "none") {
        tally += 1;
        tally = countPriorMoves(node.prior, tally);
    }

    return tally;

}

//Creates a List of Nodes from Valid Options
function makeLocalNodes(options, available, prior) {
    let nodes = [];

    for (let i = 0; i < options.length; i++) {
        if (available[i]) {
            nodes[nodes.length] = makePathNode(prior, options[i]);
        }
    }

    return nodes;
}

//Adds a Set of Nodes to the Journey and Returns the Journey
function addJourneyNodes(journey, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        if (isNodeIncluded(nodes[i].id, journey.nodes) == false) {
            journey.nodes[journey.nodes.length] = nodes[i];
        }
    }

    return journey;
}

//Returns a List of All Nodes Excluded from the Journey -- Mostly for Testing Purposes
function verifyNodes(journey) {
    let nodez = [];
    let excluded = [];
    for (let i = 0; i < journey.nodes; i++) {
        nodez[nodez.length] = journey.nodes[i].id;
    }

    for (let i = 0; i < grid.length; i++) {
        if (doesInclude(nodez, i) == false) excluded[excluded.length] = i;
    }

    if (excluded.length > 0) return excluded;
    return -1;
}

//Attempts to Move from a Space and Return a Path
function scoutNode(current, journey) {
    if (current == null) return -1;
    if (current.id == null) return -1;
    let result;
    let options = assignSpaceOption(current.id);
    let available = assignSpaceAvailable(options, journey);

    if (isDeadEnd(available)) return -1;

    let nodes = makeLocalNodes(options, available, current);
    journey = addJourneyNodes(journey, nodes);

    let breakCycle = false;

    while (breakCycle == false) {
        let short = getShortestPath(journey.nodes, journey.excluded, journey.goal);

        if (short.id == journey.goal) {
            result = short;
            breakCycle = true;
        } else {
            if (short != -1) journey.excluded[journey.excluded.length] = short;

            //let ceaseThreshold = available.length - 1;
            let ceaseThreshold = 10;
            let cease = false;
            if (remainingPaths(journey)) {
                journey.blocked = 0;
            } else {
                if (journey.blocked >= ceaseThreshold) {
                    cease = true;
                } else {
                    journey.blocked += 1;
                }
            }

            if (cease == false) {
                result = scoutNode(short, journey);
            } else {
                result = -1;
                breakCycle = true;
            }
        }
    }

    //Failsafe
    return result;
}

//Returns Number of Available Paths for Scouting After Excluded Removal
function remainingPaths(journey) {
    let remaining = journey.nodes.length - journey.excluded.length;
    if (remaining > 0) return true;
    return false;
}

//Returns an Array Reflecting the Walked Path
function formPath(path, node) {
    path[path.length] = node.id;

    if (node.prior != "none") {
        return formPath(path, node.prior);
    }

    //path[path.length] = goal;

    return path.reverse();
}

//Establishes an A* Algorithm Variant to Return Part of Whole of Available Path
function startPathing(pather, nextOnly) {
    let path = -1;
    let current = pather.space;

    if (checkOutOfBounds(pather)) return path;
    if (isUnreachable(pather.goal, pather)) return path;

    if (isUnreachable(pather.goal, pather) != true) {
        let node = makePathNode("none", current);
        let journey = { "nodes": [node], "goal": pather.goal, "excluded": [], "blocked": 0, "walkable": pather.walkable };
        let dest = scoutNode(node, journey);
        if (typeof dest == "object") path = formPath([], dest);
    }


    //Final
    if (typeof path == "number") {
        if (checkOutOfBounds(pather) == false) pather = addOutOfBounds(pather.goal, pather);
        if (path < 0) return path;
        if (isNaN(path)) return -1;
    }
    if (typeof path != "object") return -1;
    if (nextOnly) return path[1];
    return path;
}

//Determines if a Location is a Dead-End
function isDeadEnd(options) {
    let result = true;

    for (let i = 0; i < options.length; i++) {
        if (options[i] == true) result = false;
    }

    return result;
}

//Determines if a Course is Traversible
function canPath(id, traveled, denied, goal, bonusDenied, walkable) {
    if (isNaN(id)) return false;
    if (id < 0) return false;
    if (id >= grid.length) return false;

    walkable = { "walkable": walkable };
    let result = true;

    for (let i = 0; i < traveled.length; i++) {
        if (traveled[i] == id) result = false;
    }

    for (let i = 0; i < denied.length; i++) {
        if (denied[i] == id) result = false;
    }

    for (let i = 0; i < bonusDenied.length; i++) {
        if (bonusDenied[i] == id) result = false;
    }

    if (grid[id].role == "blocked") result = false;

    if (grid[id].role != "blocked" && id == goal) result = true;

    if (checkWalkable(walkable, grid[id].role) == false) result = false;

    return result;
}

//Determines if a Terrain Type is Walkable
function checkWalkable(pather, ter) {
    if (ter == "object") ter = ter.role;
    let result = doesInclude(pather.walkable, ter);
    return result;
}

//Adds a Walkable Terrain and Returns a Pathfinder
function addWalkable(pather, ter) {
    if (typeof ter == "number") ter = tType(ter);
    pather.walkable[pather.walkable.length] = ter;
    return pather;
}

//Removes a Walkable Terrain and Returns a Pathfinder
function removeWalkable(pather, ter) {
    if (typeof ter == "number") ter = tType(ter);
    if (pather.walkable.length <= 0) return pather;

    for (let i = 0; i < pather.walkable.length; i++) {
        if (pather.walkable[i] == ter) {
            pather.walkable = deleteElement(pather.walkable, i);
            i -= 1;
        }
    }

    return pather;
}

//Determines if an Optional Space is the Goal
function optionalPathGoal(options, goal) {
    let result = -1;
    for (let i = 0; i < options.length; i++) {
        if (options[i] == goal) result = options[i];
    }

    if (result > -1) options = [result];
    return options;
}

//Identifies Extra Walking Distance Based on Blocked Spaces
function blockSpaceDistCheck(total, a, b, r, c, as, bs) {
    let greater;
    let lesser;
    let result = total + 0;
    let gBlocks = getSpaceRoles("blocked");

    if (as[0] == bs[0]) {
        greater = a;
        lesser = b;
        if (bs[1] > as[1]) {
            greater = b;
            lesser = a;
        }
        for (let i = lesser; i < greater; i += r) {
            if (doesInclude(gBlocks, i)) result += 2;
        }
    }

    if (as[1] == bs[1]) {
        greater = a;
        lesser = b;
        if (bs[0] > as[0]) {
            greater = b;
            lesser = a;
        }
        for (let i = lesser; i < greater; i += c) {
            if (doesInclude(gBlocks, i)) result += 2;
        }
    }

    return result;
}

//Assigns a Space to be Blocked
function makePathBlock(id) {
    let iconSize = 15;
    let iconScale = 3;
    let art = blockPathImage(["none", "red", "black"], -1);
    let xy = centerGridSpace(id, iconSize * iconScale, true);
    makeAnimation(art, -1, xy[0], xy[1], context, iconSize, "block-" + id, 55);
    grid[id].role = "blocked";
}

//Adjusts the Goal for a Pather, returning the pather
function changePathGoal(pather, newGoal) {
    if (pather.goal != newGoal) {
        pather.goal = newGoal;
        pather.recent = [];
        pather.oob = [];
    }

    //Final
    return pather;
}

//Returns the Facing Direction of the Pathfinder
function patherFacing(current, goal, base) {
    //0 Down, 1 Right, 2 Up, 3 Left
    if (goal < 0 || goal > grid.length || current == goal) return base;
    //let r = sizeGrid("r");
    let c = sizeGrid("c");

    if (current % c == goal % c) {
        if (current > goal) return 1;
        return 3;
    }
    if (current > goal) return 2;
    return 0;
}

//Alters the Pathfinder's Animation
function turnPather(pather) {
    let anim = getPatherAnimation(pather);
    pather.art.art = anim;
    if (pather.dir > 0) {
        for (let i = 0; i < pather.dir; i++) {
            pather.art = rotateAnim(pather.art);
        }
    }

    return pather;
}

//Returns the Animation for the Pather Based on Walkable Terrain Types -- Modified for Seeker
function getPatherAnimation(pather) {
    let result;
    let types = patherPathingType(-1);
    let actual = checkPatherCommonType(pather);

    if (actual == types[0]) result = animationBug(patherColors(pather.walkable), -1);
    if (actual == types[1]) result = animationFish(patherColors(pather.walkable), -1);
    if (actual == types[2]) result = animationBird(patherColors(pather.walkable), -1);

    return result;
}

//Checks if a Space is Unreachable
function isUnreachable(space, pather) {
    let options = assignSpaceOption(space);
    let available = assignSpaceAvailable(options, pather);

    if (isDeadEnd(available)) return true;
    if (checkWalkable(pather, grid[space].role) == false) return true;
    return false;

}

//Adds to the Out of Bounds List
function addOutOfBounds(space, pather) {
    if (typeof space == "object") space = space.id;
    pather.oob[pather.oob.length] = space;
    //outOfBounds[outOfBounds.length] = space;
    return pather;
}

//Checks if a Space Id is Out of Bounds
function checkOutOfBounds(pather) {
    let space = pather.goal;
    let outOfBounds = pather.oob;
    if (outOfBounds.length <= 0) return false;
    if (typeof space == "object") space = space.id;
    if (doesInclude(outOfBounds, space)) return true;
    return false;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Weather Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Displays All Weather Effects
function displayAllWeather() {
    for (let i = 0; i < weather.length; i++) {
        weather[i] = displayWeather(weather[i]);
        if (weather[i].ends == true && weather[i].drops.length <= 0) {
            destroyWeather(i, false);
            i -= 1;
        }
    }
}

//Displays a Weather Effect
function displayWeather(storm) {
    let weatherZone = context;
    let dropPix = 1;

    //Draw Droplets
    for (let i = 0; i < storm.drops.length; i++) {
        storm.drops[i].y += storm.speed;
        if (storm.drops[i].y >= boardHeight) {
            storm.drops[i] = storm.drops[storm.drops.length - 1];
            storm.drops.pop();
            i -= 1;
        } else {
            let dropart = [];
            for (let i2 = 0; i2 < storm.drops[i].size; i2++) {
                dropart[i2] = [];
                for (let i3 = 0; i3 < storm.drops[i].size; i3++) {
                    dropart[i2][i3] = "none";
                    if (i3 <= storm.size[0]) dropart[i2][i3] = storm.color;
                }
            }
            let droplet = makeDrawing(dropart, true);
            drawSprite(weatherZone, droplet, storm.drops[i].x, storm.drops[i].y, dropPix);
        }
    }

    //Make Droplets
    if (globalAnimationCycle % storm.freq == 0 && storm.ends == false) {
        storm.drops = createWeatherDrops(storm.drops, storm.batch, storm.size, storm.prox);
    }

    return storm;
}

//Options for Typical Weather Types
function commonWeather(storm) {

    if (storm == "light rain" || storm == "rain") {
        createWeather(storm, boardWidth / 28, 30, boardWidth / 56, "#8080ee", 2, [1, 7], boardWidth / 14);
    }

    if (storm == "heavy rain") {
        createWeather(storm, boardWidth / 7, 5, boardWidth / 14, "#5050aa", 3, [1, 5], boardWidth / 7);
    }

    if (storm == "light snow" || storm == "snow") {
        createWeather(storm, boardWidth / 28, 30, boardWidth / 56, "#cceeff", 1, [1, 2], boardWidth / 14);
    }

    if (storm == "heavy snow") {
        createWeather(storm, boardWidth / 7, 10, boardWidth / 14, "#cceeff", 1, [1, 2], boardWidth / 5);
    }
}

//Creates a Weather Effect
function createWeather(name, start, freq, batch, color, speed, size, prox) {
    let drops = [];
    drops = createWeatherDrops(drops, start, size, prox);
    let storm = { "id": name, "start": start, "freq": freq, "batch": batch, "color": color, "speed": speed, "size": size, "drops": drops, "prox": prox, "ends": false };

    //Final
    weather[weather.length] = storm;
}

//Creates Opening Weather Drops
function createWeatherDrops(drops, num, size, prox) {
    if (typeof size == "number") size = [size, size];
    let y = 0;
    let spacing = 0;
    for (let i = 0; i < num; i++) {
        let scale = rng(size[0], size[1]);
        spacing += rng(size[1], boardWidth - prox);
        if (spacing >= boardWidth - size[1]) {
            spacing -= boardWidth;
            y += size[1];
        }
        drops[drops.length] = { "x": spacing, "y": y, "size": scale };
    }

    return drops;
}

//Destroys a Weather Effect
function destroyWeather(storm, isGradual) {
    if (typeof storm == "number") {
        if (isGradual) {
            weather[storm].ends = true;
        } else {
            weather[storm] = weather[weather.length - 1];
            weather.pop();
        }
    } else if (typeof storm == "string") {
        for (let i = 0; i < weather.length; i++) {
            if (weather[i].id == storm) {
                if (isGradual) {
                    weather[i].ends = true;
                } else {
                    weather[i] = weather[weather.length - 1];
                    weather.pop();
                    i -= 1;
                }
            }
        }
    }
}

//Returns if a Specific Weather Type Exists -- Added for Seeker
function checkWeather(type, ignoreEnds) {
    if (weather.length <= 0) return result;

    for (let i = 0; i < weather.length; i++) {
        if (weather[i].id == type) {
            if (ignoreEnds) {
                if (weather[i].ends == false) return true;
            } else {
                return true;
            }
        }
    }

    return false;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Update Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

function update() {
    updateCalendar();
    makeEvents();
    makeRepeats();
    animationUpdate();
    gridFocusUpdate();
    displayAllWeather();

    //Pathfinding
    //if (selected != -1) learnPath(pathfinder);
    applyPathfinder();

    //Testing
    if (globalAnimationCycle % 1 == 0) {
        testFrameOne();
    }

    //Final
    requestAnimationFrame(update);
}

//Clears and Animates
function animationUpdate() {
    globalAnimationCycle += 1;

    if (animatedZones.length > 0) {
        for (let i = 0; i < animatedZones.length; i++) {
            if (animatedZones[i] != undefined) {
                animatedZones[i].clearRect(0, 0, boardWidth, boardHeight);
            } else {
                console.log("undefined animation zone");
                animatedZones[i] = animatedZones[animatedZones.length - 1];
                animatedZones.pop();
                i -= 1;
            }
        }
    }

    if (animationsList.length > 0) {
        for (let i = 0; i < animationsList.length; i++) {
            drawAnimation(animationsList[i]);
        }
    }

    if (moverList.length > 0) {
        for (let i = 0; i < moverList.length; i++) {
            moveMover(moverList[i]);
        }
    }

    updateCleanup();
}

//Cleans Up Spent Animations
function updateCleanup() {
    if (animationsList.length > 0) {
        for (let i = 0; i < animationsList.length; i++) {
            if (animationsList[i].looping == 0) {
                removeAnimation(animationsList[i]);
                /*if (animationsList.length <= 1) {
                    animationsList = [];
                } else {
                }*/
            }
        }
    }

    if (moverList.length > 0) {
        for (let i = 0; i < moverList.length; i++) {
            if (moverList[i].current >= moverList[i].frames) {
                removeMover(moverList[i]);
                /*if (moverList.length <= 1) {
                    moverList = [];
                } else {
                }*/
            }
        }
    }

    //if (moverList.length < 1) moverList = [];
    //if (animationsList.length < 1) animationsList = [];
}

//Shows Focused Tiles
function gridFocusUpdate() {
    for (let i = 0; i < totalTiles; i++) {
        let tile = grid[i];
        if (tile.focused == true) {
            focusGridTile(i);
        } else {
            tile.back.win.style[cssAbb("op")] = gridOpacity();
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Primary Window Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Deletes a Specified Document Element
function clearWin(win, killHelper) {
    let box;
    let log;
    let logNum;
    let support;

    if (typeof win == "string") {
        box = document.getElementById(win);
        log = checkWinLog(win, false);
        logNum = checkWinLog(win, true);
    } else if (typeof win == "object") {
        box = document.getElementById(win.id);
        log = checkWinLog(document.getElementById(win.id), false);
        logNum = checkWinLog(box, true);
    }

    if (log.title != undefined && log.title != false) {
        support = document.getElementById(log.title);
        support.parentNode.removeChild(support);
    }
    if (log.helper != undefined && log.helper != false && killHelper == true) {
        support = document.getElementById(log.helper);
        support.parentNode.removeChild(support);
    }

    if (box.nodeName.toLowerCase() == "canvas" || log.canvas != false) {
        let checked;
        if (box.nodeName.toLowerCase() != "div") {
            checked = box.getContext("2d");
        } else {
            checked = log.canvas.getContext("2d");
        }

        for (let i = 0; i < animatedZones.length; i++) {
            if (animatedZones[i] == checked) {
                animatedZones[i] = animatedZones[animatedZones.length - 1];
                animatedZones.pop();
                i -= 1;
            }
        }
    }

    box.parentNode.removeChild(box);
    winds[logNum] = winds[winds.length - 1];
    winds.pop();
}

//Modifies an Existing Window's CSS Style
function styleWin(win, styling, part) {
    win.style[part] = styling;
}

//Creates and Returns a New Window
function createWin(parent, id, type, styling) {
    let newWindow = parent.appendChild(document.createElement(type));
    newWindow.id = id;
    styleWin(newWindow, styling, "cssText");
    return newWindow;
}

//Determines if px Should be Added After a Number
function addPX(checked, topic) {
    let result = "; ";
    let attempt = isNaN(parseInt(checked));
    if (attempt != true && isException(checked, topic) == false) {
        result = "px" + result;
    }
    return result;
}

//Determines if an Exception Should be Made to Adding px After a Number
function isException(checked, topic) {
    if (checked.toString().includes("px")) return true;
    if (cssAbb(topic) == "z-index") return true;
    if (cssAbb(topic).includes("opacity")) return true;
    return false;
}

//Deduces Abbreviations for Common CSS Terms
function cssAbb(term) {
    if (term == "br") return "border";
    if (term == "brr") return "border-radius";
    if (term == "brt") return "border-top";
    if (term == "brb") return "border-bottom";
    if (term == "brl") return "border-left";
    if (term == "brdr") return "border-right";
    if (term == "brtl") return "border-top-left-radius";
    if (term == "brtr") return "border-top-right-radius";
    if (term == "brbl") return "border-bottom-left-radius";
    if (term == "brbr") return "border-bottom-right-radius";
    if (term == "z") return "z-index";
    if (term == "t") return "top";
    if (term == "l") return "left";
    if (term == "w") return "width";
    if (term == "h") return "height";
    if (term == "c") return "color";
    if (term == "txt") return "text-align";
    if (term == "user") return "user-select";
    if (term == "fs") return "font-size";
    if (term == "pos") return "position";
    if (term == "mar") return "margin";
    if (term == "mart") return "margin-top";
    if (term == "marl") return "margin-left";
    if (term == "pad") return "padding";
    if (term == "padl") return "padding-left";
    if (term == "padt") return "padding-top";
    if (term == "bg") return "background";
    if (term == "op") return "opacity";
    return term;
}

//Creates a Component of CSS Text
function cssCombine(value, term) {
    let result = cssAbb(term) + ": " + value + addPX(value, term);
    return result;
}

//Uses Arrays to Form CSS Text
function cssMake(values, terms) {
    let result = "";
    let cycles = terms.length;
    if (values.length > terms.length) cycles = values.length;

    for (let i = 0; i < cycles; i++) {
        result += cssCombine(values[i], terms[i]);
    }
    return result.toString();
}

//Adds a New Window with Specified Properties to the Global List
function logWin(parent, id, type, styling, colors, hoverable, clickable, centered, canvased) {
    let winNum = winds.length;
    let newWin = createWin(parent, id, type, styling);
    if (colors != "none") styleWin(newWin, colors[1], "background-color");
    let newCanvas = false;

    //Specialized Properties
    if (hoverable) {
        newWin.addEventListener("mouseover", highlight);
        newWin.addEventListener("mouseout", unhighlight);
    }

    if (clickable) {
        newWin.addEventListener("click", clicked);
    }

    if (centered) {
        let area = [getParentInfo(parent,"w"), getParentInfo(parent,"h")];
        styleWin(newWin, centerWin(newWin.style.width, newWin.style.height, area[0], area[1])[0], "margin-left");
        styleWin(newWin, centerWin(newWin.style.width, newWin.style.height, area[0], area[1])[1], "margin-top");
    }

    if (canvased) {
        let cstyle = [];
        cstyle[0] = ["pos", "br", "bg", "w", "h", "l", "t"];
        cstyle[1] = ["absolute", "none", "none", getParentInfo(newWin, "w"), getParentInfo(newWin, "h"), 0, 0];
        let cstyling = cssMake(cstyle[1], cstyle[0]);
        newCanvas = createWin(newWin, id + "-canvas", "canvas", cstyling);
    }

    //Final
    winds[winNum] = {
        "win": newWin, "id": id, "colors": colors, "hover": hoverable, "title": false, "helper": false, "buttons": false,
        "canvas": newCanvas, "info": ""
    };
    return winds[winNum];
}

//Determines Which Window's Log is Present
function checkWinLog(id, numOnly) {
    for (let i = 0; i < winds.length; i++) {
        if (typeof id == "object") {
            if (winds[i].win == id) {
                if (numOnly == false) {
                    return winds[i]; //Returns the entire object
                } else {
                    return i; //Returns only the object's ID#
                }
            }
        } else {
            if (winds[i].id == id) {
                if (numOnly == false) {
                    return winds[i]; //Returns the entire object
                } else {
                    return i; //Returns only the object's ID#
                }
            }
        }
    }

    return false;
}

//Creates Companion Windows for a Primary Window
function makeSupportWin(id, type, text) {
    let winNum = checkWinLog(id, true);
    let parent = winds[winNum].win;
    let parentLog = winds[winNum];
    let winPendingId;
    let winTerms;
    let winValues;
    let winStyling;
    let base = parent;
    let newColors = ["lightgray", "darkgray"];
    let details = [false, false, false, false];
    let newW;
    let newH;

    //Detail Support Window
    if (type == "helper") {
        base = overlay;
        winPendingId = parent.id + "-helper";
        newColors = parentLog.colors;
        newW = getParentInfo(parent, "w");
        newH = getParentInfo(parent, "h");
        winTerms = ["pos", "br", "brr", "z", "w", "h", "user", "fs", "bg", "txt", "marl", "mart"];
        winValues = ["absolute", "1px solid black", 3, 5, newW, newH, "none", 18, newColors[1],
            "center", getParentInfo(parent, "marl"), getParentInfo(parent, "mart")];
    } else if (type == "title") {
        base = overlay;
        winPendingId = parent.id + "-title";
        //newColors = parentLog.colors;
        newColors = ["#171717", "#171717"];
        newW = getParentInfo(parent, "w");
        newH = 38;
        winTerms = ["pos", "br", "brr", "z", "w", "h", "user", "fs", "bg", "txt", "marl", "mart", "opacity", "color", "padt"];
        winValues = ["absolute", "1px solid black", getParentInfo(parent, "brr"), 5, newW, newH, "none", 28, "black",
            "center", getParentInfo(parent, "marl"), getParentInfo(parent, "mart"), 0.95, "white", 2];
    } else {
        details = [true, true, true, false];
        if (winds[winNum].buttons == false) {
            winPendingId = parent.id + "-button" + 0;
        } else {
            winPendingId = parent.id + "-button" + winds[winNum].buttons.length;
        }
        newW = 100;
        newH = 28;
        winTerms = ["pos", "br", "brr", "z", "w", "h", "user", "fs", "bg", "txt", "l", "t", "opacity"];
        winValues = ["absolute", "1px solid #505050", 1, 6, newW, newH, "none", 24, newColors[1],
            "center", 0, 0, 0.9];
    }

    //Create Support Window
    winStyling = cssMake(winValues, winTerms);
    let supportLog = logWin(base, winPendingId, "div", winStyling, newColors, details[0], details[1], details[2], details[3]);
    let supportWin = supportLog.win;
    let modStyle = supportWin.style;
    let supportId = supportWin.id;

    //Update Support Window Logs
    if (type == "helper") {
        winds[winNum].helper = supportId;

        let modMarl = (propMin(modStyle[cssAbb("marl")]) - propMin(modStyle[cssAbb("w")]) * 1.1) + "px";
        styleWin(supportWin, modMarl, cssAbb("marl"));
    } else if (type == "title") {
        winds[winNum].title = supportId;
        supportWin.innerText = text;

        let modMart = (propMin(modStyle[cssAbb("mart")]) - (propMin(modStyle[cssAbb("h")]) + propMin(modStyle[cssAbb("padt")]))) + "px";
        styleWin(supportWin, modMart, cssAbb("mart"));
        styleWin(parent, "0px", cssAbb("brtl"));
        styleWin(parent, "0px", cssAbb("brtr"));
        styleWin(supportWin, "0px", cssAbb("brbl"));
        styleWin(supportWin, "0px", cssAbb("brbr"));
        styleWin(supportWin, parent.style["border"], "border");
        styleWin(parent, "none", cssAbb("border-top"));
        styleWin(supportWin, "none", cssAbb("border-bottom"));
    } else {
        supportWin.innerText = text;
        let lower = propMin(getParentInfo(parent, "h")) - (10 + newH);

        if (winds[winNum].buttons == false) {
            winds[winNum].buttons = [];
            winds[winNum].buttons[0] = supportId;
            styleWin(document.getElementById(winds[winNum].buttons[0]), lower + "px", cssAbb("mart"));
        } else {
            winds[winNum].buttons[winds[winNum].buttons.length] = supportId;

            let spaces = getSpacing(propMin(getParentInfo(parent, "w")), false, newW, winds[winNum].buttons.length);
            for (let i = 0; i < winds[winNum].buttons.length; i++) {
                let buttonWin = document.getElementById(winds[winNum].buttons[i]);
                styleWin(buttonWin, spaces[i] + "px", cssAbb("marl"));
                styleWin(buttonWin, lower + "px", cssAbb("mart"));
                checkWinLog(buttonWin.id, false).info = buttonWin.innerText + "!"; //Placeholder Default Info
                checkWinLog(buttonWin.id, false).helper = parentLog.helper;
            }
        }

    }
}

//Removes Stray Info from Window Properties
function propMin(value) {
    let result = value.replace("px", "");
    result = parseFloat(result);
    return result;
}

//Returns Coordinates for Centering a Window within a Space
function centerWin(winW, winH, areaW, areaH) {
    winW = parseInt(winW);
    winH = parseInt(winH);
    areaW = parseInt(areaW);
    areaH = parseInt(areaH);
    let result = [(areaW / 2 - winW / 2).toString() + "px", (areaH / 2 - winH / 2).toString() + "px"];
    return result;
}

//Gets Valid Information from Parent Window
function getParentInfo(parent, term) {
    term = cssAbb(term);
    let result = parent[term];
    if (result == undefined) {
        result = parent.style[term];
    }
    return result;
}

//Generates an Array of Spacing Based on Given Data
function getSpacing(area, buffer, object, count) {
    let result = [];
    let space;

    if (buffer == false) {
        space = area / (object * count);
        buffer = (area % (object * count)) / (count + 1);
    } else {
        space = (area - (buffer * (count + 1))) / (object * count);
    }

    for (let i = 0; i < count; i++) {
        result[i] = ((space + object) * i) + (buffer * (i+1));
    }
    return result;
}

//Window Interactions for Hovering and Clicking
function highlight() {
    if (gameActive == false) return;
    let box = document.getElementById(this.id);
    let wind = checkWinLog(this.id, false);

    //Change Color
    let colors = checkWinLog(this.id, false).colors;
    styleWin(box, colors[0], "background-color");

    //Update Help Text
    if (wind.helper != false) {
        document.getElementById(wind.helper).innerText = wind.info;
    }
}

function unhighlight() {
    if (gameActive == false) return;
    let box = document.getElementById(this.id);
    let wind = checkWinLog(this.id, false);

    //Change Color
    let colors = checkWinLog(this.id, false).colors;
    styleWin(box, colors[1], "background-color");

    //Update Help Text
    if (wind.helper != false) {
        document.getElementById(wind.helper).innerText = "";
    }
}

function clicked() {
    if (gameActive == false) return;
    let box = document.getElementById(this.id);
    let wind = checkWinLog(this.id, true);

    clickResults(this.id, box, wind);
}

function mouseMoved(e) {
    let primaryArea = board;

    let rect = e.target.getBoundingClientRect();
    let evt = primaryArea.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = e.pageX - evt.left;
    y = e.pageY - evt.top;

    mouseSpot = [x, y];
}

//Returns a Window Scaling Ratio for Uniform Boxes
function getRatio(value, isX) {
    let ratio = boardWidth / boardHeight;
    let result = value * ratio;
    if (isX) {
        return result;
    } else {
        return value;
    }
}

//Returns Centered Animation Coordinates
function centerAnim(target, anim, parent, x, y, alt) {
    let ar = getAnimRatio(anim, false);
    let ps = [propMin(parent.style.width), propMin(parent.style.height)];
    let result = centerWin(ar[0], ar[1], ps[0], ps[1]);
    let part = "mar";
    if (alt) part = "";
    let suffix;

    if (x) {
        suffix = part + "l";
        styleWin(target, result[0], cssAbb(suffix));
    }
    if (y) {
        suffix = part + "t";
        styleWin(target, result[1], cssAbb(suffix));
    }

    return result;
}

//Returns Orientation Based on Animation Scale
function getAnimRatio(anim, px) {
    let tilesX = anim.art[0].width - 1;
    let tilesY = anim.art[0].height - 1;

    let stillCheck = true;
    for (let i = 0; i < anim.art[0].width; i++) {
        if (checkBlank(i, anim.art[0], false) && stillCheck) {
            tilesX -= 1;
        } else {
            stillCheck = false;
        }
    }
    stillCheck = true;
    for (let i = anim.art[0].width - 1; i >= 0; i -= 1) {
        if (checkBlank(i, anim.art[0], false) && stillCheck) {
            tilesX -= 1;
        } else {
            stillCheck = false;
        }
    }

    stillCheck = true;
    for (let i = 0; i < anim.art[0].height; i++) {
        if (checkBlank(i, anim.art[0], true) && stillCheck) {
            tilesY -= 1;
        } else {
            stillCheck = false;
        }
    }
    stillCheck = true;
    for (let i = anim.art[0].height - 1; i >= 0; i -= 1) {
        if (checkBlank(i, anim.art[0], true) && stillCheck) {
            tilesX -= 1;
        } else {
            stillCheck = false;
        }
    }

    let x = tilesX * anim.localPixes;
    let y = tilesY * anim.localPixes;
    if (px) {
        x = x.toString() + "px";
        y = y.toString() + "px";
    }
    let results = [x, y];

    return results;
}

//Destroys Buttons Associated with a Window Log
function destroyButtons(log) {
    if (log.buttons != false) {
        if (log.buttons.length > 0) {
            for (let i = 0; i < log.buttons.length; i++) {
                let box = document.getElementById(log.buttons[i]);
                clearWin(box.id, false);
            }
            log.buttons = false;
        }
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Animation Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Draws an Image on a Canvas Using Color Blocks
function drawSprite(region, draws, artX, artY, localPixes) {
    if (localPixes == false) localPixes = pixes;
    let width = draws.width;
    let height = draws.height;
    let art = draws.art;

    for (let i = 0; i < height; i++) {
        for (let i2 = 0; i2 < width; i2++) {
            let i3 = (i2 * width) + i;
            if (art[i3] != 0 && art[i3] != "none") {
                region.fillStyle = art[i3];
                let x = artX + (i * localPixes);
                let y = artY + (i2 * localPixes);
                region.fillRect(x, y, localPixes, localPixes);
            }
        }
    }
}

//Returns an Ojbect to be Drawn
function makeDrawing(drawn, equalized) {
    let result = { "art": false, "width": drawn[0].length, "height": drawn.length, "original": drawn };
    result.art = drawnArray(drawn, result.width, result.height);
    if (equalized) result = equalizeDrawing(result);
    return result;
}

//Returns an Animated Series of Objects
function makeAnimation(drawings, looping, x, y, region, localPixes, id, frequency) {
    let result = {
        "art": drawings, "cycles": drawings.length, "looping": looping, "x": x, "y": y, "region": region, "localPixes": localPixes, "id": id, "frequency": frequency,
        "current": -1, "special": "none"
    };
    addAnimation(result);
    return result;
}

//Draws an Animation
function drawAnimation(animation) {
    if (globalAnimationCycle % animation.frequency == 0) animation.current += 1;
    if (animation.current <= -1) animation.current = 0;

    if (animation.looping > 0 || animation.looping == -1) {
        if (animation.current >= animation.cycles) {
            if (animation.looping != -1) animation.looping -= 1;
            animation.current -= animation.cycles;
        }

        if (animation.looping != 0) {
            drawSprite(animation.region, animation.art[animation.current], animation.x, animation.y, animation.localPixes);
        }
    }
}

//Returns an Array Converting an Image from Drawn Spots
function drawnArray(drawn, width, height) {
    let result = [];
    for (let i = 0; i < height; i++) {
        for (let i2 = 0; i2 < width; i2++) {
            result[drawSpot(i, i2, height)] = drawn[i][i2];
        }
    }
    return result;
}

//Returns Index # for a Drawning Location
function drawSpot(x, y, height) {
    return (x * height) + y;
}

//Returns if a Row or Column is Blank in a Drawing
function checkBlank(id, drawn, isRow) {
    let art = drawn.original;
    let result = true;
    let checks = art.length;
    if (isRow) {
        checks = art[id].length;
    }

    for (let i = 0; i < checks; i++) {
        let checked = art[i][id];
        if (isRow) checked = art[id][i];
        if (checked != "none") result = false;
    }

    return result;
}

//Returns if an Element is Already Moving
function checkMover(elem) {
    let result = false;

    for (let i = 0; i < moverList.length; i++) {
        if (moverList[i].elem.id == elem) {
            result = true;
        }
    }

    return result;
}

//Makes an Element Mobile
function makeMover(elem, frames, distX, distY, frequency, alt) {
    let mx = distX / frames;
    let my = distY / frames;
    let result = { "elem": elem, "frames": frames, "distX": mx, "distY": my, "frequency": frequency, "alt": alt, "current": 0 };
    addMover(result);
    return result;
}

//Moves a Mobile Element -- Edited for Animations
function moveMover(moved) {
    if (globalAnimationCycle % moved.frequency == 0 && moved.current < moved.frames) {
        let mover = moved.elem;
        let propX = cssAbb("marl");
        let propY = cssAbb("mart");
        if (moved.alt == true) {
            propX = cssAbb("l");
            propY = cssAbb("t");
        }
        let newX = propMin(mover.style[propX]) + moved.distX;
        let newY = propMin(mover.style[propY]) + moved.distY;
        newX += addPX(newX, propX);
        newY += addPX(newY, propY);
        newX = newX.replace(";", "");
        newY = newY.replace(";", "");

        moved.current += 1;
        if (moved.current <= -1) moved.current = 0;
        styleWin(mover, newX, propX);
        styleWin(mover, newY, propY);

        //Moves Titles for Windows with Them
        let moveLog = checkWinLog(mover.id, false);
        if (moveLog != false) {
            if (moveLog.title != false) {
                let moveTitle = document.getElementById(moveLog.title);
                propX = cssAbb("marl");
                propY = cssAbb("mart");
                if (moved.alt == true) {
                    propX = cssAbb("l");
                    propY = cssAbb("t");
                }
                newX = propMin(moveTitle.style[propX]) + moved.distX;
                newY = propMin(moveTitle.style[propY]) + moved.distY;
                newX += addPX(newX, propX);
                newY += addPX(newY, propY);
                newX = newX.replace(";", "");
                newY = newY.replace(";", "");
                styleWin(moveTitle, newX, propX);
                styleWin(moveTitle, newY, propY);
            }
        }
    }
}

//Returns an Altered Sprite Based on Input
function alterArt(drawn, type, full) {
    let template = drawn.original;
    let height = drawn.height;
    let width = drawn.width;
    let scope = template.length - 1;
    let result = [];
    let w = width - 1;
    let h = height - 1;

    for (let i = 0; i < height; i++) {
        result[i] = [];
        for (let i2 = 0; i2 < width; i2++) {
            let x = i;
            let y = i2;

            if (type == "rotate") {
                x = scope - i2;
                y = i;
            } else if (type == "flip") {
                let base = (i + 1) * w;
                let counter = (i * w) + i2;

                y = base - counter;
                x = i;
            }
            
            result[i][i2] = template[x][y];
        }
    }

    if (full) {
        result = makeDrawing(result, true);
    }

    return result;
}

//Returns Sprite Art Rotated by 90 Degrees
function rotateArt(drawn) {
    return alterArt(drawn, "rotate", true);
}

//Returns Sprite Art Flipped Across Y-Axis
function flipArt(drawn) {
    return alterArt(drawn, "flip", true);
}

//Returns an Art Sprite with Additional Columns and Rows Mirrored Across the X-Axis or Y-Axis
function mirrorArt(drawn, useX) {
    let template = drawn.original;
    let height = drawn.height;
    let width = drawn.width;
    let result = [];
    let w = width - 1;
    let h = height - 1;

    if (useX) {
        for (let i = 0; i < height; i++) {
            result[i] = [];
            let scope = template[i].length - 1;
            for (let i2 = 0; i2 < width; i2++) {
                result[i][i2] = template[i][i2];
            }
            for (let i2 = 0; i2 < width; i2++) {
                let bonus = width + i2;
                if (template.length % 2 != 0 && i2 != (parseInt(template.length / 2) + (template.length % 2))) {
                } else {
                    result[i][bonus] = template[i][scope - i2];
                }
            }
        }
        let totalParts = result[0].length;
        let addedParts = totalParts - width;
        for (let i = 0; i < addedParts; i++) {
            let truePart = height + i;
            result[truePart] = [];
            for (let i2 = 0; i2 < totalParts; i2++) {
                result[truePart][i2] = "none";
            }
        }
    } else {
        for (let i = 0; i < (height * 2); i++) {
            result[i] = [];
        }
        for (let i2 = 0; i2 < width; i2++) {
            for (let i = 0; i < height; i++) {
                result[i][i2] = template[i][i2];
            }
            for (let i = 0; i < height; i++) {
                let scope = template[i].length - 1;
                let bonus = height + i;
                if (template[0].length % 2 != 0 && i2 != (parseInt(template[0].length / 2) + (template[0].length % 2))) {
                } else {
                    result[bonus][i2] = template[scope - i][i2];
                }
            }
        }
        let totalParts = result.length;
        let addedParts = totalParts - width;
        for (let i2 = 0; i2 < addedParts; i2++) {
            let truePart = width + i2;
            for (let i = 0; i < totalParts; i++) {
                result[i][truePart] = "none";
            }
        }
    }

    result = makeDrawing(result, true);

    return result;
}

//Returns Animation Drawing Array Rotated by 90 Degrees
function rotateAnim(drawn) {
    for (let i = 0; i < drawn.art.length; i++) {
        drawn.art[i] = rotateArt(drawn.art[i]);
    }
    return drawn;
}

//Returns Animation Drawing Array Flipped Across Y-Axis
function flipAnim(drawn) {
    for (let i = 0; i < drawn.art.length; i++) {
        drawn.art[i] = flipArt(drawn.art[i]);
    }
    return drawn;
}

//Returns Animation Drawing Array Rotated Mirrored Across the X-Axis or Y-Axis
function mirrorAnim(drawn, useX) {
    for (let i = 0; i < drawn.art.length; i++) {
        drawn.art[i] = mirrorArt(drawn.art[i], useX);
    }
    return drawn;
}

//Adds an Animated Area to the Global List of Cleared Contexts
function addAnimationZone(region) {
    animatedZones[animatedZones.length] = region;
}

//Adds an Animation to the Global List
function addAnimation(animation) {
    animationsList[animationsList.length] = animation;
}

//Adds a Moved Element to the Global List
function addMover(mover) {
    moverList[moverList.length] = mover;
}

//Removes a Moved Element from the Global List
function removeMover(mover) {
    let id = "none";
    for (let i = 0; i < moverList.length; i++) {
        if (moverList[i] == mover) id = i;
    }

    if (id != "none") {
        if (id != moverList.length - 1) {
            moverList[id] = moverList[moverList.length - 1];
        }
        moverList.pop();
    }
}

//Removes an Animation from the Global List
function removeAnimation(animation) {
    let id = "none";
    for (let i = 0; i < animationsList.length; i++) {
        if (animationsList[i] == animation) id = i;
    }

    if (id != "none") {
        if (id != animationsList.length - 1) {
            animationsList[id] = animationsList[animationsList.length - 1];
        }
        animationsList.pop();
    }
}

//Returns a Drawing with Equal Width and Height
function equalizeDrawing(drawn) {
    let result = drawn;
    let template = result.original;

    if (drawn.width != drawn.height) {
        let diff = Math.abs(drawn.width - drawn.height);
        if (drawn.width > drawn.height) {
            for (let i = 0; i < diff; i++) {
                template[template.length] = [];
                for (let i2 = 0; i2 < template[i].length; i2++) {
                    template[template.length - 1][i2] = "none";
                }
            }
        } else {
            for (let i = 0; i < template.length; i++) {
                for (let i2 = 0; i2 < diff; i2++) {
                    template[i][template[i].length] = "none";
                }
            }
        }
    }
    result.art = drawnArray(template, template[0].length, template.length);
    result.width = template[0].length;
    result.height = template.length;
    result.original = template;

    return result;
}

//Returns the True Width and Height Recognizing Blank Space for a Drawing
function trueDrawDimensions(drawn) {
    let checklist = drawn.original;
    let trueWidth = drawn.width;
    let trueHeight = drawn.height;
    let h = drawn.height - 1;
    let w = drawn.width - 1;

    let checking = true;
    //Height Test
    for (let i = 0; i < drawn.height; i++) {
        let checked = h - i;
        let valid = true;
        for (let i2 = 0; i2 < drawn.width; i2++) {
            if (checking) {
                if (checklist[checked][i2] != "none") {
                    valid = false;
                    checking = false;
                }
            }
        }
        if (valid && checking) trueHeight -= 1;
    }

    //Width Test
    checking = true;
    for (let i2 = 0; i2 < drawn.width; i2++) {
        let checked = w - i2;
        let valid = true;
        for (let i = 0; i < trueHeight; i++) {
            if (checking) {
                if (checklist[i][checked] != "none") {
                    valid = false;
                    checking = false;
                }
            }
        }
        if (valid && checking) trueWidth -= 1;
    }

    //Final
    return [trueWidth, trueHeight];
}

//Returns the True Width and Height Recognizing Blank Space for an Animation
function trueAnimDimensions(drawn) {
    let trueWidth = trueDrawDimensions(drawn.art[0])[0];
    let trueHeight = trueDrawDimensions(drawn.art[0])[1];

    if (drawn.art.length > 1) {
        for (let i = 1; i < drawn.art.length; i++) {
            let sizes = trueDrawDimensions(drawn.art[i]);

            if (sizes[0] > trueWidth) {
                trueWidth = sizes[0];
            }

            if (sizes[1] > trueHeight) {
                trueHeight = sizes[1];
            }
        }
    }

    return [trueWidth, trueHeight];
}

//Adds Rows or Columns to an Array of Arrays (ex. "Original" of a Drawing)
function addRowColumn(type, num, list, value, equalized) {
    let rem = num;
    while (rem > 0) {
        let temp = [];
        let leng = 0;
        if (type == "row") {
            leng = list[0].length;
            for (let i = 0; i < leng; i++) {
                temp[i] = value;
            }
            list.unshift(temp);
            rem -= 1;

            if (equalized && rem > 0) {
                temp = [];
                leng = list[0].length;
                for (let i = 0; i < leng; i++) {
                    temp[i] = value;
                }
                list.push(temp);
                rem -= 1;
            }
        } else {
            for (let i = 0; i < list.length; i++) {
                list[i].unshift(value);
            }
            rem -= 1;
            if (equalized && rem > 0) {
                for (let i = 0; i < list.length; i++) {
                    list[i].push(value);
                }
            }
            rem -= 1;
        }
    }

    return list;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Queued Event Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Applies Global Events
function makeEvents() {
    if (eventQueue.length > 0) {
        for (let i = 0; i < eventQueue.length; i++) {
            if (eventQueue[i].when == globalAnimationCycle) {
                eventQueue[i].action.apply(this, eventQueue[i].params);
                eventQueue[i] = eventQueue[eventQueue.length - 1];
                eventQueue.pop();
                i -= 1;
            }
        }
    }
}

//Queues an Event for a Future Frame
function queueEvent(delay, action, params) {
    let when = globalAnimationCycle + delay;
    let result = { "when": when, "action": action, "params": params };
    addEventQueue(result);
}

//Adds an Event to the Global Queue
function addEventQueue(event) {
    eventQueue[eventQueue.length] = event;
}

//Applies Global Repeats
function makeRepeats() {
    if (repeatQueue.length > 0) {
        for (let i = 0; i < repeatQueue.length; i++) {
            if (globalAnimationCycle % repeatQueue[i].when == 0) {
                repeatQueue[i].action.apply(this, repeatQueue[i].params);
            }
        }
    }
}

//Queues a Repeat for a Future Frame
function queueRepeat(id, when, action, params) {
    //let result = { "when": when, "action": action, "params": params };
    let result = { "id": id, "when": when, "action": action, "params": params };
    addRepeatQueue(result);
}

//Adds a Repeat to the Global Queue
function addRepeatQueue(repeat) {
    repeatQueue[repeatQueue.length] = repeat;
}

//Removes a Repeat from the Global Queue
function removeRepeatQueue(repeat) {
    let id = "ignore";
    for (let i = 0; i < repeatQueue.length; i++) {
        if (repeatQueue[i].id == repeat) {
            id = i;
        }
    }

    if (id != "ignore") {
        if (id != repeatQueue.length - 1) {
            repeatQueue[id] = repeatQueue[repeatQueue.length - 1];
        }
        repeatQueue.pop();
        //if (repeatQueue.length < 1) repeatQueue = [];
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Blocked Area Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Makes a Blocked Area
function makeBlockedArea(id, x, y, w, h) {
    return { "id": id, "x": x, "y": y, "w": w, "h": h };
}

//Adds a Blocked Area to the List
function addBlockedArea(newBlock) {
    blockedAreas[blockedAreas.length] = newBlock;
}

//Removes a Blocked Area from the List
function removeBlockedArea(id) {
    let result = "none";
    for (let i = 0; i < blockedAreas.length; i++) {
        if (typeof id == "string") {
            if (blockedAreas[i].id == id) result = i;
        } else {
            if (id == blockedAreas[i]) result = i;
        }
    }

    if (result != "none") {
        blockedAreas[result] = blockedAreas[blockedAreas.length - 1];
        blockedAreas.pop();
    }
}

//Checks if a Point is Within Blocked Area
function checkAllBlocks(x, y, w, h, seeWindows) {
    let result = false;

    if (blockedAreas.length > 0) {
        for (let i = 0; i < blockedAreas.length; i++) {
            if (checkBlock(x, y, w, h, blockedAreas[i])) {
                result = true;
            }
        }
    }

    if (seeWindows && winds.length > 0) {
        for (let i = 0; i < winds.length; i++) {
            let tempBlock = windowToBlock(winds[i], false);
            if (checkBlock(x, y, w, h, tempBlock)) {
                result = true;
            }
        }
    }

    return result;
}

//Checks if a Point is Within a Specific Blocked Areas
function checkBlock(x, y, w, h, block) {
    let result = checkCollision(x, y, w, h, block.x, block.y, block.w, block.h);
    return result;
}

//Converts a Window into a Blocked Area
function windowToBlock(log, useAlt) {
    let win = log.win;
    let id = win.id;
    let x = propMin(win.style[cssAbb("marl")]);
    let y = propMin(win.style[cssAbb("mart")]);
    let w = propMin(win.style[cssAbb("w")]);
    let h = propMin(win.style[cssAbb("h")]);

    if (log.title != false) {
        h += propMin(document.getElementById(log.title).style[cssAbb("h")]);
    }

    if (x == undefined || y == undefined) {
        useAlt = true;
    }

    if (useAlt) {
        x = propMin(win.style[cssAbb("l")]);
        y = propMin(win.style[cssAbb("t")]);
    }

    return makeBlockedArea(id, x, y, w, h);
}

//Converts an Animation to a Blocked Area
function animToBlock(drawn) {
    let dimensions = trueAnimDimensions(drawn);
    let w = dimensions[0] * drawn.localPixes;
    let h = dimensions[1] * drawn.localPixes;
    let id = drawn.id;
    return makeBlockedArea(id, drawn.x, drawn.y, w, h);
}

//Checks if a Drawing is Blocked
function checkDrawBlock(drawn, x, y, localPixes, seeWindows) {
    let dimensions = trueDrawDimensions(drawn);
    let w = dimensions[0] * localPixes;
    let h = dimensions[1] * localPixes;
    return checkAllBlocks(x, y, w, h, seeWindows);
}

//Checks if an Animation is Blocked
function checkAnimationBlock(drawn, seeWindows) {
    let result = false;
    for (let i = 0; i < drawn.art.length; i++) {
        if (checkDrawBlock(drawn.art[i], drawn.x, drawn.y, drawn.localPixes, seeWindows)) {
            result = true;
        }
    }
    return result;
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Unique Art Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------

//Returns Value Based on Variable Input Art
function retrieveArt(style, colors, frame, options, searches) {
    for (let i = 0; i < options.length; i++) {
        if (style == options[i]) {
            return searches[i].apply(this, [colors, frame]);
        }
    }

}

//Compiles the Normal Animation for an Image's Style
function compileArtStyle(images, colors, frame) {
    let results = [];

    for (let i = 0; i < images.length; i++) {
        for (let i2 = 0; i2 < images[i].length; i2++) {
            for (let i3 = 0; i3 < images[i][i2].length; i3++) {
                images[i][i2][i3] = colors[images[i][i2][i3]];
            }
        }
        results[i] = makeDrawing(images[i], true);
    }

    if (frame < 0) {
        return results;
    } else {
        return results[frame];
    }
}

//Miscellaneous and Unused
function crystalArt(style, colors, frame) {
    let options = ["stand", "attack"];
    let searches = [crystalStand, crystalStand];

    return retrieveArt(style, colors, frame, options, searches);
}

function crystalStand(colors, frame) {
    let shows = -1;
    let images = [];
    //none, darkred, red, indianred, #400000
    //blank, edge, primary, secondary, tertiary

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 3, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 3, 3, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 2, 3, 3, 3, 2, 2, 2, 2, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 2, 3, 3, 3, 4, 4, 2, 2, 2, 2, 1, 0];
    images[shows][images[shows].length] = [1, 2, 3, 3, 3, 4, 2, 3, 4, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 4, 3, 2, 4, 3, 3, 3, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 2, 2, 2, 4, 4, 3, 3, 3, 3, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 2, 2, 2, 2, 3, 3, 3, 3, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    //images[shows][images[shows].length] = [];

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    return compileArtStyle(images, colors, frame);
}

function blockPathImage(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [1, 0, 1];
    images[shows][images[shows].length] = [0, 1, 0];
    images[shows][images[shows].length] = [1, 0, 1];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [2, 0, 2];
    images[shows][images[shows].length] = [0, 2, 0];
    images[shows][images[shows].length] = [2, 0, 2];

    return compileArtStyle(images, colors, frame);
}

function testAnimation(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 1];
    images[shows][images[shows].length] = [1, 2, 1];
    images[shows][images[shows].length] = [1, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [1, 0, 0];
    images[shows][images[shows].length] = [1, 1, 2];
    images[shows][images[shows].length] = [0, 1, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 1, 0];
    images[shows][images[shows].length] = [2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1];

    return compileArtStyle(images, colors, frame);
}

function testAnimation2(colors, frame) {
    let shows = -1;
    let images = [];
    //none, darkred, red, indianred, #400000
    //blank, edge, primary, secondary, tertiary

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 3, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 3, 3, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 2, 3, 3, 3, 2, 2, 2, 2, 1, 0, 0];
    images[shows][images[shows].length] = [0, 1, 2, 3, 3, 3, 4, 4, 2, 2, 2, 2, 1, 0];
    images[shows][images[shows].length] = [1, 2, 3, 3, 3, 4, 2, 3, 4, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 4, 3, 2, 4, 3, 3, 3, 3, 1];
    images[shows][images[shows].length] = [0, 1, 2, 2, 2, 2, 4, 4, 3, 3, 3, 3, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 2, 2, 2, 2, 3, 3, 3, 3, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 3, 3, 3, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 3, 3, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
    //images[shows][images[shows].length] = [];

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    shows += 1;
    images[shows] = rotateArt(makeDrawing(images[shows - 1], true)).original;

    return compileArtStyle(images, colors, frame);
}

function testAnimation3(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0];
    images[shows][images[shows].length] = [0, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0];
    images[shows][images[shows].length] = [0, 1, 0];
    images[shows][images[shows].length] = [0, 0, 0];

    return compileArtStyle(images, colors, frame);
}

//Pathers
function animationBird(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [1, 2, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1];
    images[shows][images[shows].length] = [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    return compileArtStyle(images, colors, frame);
}

function animationFish(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [1, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 1];
    images[shows][images[shows].length] = [1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1];
    images[shows][images[shows].length] = [1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1];
    images[shows][images[shows].length] = [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = addRowColumn("col", 6, images[shows], 0, true);

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [2, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 2];
    images[shows][images[shows].length] = [2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2];
    images[shows][images[shows].length] = [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2];
    images[shows][images[shows].length] = [0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = addRowColumn("col", 6, images[shows], 0, true);

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [1, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 1];
    images[shows][images[shows].length] = [1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 1];
    images[shows][images[shows].length] = [1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1];
    images[shows][images[shows].length] = [0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0];
    images[shows][images[shows].length] = [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = addRowColumn("col", 6, images[shows], 0, true);

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0];
    images[shows][images[shows].length] = [2, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 2];
    images[shows][images[shows].length] = [2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2];
    images[shows][images[shows].length] = [2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2];
    images[shows][images[shows].length] = [0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 1, 3, 2, 2, 3, 1, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = addRowColumn("col", 6, images[shows], 0, true);


    return compileArtStyle(images, colors, frame);
}

function animationBug(colors, frame) {
    let shows = -1;
    let images = [];

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 2, 0, 0, 3, 3, 3, 3, 0, 0, 2, 3, 3, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3, 3, 3, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 3, 3, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 2, 0, 1, 3, 3, 3, 3, 1, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 3, 2, 3, 3, 2, 2, 3, 3, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 2, 0, 2, 2, 2, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 2, 0, 0, 3, 3, 3, 3, 0, 0, 2, 3, 3, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 3, 2, 1, 3, 2, 2, 3, 1, 2, 3, 3, 3, 2, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;

    shows += 1;
    images[shows] = [];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 3, 3, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 2, 0, 1, 3, 3, 3, 3, 1, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 2, 3, 3, 3, 2, 3, 3, 2, 2, 3, 3, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [2, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2];
    images[shows][images[shows].length] = [0, 2, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 0];
    images[shows][images[shows].length] = [0, 0, 2, 2, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 2, 2, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 3, 2, 0, 2, 2, 2, 2, 0, 0, 2, 3, 2, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0];
    images[shows][images[shows].length] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = rotateArt(makeDrawing(images[shows], false)).original;
    images[shows] = alterArt(makeDrawing(images[shows], false), "flip", false);

    //images[shows] = flipArt(images[shows]).original;

    return compileArtStyle(images, colors, frame);
}

//------------------------------------------------------------------------------------------------------------------------------------------------------
//Miscellaneous Functions
//------------------------------------------------------------------------------------------------------------------------------------------------------





