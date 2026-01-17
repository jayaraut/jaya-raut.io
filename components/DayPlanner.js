/**
 * DayPlanner Component
 * Displays tasks for a specific day with completion tracking
 * 
 * @param {Date} selectedDate - The selected date
 * @param {Function} onDateChange - Handler for date change
 * @param {Array} tasks - Array of tasks for the selected date
 * @param {Function} onToggleTask - Handler for toggling task completion
 * @param {Function} onAddTask - Handler for adding a new task
 * @param {Function} onDeleteTask - Handler for deleting a task
 * @param {number} dayScore - Points earned for the selected day
 */
function DayPlanner({ 
    selectedDate, 
    onDateChange, 
    tasks, 
    onToggleTask,
    onAddTask, 
    onDeleteTask,
    dayScore 
}) {
    const [taskText, setTaskText] = React.useState('');

    // Create date string in local timezone to avoid UTC conversion issues
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayTasks = tasks.filter(task => task.date === dateStr);
    const completedCount = dayTasks.filter(task => task.completed).length;
    const totalCount = dayTasks.length;

    const formattedDate = selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const handleAddTask = () => {
        if (taskText.trim()) {
            onAddTask({
                id: Date.now(),
                text: taskText.trim(),
                date: dateStr,
                completed: false,
                points: 10
            });
            setTaskText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };

    return (
        <div className="day-planner">
            <div className="planner-header">
                <div className="date-selector">
                    <h2>{formattedDate}</h2>
                </div>
                <div className="day-stats">
                    <div className="progress-info">
                        <span className="progress-text">
                            {completedCount} / {totalCount} tasks completed
                        </span>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="day-score">
                        <span className="score-label">Today's Score:</span>
                        <span className="score-value">{dayScore} pts</span>
                    </div>
                </div>
            </div>

            <div className="task-input-section">
                <h3>What did you do today?</h3>
                <div className="task-input-container">
                    <input 
                        type="text" 
                        placeholder="Add a task you completed or plan to do..."
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="task-input"
                    />
                    <button onClick={handleAddTask} className="add-task-btn">
                        + Add Task
                    </button>
                </div>
            </div>

            <div className="tasks-section">
                <h3>Tasks</h3>
                {dayTasks.length === 0 ? (
                    <div className="empty-state">
                        No tasks yet. Add your first task above!
                    </div>
                ) : (
                    <ul className="task-list">
                        {dayTasks.map(task => (
                            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                <button 
                                    className="task-checkbox"
                                    onClick={() => onToggleTask(task.id)}
                                >
                                    {task.completed ? '✓' : '○'}
                                </button>
                                <div className="task-content">
                                    <span className="task-text">{task.text}</span>
                                    <span className="task-points">+{task.points} pts</span>
                                </div>
                                <button 
                                    className="task-delete"
                                    onClick={() => onDeleteTask(task.id)}
                                >
                                    🗑️
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
