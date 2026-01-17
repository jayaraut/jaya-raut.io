/**
 * Main App Component
 * Root component that manages application state
 */
function App() {
    const { useState, useEffect } = React;
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('dayPlannerTasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [profileImage, setProfileImage] = useState(() => {
        return localStorage.getItem('profileImage') || '';
    });

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('dayPlannerTasks', JSON.stringify(tasks));
    }, [tasks]);

    /**
     * Calculate streak (consecutive days with completed tasks)
     */
    const calculateStreak = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let streak = 0;
        let checkDate = new Date(today);

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const dayTasks = tasks.filter(t => t.date === dateStr);
            const hasCompletedTask = dayTasks.some(t => t.completed);

            if (hasCompletedTask) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    };

    /**
     * Calculate total score from all completed tasks
     */
    const calculateTotalScore = () => {
        return tasks
            .filter(task => task.completed)
            .reduce((total, task) => total + (task.points || 10), 0);
    };

    /**
     * Calculate score for selected day
     */
    const calculateDayScore = () => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return tasks
            .filter(task => task.date === dateStr && task.completed)
            .reduce((total, task) => total + (task.points || 10), 0);
    };

    /**
     * Add a new task
     */
    const handleAddTask = (task) => {
        setTasks([...tasks, task]);
    };

    /**
     * Toggle task completion
     */
    const handleToggleTask = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    /**
     * Delete a task by ID
     */
    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    /**
     * Change selected date
     */
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const streak = calculateStreak();
    const totalScore = calculateTotalScore();
    const dayScore = calculateDayScore();

    return (
        <div className="container">
            <Header 
                profileImage={profileImage}
                streak={streak}
                totalScore={totalScore}
            />
            <DayPlanner 
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                dayScore={dayScore}
            />
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
