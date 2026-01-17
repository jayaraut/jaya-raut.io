/**
 * Calendar Component
 * Displays an inline calendar for date selection
 */
function Calendar({ selectedDate, onDateChange }) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date(selectedDate));

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(year, month, day);
        onDateChange(newDate);
    };

    const handleTodayClick = () => {
        const today = new Date();
        onDateChange(today);
        setCurrentMonth(today);
    };

    const isSelectedDate = (day) => {
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year
        );
    };

    const isToday = (day) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year
        );
    };

    // Create array of day cells
    const dayCells = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        dayCells.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const classes = ['calendar-day'];
        if (isSelectedDate(day)) classes.push('selected');
        if (isToday(day)) classes.push('today');

        dayCells.push(
            <div
                key={day}
                className={classes.join(' ')}
                onClick={() => handleDateClick(day)}
            >
                {day}
            </div>
        );
    }

    return (
        <div className="calendar-widget">
            <div className="calendar-header">
                <button className="calendar-nav" onClick={handlePrevMonth}>
                    ‹
                </button>
                <div className="calendar-month">
                    {monthNames[month]} {year}
                </div>
                <button className="calendar-nav" onClick={handleNextMonth}>
                    ›
                </button>
            </div>
            <div className="calendar-weekdays">
                {dayNames.map(day => (
                    <div key={day} className="calendar-weekday">
                        {day}
                    </div>
                ))}
            </div>
            <div className="calendar-days">
                {dayCells}
            </div>
            <button className="today-button" onClick={handleTodayClick}>
                ← Today
            </button>
        </div>
    );
}
