/**
 * LeetCode Tracker Component
 * Displays a dialog for tracking LeetCode problem-solving streak
 * 
 * @param {boolean} isOpen - Whether the dialog is open
 * @param {Function} onClose - Handler to close the dialog
 * @param {Array} leetcodeTasks - Array of LeetCode tasks
 * @param {Function} onToggleTask - Handler for toggling task completion
 * @param {Function} onUpdateCount - Handler for updating question count
 * @param {number} leetcodeStreak - Current LeetCode streak
 */
function LeetCodeTracker({ 
    isOpen, 
    onClose, 
    leetcodeTasks, 
    onToggleTask, 
    onUpdateCount,
    leetcodeStreak,
    isAdmin,
    showToast 
}) {
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const scrollContainerRef = React.useRef(null);
    const todayRef = React.useRef(null);

    // Scroll to today's date when dialog opens
    React.useEffect(() => {
        if (isOpen && todayRef.current) {
            setTimeout(() => {
                todayRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Format date for display
    const formatDateStr = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Generate dates from Jan 1 of last year to Dec 31 of next year
    const generateDates = () => {
        const dates = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        
        // Start date: January 1 of last year
        const startDate = new Date(currentYear - 1, 0, 1); // Month is 0-indexed (0 = January)
        
        // End date: December 31 of next year
        const endDate = new Date(currentYear + 1, 11, 31); // Month 11 = December
        
        // Generate all dates from start to end
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return dates;
    };

    const dates = generateDates();

    const getTaskForDate = (date) => {
        const dateStr = formatDateStr(date);
        return leetcodeTasks.find(task => task.date === dateStr);
    };

    const handleCheckboxClick = (date, task) => {
        if (!isAdmin) {
            showToast('Please sign in to update LeetCode tasks');
            return;
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        // Don't allow completing future tasks
        if (checkDate.getTime() > today.getTime()) {
            return;
        }

        const dateStr = formatDateStr(date);
        if (task) {
            onToggleTask(task.id);
        } else {
            // Create new task with default count of 1
            onToggleTask(null, dateStr, 1);
        }
    };

    const handleCountChange = (date, newCount) => {
        if (!isAdmin) {
            return;
        }
        
        const dateStr = formatDateStr(date);
        const task = getTaskForDate(date);
        
        if (task) {
            onUpdateCount(task.id, parseInt(newCount) || 0);
        } else if (newCount > 0) {
            // Create task with count
            onToggleTask(null, dateStr, parseInt(newCount));
        }
    };

    const handleCountKeyPress = (e, date, task) => {
        if (e.key === 'Enter') {
            const newCount = parseInt(e.target.value) || 0;
            if (newCount > 0 && (!task || !task.completed)) {
                // If there's a count and the task is not completed, check it
                const dateStr = formatDateStr(date);
                if (task && !task.completed) {
                    // First update the count, then toggle completion
                    onUpdateCount(task.id, newCount);
                    setTimeout(() => {
                        onToggleTask(task.id);
                    }, 10);
                } else if (!task) {
                    // Create new completed task with the entered count
                    onToggleTask(null, dateStr, newCount);
                }
            }
        }
    };

    const isFutureDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate.getTime() > today.getTime();
    };

    const scrollToToday = () => {
        todayRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    };

    return (
        <div className="leetcode-overlay" onClick={onClose}>
            <div className="leetcode-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="leetcode-header">
                    <div>
                        <h2>Leet<span style={{color: '#FFA116'}}>Code</span> Tracker</h2>
                        <p className="leetcode-streak">🔥 <span className="streak-count">{leetcodeStreak}</span></p>
                    </div>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <button className="today-button" onClick={scrollToToday}>
                            Today
                        </button>
                        <button className="close-button" onClick={onClose}>✕</button>
                    </div>
                </div>
                
                <div className="leetcode-content" ref={scrollContainerRef}>
                    {dates.map((date, index) => {
                        const task = getTaskForDate(date);
                        const isFuture = isFutureDate(date);
                        const isToday = formatDateStr(date) === formatDateStr(new Date());
                        
                        return (
                            <div 
                                key={index} 
                                ref={isToday ? todayRef : null}
                                className={`leetcode-day-item ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''}`}
                            >
                                <div className="day-info">
                                    <span className="day-date">
                                        {date.toLocaleDateString('en-US', { 
                                            weekday: 'short', 
                                            month: 'short', 
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {isToday && <span className="today-badge">Today</span>}
                                </div>
                                
                                <div className="day-actions">
                                    <button 
                                        className={`checkbox-btn ${task?.completed ? 'checked' : ''} ${isFuture ? 'disabled' : ''}`}
                                        onClick={() => !isFuture && handleCheckboxClick(date, task)}
                                        disabled={isFuture || !isAdmin}
                                        title={isFuture ? 'Cannot complete future tasks' : (!isAdmin ? 'Sign in to mark complete' : 'Mark as completed')}
                                        style={{ cursor: (isFuture || !isAdmin) ? 'not-allowed' : 'pointer', opacity: !isAdmin ? 0.7 : 1 }}
                                    >
                                        {task?.completed ? '✓' : '○'}
                                    </button>
                                    
                                    <input 
                                        type="number"
                                        min="0"
                                        max="99999"
                                        placeholder="0"
                                        className="question-count"
                                        value={task?.questionCount || ''}
                                        onChange={(e) => handleCountChange(date, e.target.value)}
                                        onKeyPress={(e) => handleCountKeyPress(e, date, task)}
                                        disabled={isFuture || !isAdmin}
                                        title={!isAdmin ? 'Sign in to edit' : 'Number of questions solved'}
                                        style={{ cursor: !isAdmin ? 'not-allowed' : 'text', opacity: !isAdmin ? 0.7 : 1 }}
                                    />
                                    <span className="count-label">problems</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
