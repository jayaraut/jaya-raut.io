/**
 * Header Component
 * Displays the portfolio header with profile image, name, and streak
 * 
 * @param {string} profileImage - URL or path to profile image
 * @param {number} streak - Current streak count
 * @param {number} totalScore - Total points earned
 */
function Header({ profileImage, streak, totalScore }) {
    return (
        <div className="header">
            <div className="profile-section">
                <div className="profile-image-container">
                    {profileImage ? (
                        <img src={profileImage} alt="Jaya Raut" className="profile-image" />
                    ) : (
                        <div className="profile-placeholder">JR</div>
                    )}
                </div>
                <div className="profile-info">
                    <h1>Jaya Raut</h1>
                    <p>Day Planner & Task Tracker</p>
                </div>
            </div>
            <div className="stats-section">
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <div className="stat-value">{streak}</div>
                        <div className="stat-label">Day Streak</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                        <div className="stat-value">{totalScore}</div>
                        <div className="stat-label">Total Points</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
