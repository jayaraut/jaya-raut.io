/**
 * Main App Component
 * Root component that manages application state with Firebase sync
 */
function App() {
    const { useState, useEffect, useMemo } = React;
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [profileImage, setProfileImage] = useState('');
    const [toast, setToast] = useState({ show: false, message: '' });
    const [leetcodeTasks, setLeetcodeTasks] = useState([]);
    const [isLeetCodeOpen, setIsLeetCodeOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // User ID for Firebase (you can change this or make it dynamic)
    const userId = 'jaya-raut'; // Use a unique identifier

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            const wasAdmin = isAdmin;
            setIsAdmin(!!user);
            
            if (user && !wasAdmin) {
                showToast('✅ Signed in as admin');
            } else if (!user && wasAdmin) {
                showToast('👋 Signed out. Portfolio is read-only');
            }
        });
        return () => unsubscribe();
    }, [isAdmin]);

    // Load data from Firebase on mount
    useEffect(() => {
        const userRef = database.ref(`users/${userId}`);
        
        userRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setTasks(data.tasks || []);
                setLeetcodeTasks(data.leetcodeTasks || []);
                setProfileImage(data.profileImage || '');
            }
            setIsLoading(false);
        });

        // Cleanup listener on unmount
        return () => userRef.off();
    }, []);

    // Sync tasks to Firebase
    useEffect(() => {
        if (!isLoading && tasks.length >= 0 && isAdmin) {
            database.ref(`users/${userId}/tasks`).set(tasks);
        }
    }, [tasks, isLoading, isAdmin]);

    // Sync profile image to Firebase
    useEffect(() => {
        if (!isLoading && isAdmin) {
            database.ref(`users/${userId}/profileImage`).set(profileImage || '');
        }
    }, [profileImage, isLoading, isAdmin]);

    // Sync LeetCode tasks to Firebase
    useEffect(() => {
        if (!isLoading && leetcodeTasks.length >= 0 && isAdmin) {
            database.ref(`users/${userId}/leetcodeTasks`).set(leetcodeTasks);
        }
    }, [leetcodeTasks, isLoading, isAdmin]);

    /**
     * Show toast notification
     */
    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    /**
     * Helper function to format date in local timezone
     */
    const formatDateStr = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    /**
     * Calculate streak (consecutive days with completed tasks)
     * Counts consecutive days ending on today or yesterday (ignores future dates)
     */
    const calculateStreak = useMemo(() => {
        if (tasks.length === 0) return 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all dates with completed tasks that are TODAY or in the PAST (no future dates)
        const datesWithCompletedTasks = [...new Set(
            tasks
                .filter(t => {
                    if (!t.completed) return false;
                    const [year, month, day] = t.date.split('-').map(Number);
                    const taskDate = new Date(year, month - 1, day);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() <= today.getTime(); // Only past and today
                })
                .map(t => t.date)
        )].sort();

        if (datesWithCompletedTasks.length === 0) return 0;

        // Convert date strings to Date objects
        const dates = datesWithCompletedTasks.map(dateStr => {
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        });

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const mostRecentDate = dates[dates.length - 1];
        mostRecentDate.setHours(0, 0, 0, 0);

        // Streak must include today or yesterday to be "current"
        const isCurrentStreak = 
            mostRecentDate.getTime() === today.getTime() ||
            mostRecentDate.getTime() === yesterday.getTime();

        if (!isCurrentStreak) return 0;

        // Count backwards from the most recent date
        let streak = 1;
        let currentDate = new Date(mostRecentDate);

        for (let i = dates.length - 2; i >= 0; i--) {
            currentDate.setDate(currentDate.getDate() - 1);
            const expectedDate = new Date(currentDate);
            expectedDate.setHours(0, 0, 0, 0);
            
            const actualDate = new Date(dates[i]);
            actualDate.setHours(0, 0, 0, 0);

            if (expectedDate.getTime() === actualDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }, [tasks]);

    /**
     * Calculate total score from all completed tasks
     */
    const calculateTotalScore = useMemo(() => {
        return tasks
            .filter(task => task.completed)
            .reduce((total, task) => total + (task.points || 10), 0);
    }, [tasks]);

    /**
     * Calculate score for selected day
     */
    const calculateDayScore = useMemo(() => {
        const dateStr = formatDateStr(selectedDate);
        return tasks
            .filter(task => task.date === dateStr && task.completed)
            .reduce((total, task) => total + (task.points || 10), 0);
    }, [tasks, selectedDate]);

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
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        // Check if task is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const [year, month, day] = task.date.split('-').map(Number);
        const taskDate = new Date(year, month - 1, day);
        taskDate.setHours(0, 0, 0, 0);

        if (taskDate.getTime() > today.getTime()) {
            // Show toast for future date
            setToast({ show: true, message: '⚠️ You cannot complete tasks in the future!' });
            setTimeout(() => setToast({ show: false, message: '' }), 3000);
            return;
        }

        // Toggle task completion
        setTasks(tasks.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
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

    /**
     * Handle profile image upload (replaces existing image)
     */
    const handleImageUpload = (imageData, message) => {
        setProfileImage(imageData);
        if (message) {
            showToast(message);
        }
    };

    /**
     * Calculate LeetCode streak
     */
    const calculateLeetCodeStreak = useMemo(() => {
        if (leetcodeTasks.length === 0) {
            return 0;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const formatDateStr = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const datesWithCompleted = [...new Set(
            leetcodeTasks
                .filter(t => {
                    if (!t.completed) return false;
                    const [year, month, day] = t.date.split('-').map(Number);
                    const taskDate = new Date(year, month - 1, day);
                    taskDate.setHours(0, 0, 0, 0);
                    return taskDate.getTime() <= today.getTime();
                })
                .map(t => t.date)
        )].sort();

        if (datesWithCompleted.length === 0) {
            return 0;
        }

        const dates = datesWithCompleted.map(dateStr => {
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
        });

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const mostRecentDate = dates[dates.length - 1];
        mostRecentDate.setHours(0, 0, 0, 0);

        const isCurrentStreak = 
            mostRecentDate.getTime() === today.getTime() ||
            mostRecentDate.getTime() === yesterday.getTime();

        if (!isCurrentStreak) {
            return 0;
        }

        let streak = 1;
        let currentDate = new Date(mostRecentDate);

        for (let i = dates.length - 2; i >= 0; i--) {
            currentDate.setDate(currentDate.getDate() - 1);
            const expectedDate = new Date(currentDate);
            expectedDate.setHours(0, 0, 0, 0);
            
            const actualDate = new Date(dates[i]);
            actualDate.setHours(0, 0, 0, 0);

            if (expectedDate.getTime() === actualDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }, [leetcodeTasks]);

    /**
     * Handle LeetCode task toggle
     */
    const handleLeetCodeToggle = (id, dateStr = null, questionCount = 0) => {
        if (id) {
            // Toggle existing task
            const task = leetcodeTasks.find(t => t.id === id);
            
            setLeetcodeTasks(leetcodeTasks.map(task => 
                task.id === id ? { 
                    ...task, 
                    completed: !task.completed,
                    // If checking and count is 0, set to 1. If unchecking, set to 0. Otherwise preserve count.
                    questionCount: !task.completed ? (task.questionCount > 0 ? task.questionCount : 1) : 0
                } : task
            ));
        } else if (dateStr) {
            // Create new task - set questionCount to 1 if checking the box
            setLeetcodeTasks([...leetcodeTasks, {
                id: Date.now(),
                date: dateStr,
                completed: true, // Always set to true when creating via checkbox
                questionCount: questionCount > 0 ? questionCount : 1 // Default to 1 when checkbox is clicked
            }]);
        }
    };

    /**
     * Update question count for LeetCode task
     */
    const handleLeetCodeCountUpdate = (id, count) => {
        const task = leetcodeTasks.find(t => t.id === id);
        if (task) {
            setLeetcodeTasks(leetcodeTasks.map(t => 
                t.id === id ? { ...t, questionCount: count } : t
            ));
        }
    };

    /**
     * Handle data import from sync (deprecated - using Firebase now)
     */
    const handleDataImport = (data) => {
        if (data.tasks) setTasks(data.tasks);
        if (data.leetcodeTasks) setLeetcodeTasks(data.leetcodeTasks);
        if (data.profileImage) {
            setProfileImage(data.profileImage);
        } else {
            setProfileImage('');
        }
    };

    if (isLoading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center', color: '#667eea' }}>
                    <div style={{ fontSize: '2em', marginBottom: '10px' }}>⏳</div>
                    <div>Loading your data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {toast.show && (
                <div className="toast">
                    {toast.message}
                </div>
            )}
            
            <Header 
                profileImage={profileImage}
                streak={calculateStreak}
                totalScore={calculateTotalScore}
                onImageUpload={handleImageUpload}
            />
            <div className="main-content">
                <div className="calendar-sidebar">
                    <Calendar 
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                    />
                </div>
                <div className="planner-content">
                    <DayPlanner 
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        tasks={tasks}
                        onToggleTask={handleToggleTask}
                        onAddTask={handleAddTask}
                        onDeleteTask={handleDeleteTask}
                        dayScore={calculateDayScore}
                    />
                </div>
            </div>

            {/* Umbrella trigger area */}
            <div 
                className="admin-umbrella-trigger"
                onMouseEnter={() => {
                    document.querySelector('.umbrella-canopy')?.classList.add('open');
                }}
                onMouseLeave={() => {
                    document.querySelector('.umbrella-canopy')?.classList.remove('open');
                }}
                onClick={() => {
                    // Mobile: open on click
                    const canopy = document.querySelector('.umbrella-canopy');
                    if (canopy?.classList.contains('open')) {
                        if (isAdmin) {
                            window.signOut();
                        } else {
                            setIsSignInOpen(true);
                        }
                    } else {
                        canopy?.classList.add('open');
                    }
                }}
            >
                {/* Umbrella Canopy */}
                <div 
                    className="umbrella-canopy"
                    title={isAdmin ? "Click to Sign Out" : "Click to Sign In"}
                >
                    {/* Scalloped semicircle segments */}
                    <div className="umbrella-segment segment-1"></div>
                    <div className="umbrella-segment segment-2"></div>
                    <div className="umbrella-segment segment-3"></div>
                    <div className="umbrella-segment segment-4"></div>
                    <div className="umbrella-segment segment-5"></div>
                    <div className="umbrella-segment segment-6"></div>
                    
                    {/* Elegant text indicator */}
                    <div className="umbrella-label">
                        <span className="umbrella-main-text">{isAdmin ? 'Admin' : 'Sign In'}</span>
                        <span className="umbrella-sub-text">{isAdmin ? 'Sign Out' : 'Click Here'}</span>
                    </div>
                </div>
            </div>

            {/* Sign In Dialog */}
            <SignIn 
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                onSignIn={() => showToast('Successfully signed in!')}
            />

            <button 
                className="leetcode-button" 
                onClick={() => setIsLeetCodeOpen(true)}
                title="LeetCode Tracker"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                </svg>
                <span className="leetcode-button-label">LeetCode Tracker</span>
            </button>

            <LeetCodeTracker
                isOpen={isLeetCodeOpen}
                onClose={() => setIsLeetCodeOpen(false)}
                leetcodeTasks={leetcodeTasks}
                onToggleTask={handleLeetCodeToggle}
                onUpdateCount={handleLeetCodeCountUpdate}
                leetcodeStreak={calculateLeetCodeStreak}
            />
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
