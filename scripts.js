const monthYear = document.getElementById("monthYear");

const calendarDays = document.getElementById("calendarDays");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

const todayBtn = document.getElementById("todayBtn");

const selectedDateText =
    document.getElementById("selectedDate");

const eventInput =
    document.getElementById("eventInput");

const addEventBtn =
    document.getElementById("addEventBtn");

const eventList =
    document.getElementById("eventList");


let currentDate = new Date();

let selectedDate = null;


/* Get saved events */

let events =
    JSON.parse(
        localStorage.getItem("calendarEvents")
    ) || {};


/* Month names */

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


/* Create calendar */

function renderCalendar() {

    calendarDays.innerHTML = "";

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    monthYear.textContent =
        `${months[month]} ${year}`;


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const totalDays =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* Empty spaces */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const emptyDiv =
            document.createElement("div");

        emptyDiv.classList.add(
            "day",
            "empty-day"
        );

        calendarDays.appendChild(
            emptyDiv
        );

    }


    /* Create days */

    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const dayDiv =
            document.createElement("div");


        dayDiv.classList.add("day");


        const dayNumber =
            document.createElement("span");


        dayNumber.textContent = day;

        dayNumber.classList.add(
            "day-number"
        );


        dayDiv.appendChild(dayNumber);


        const dateKey =
            formatDateKey(
                year,
                month,
                day
            );


        /* Mark today */

        const today =
            new Date();


        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayDiv.classList.add(
                "today"
            );

        }


        /* Selected date */

        if (
            selectedDate === dateKey
        ) {

            dayDiv.classList.add(
                "selected"
            );

        }


        /* Event indicator */

        if (
            events[dateKey] &&
            events[dateKey].length > 0
        ) {

            dayDiv.classList.add(
                "has-event"
            );

        }


        /* Click event */

        dayDiv.addEventListener(
            "click",
            function () {

                selectDate(
                    year,
                    month,
                    day
                );

            }
        );


        calendarDays.appendChild(
            dayDiv
        );

    }

}


/* Select date */

function selectDate(
    year,
    month,
    day
) {

    selectedDate =
        formatDateKey(
            year,
            month,
            day
        );


    const readableDate =
        new Date(
            year,
            month,
            day
        );


    selectedDateText.textContent =
        readableDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    renderCalendar();

    showEvents();

}


/* Date key */

function formatDateKey(
    year,
    month,
    day
) {

    const monthNumber =
        String(month + 1)
            .padStart(2, "0");


    const dayNumber =
        String(day)
            .padStart(2, "0");


    return `${year}-${monthNumber}-${dayNumber}`;

}


/* Previous month */

prevBtn.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);


/* Next month */

nextBtn.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);


/* Today button */

todayBtn.addEventListener(
    "click",
    function () {

        currentDate = new Date();


        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();

        const day =
            currentDate.getDate();


        selectDate(
            year,
            month,
            day
        );

    }
);


/* Add event */

addEventBtn.addEventListener(
    "click",
    addEvent
);


/* Enter key */

eventInput.addEventListener(
    "keypress",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            addEvent();

        }

    }
);


/* Add Event function */

function addEvent() {

    const eventText =
        eventInput.value.trim();


    if (!selectedDate) {

        alert(
            "Please select a date first."
        );

        return;

    }


    if (eventText === "") {

        alert(
            "Please enter an event."
        );

        return;

    }


    if (!events[selectedDate]) {

        events[selectedDate] = [];

    }


    events[selectedDate].push(
        eventText
    );


    saveEvents();


    eventInput.value = "";


    showEvents();

    renderCalendar();

}


/* Show events */

function showEvents() {

    eventList.innerHTML = "";


    if (
        !selectedDate ||
        !events[selectedDate] ||
        events[selectedDate].length === 0
    ) {

        eventList.innerHTML =
            `
            <p class="empty-message">
                No events added.
            </p>
            `;

        return;

    }


    events[selectedDate].forEach(
        function (eventText, index) {

            const eventItem =
                document.createElement(
                    "div"
                );


            eventItem.classList.add(
                "event-item"
            );


            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                eventText;


            const deleteBtn =
                document.createElement(
                    "button"
                );


            deleteBtn.textContent =
                "Delete";


            deleteBtn.classList.add(
                "delete-btn"
            );


            deleteBtn.addEventListener(
                "click",
                function () {

                    deleteEvent(index);

                }
            );


            eventItem.appendChild(text);

            eventItem.appendChild(
                deleteBtn
            );


            eventList.appendChild(
                eventItem
            );

        }
    );

}


/* Delete Event */

function deleteEvent(index) {

    events[selectedDate].splice(
        index,
        1
    );


    if (
        events[selectedDate].length === 0
    ) {

        delete events[selectedDate];

    }


    saveEvents();

    showEvents();

    renderCalendar();

}


/* Save events */

function saveEvents() {

    localStorage.setItem(
        "calendarEvents",
        JSON.stringify(events)
    );

}


/* Start app */

renderCalendar();


/* Select today's date automatically */

const today = new Date();

selectDate(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
);