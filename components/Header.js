/**
 * Header Component
 * Displays the portfolio header with profile image, name, and streak
 * 
 * @param {string} profileImage - URL or path to profile image
 * @param {number} streak - Current streak count
 * @param {number} totalScore - Total points earned
 * @param {Function} onImageUpload - Handler for image upload
 */
function Header({ profileImage, streak, totalScore, onImageUpload, isAdmin, showToast }) {
    const fileInputRef = React.useRef(null);

    const handleImageClick = () => {
        if (!isAdmin) {
            showToast('Please sign in to upload a profile image');
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Confirm before uploading
            const isFirstUpload = !profileImage;
            const message = isFirstUpload 
                ? 'Upload this image as your profile picture? (Type "yes" to confirm)' 
                : 'Replace your current profile picture? (Type "yes" to confirm)';
            
            const confirmation = window.prompt(message);
            if (confirmation?.toLowerCase() !== 'yes') {
                // Reset file input
                e.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                onImageUpload(event.target.result, isFirstUpload ? 'Image uploaded successfully!' : 'New image uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation(); // Prevent triggering the upload click
        
        // Ask for confirmation
        const confirmed = window.confirm('Are you sure you want to remove this image?');
        if (!confirmed) return;
        
        // Ask for password
        const password = window.prompt('Enter password to remove image:');
        if (password === '13031996') {
            onImageUpload(null, 'Image removed successfully!');
        } else if (password !== null) {
            showToast('Incorrect password! Image not removed.');
        }
    };

    return (
        <div className="header">
            <div className="profile-section">
                <div 
                    className="profile-image-container" 
                    onClick={handleImageClick}
                    style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                >
                    {profileImage ? (
                        <>
                            <img src={profileImage} alt="Jaya Raut" className="profile-image" />
                            {isAdmin && (
                                <button className="remove-image-btn" onClick={handleRemoveImage} title="Remove image">✏️</button>
                            )}
                        </>
                    ) : (
                        <img 
                            src="https://ui-avatars.com/api/?name=Jaya+Raut&size=200&background=667eea&color=ffffff&bold=true&font-size=0.4" 
                            alt="Jaya Raut" 
                            className="profile-image" 
                        />
                    )}
                    {isAdmin && <div className="upload-overlay">📷</div>}
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>
                <div className="profile-info">
                    <h1>Jaya Raut</h1>
                    <p>Day Planner & Task Tracker</p>
                    <div className="stats-section">
                        <div className="stat-card">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-value">{streak}</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">⭐</span>
                            <span className="stat-value">{totalScore}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
