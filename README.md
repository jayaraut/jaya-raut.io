# Day Planner - React Application

A comprehensive day planner and task tracker with scoring system and streak tracking built with React.

## 🌐 Live Demo

**[View Live Portfolio](https://jayaraut.github.io/jaya-raut.io/)**

## Project Structure

```
Portfolio/
├── index.html              # Main HTML file
├── App.js                  # Root React component
├── README.md              # Project documentation
├── styles/
│   └── main.css           # All CSS styles
└── components/
    ├── Header.js          # Profile header with stats
    └── DayPlanner.js      # Main planner component
```

## Features

✅ **Profile Section**
- Profile image placeholder (with initials)
- Your name displayed prominently
- Space for uploading profile picture

✅ **Streak Tracking**
- Tracks consecutive days of logging tasks
- Visual streak counter with fire emoji 🔥
- Motivates daily task completion

✅ **Scoring System**
- Earn 10 points per completed task
- Daily score tracker
- Total lifetime points accumulation
- Visual progress tracking

✅ **Day Planner**
- Select any date with calendar picker
- View tasks for specific days
- Progress bar showing completion rate
- "What did you do today?" prompt

✅ **Task Management**
- Add tasks for any day
- Click checkbox to mark tasks complete
- Tasks get striked through when done
- Points awarded on completion
- Delete unwanted tasks
- Tasks sorted chronologically

✅ **Visual Feedback**
- Completed tasks turn green
- Strike-through text for done tasks
- Point badges for each task
- Progress indicators
- Smooth animations

## Technology Stack

- **React 18** - Component library
- **CSS3** - Styling (Grid & Flexbox)
- **Vanilla JavaScript** - Logic
- **LocalStorage API** - Data persistence

## Component Architecture

### App.js (Root)
- Manages global state (selectedDate, tasks, profileImage)
- Calculates streak and scores
- Handles all state mutations
- Coordinates between components

### Components
1. **Header** - Profile, name, and statistics display
2. **DayPlanner** - Complete day planning interface with task management

## How to Use

1. Open `index.html` in a web browser
2. Click "Change Date" button to select a different day
3. Type what you did or plan to do in the task input
4. Press "Add Task" or hit Enter to save
5. Click the ○ circle to mark task as complete (earns points!)
6. Click ✓ checkmark to mark incomplete
7. Completed tasks show with strikethrough and green background
8. Watch your streak grow by completing tasks daily!
9. Track your total points in the header

## State Management

- **selectedDate**: Current day being viewed/edited
- **tasks**: Array of task objects with completion status and points
- **profileImage**: Profile picture URL (stored in localStorage)

## Scoring Rules

- Each task = 10 points when completed
- Points only count when task is marked as done
- Day score = sum of completed tasks for that day
- Total score = sum of all completed tasks ever

## Streak Calculation

- Streak counts consecutive days with at least one completed task
- Breaks if you miss a day
- Calculated backwards from today
- Encourages daily engagement

## Future Enhancements

- Upload custom profile picture
- Adjustable points per task
- Task categories with different point values
- Weekly/monthly score summaries
- Export task history
- Task time tracking
- Reminders and notifications
- Dark mode toggle
- Achievement badges

## Browser Compatibility

Works in all modern browsers with ES6 support and localStorage enabled.
