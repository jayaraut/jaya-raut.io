/**
 * SignIn Component
 * Authentication UI for admin access
 */
function SignIn({ isOpen, onClose, onSignIn }) {
    const { useState } = React;
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!email) {
            setError('Please enter your email');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!password) {
            setError('Please enter your password');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await auth.signInWithEmailAndPassword(email, password);
            setEmail('');
            setPassword('');
            setError('');
            onSignIn();
            onClose();
        } catch (err) {
            console.error('Sign in error:', err);
            console.error('Error code:', err.code);
            console.error('Error message:', err.message);
            
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('❌ No account found with this email. Please create an account in Firebase Console first.');
                    break;
                case 'auth/wrong-password':
                    setError('❌ Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    setError('❌ Invalid email address format.');
                    break;
                case 'auth/too-many-requests':
                    setError('❌ Too many failed attempts. Please wait a few minutes and try again.');
                    break;
                case 'auth/invalid-credential':
                    setError('❌ Invalid credentials. Make sure you created this account in Firebase Console.');
                    break;
                case 'auth/configuration-not-found':
                    setError('❌ Email/Password authentication not enabled. Enable it in Firebase Console → Authentication → Sign-in method.');
                    break;
                default:
                    setError(`❌ Sign in failed: ${err.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setPassword('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="signin-overlay" onClick={handleClose}>
            <div className="signin-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="signin-header">
                    <h2>Admin Access</h2>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>

                <div className="signin-content">
                    <p className="signin-description">
                        Sign in to manage your portfolio
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="signin-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="signin-footer">
                        Viewing only? No sign-in needed
                    </div>
                </div>
            </div>
        </div>
    );
}
