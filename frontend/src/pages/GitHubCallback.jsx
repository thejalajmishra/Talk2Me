import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GitHubCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Get the code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            // Send error to parent window
            if (window.opener) {
                window.opener.postMessage({ type: 'github-oauth-error', error }, window.location.origin);
                window.close();
            } else {
                navigate('/signup');
            }
            return;
        }

        if (code) {
            // Send code to parent window
            if (window.opener) {
                window.opener.postMessage({ type: 'github-oauth-code', code }, window.location.origin);
                window.close();
            } else {
                // If not in popup, redirect to signup
                navigate('/signup');
            }
        } else {
            navigate('/signup');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Processing GitHub login...</p>
            </div>
        </div>
    );
};

export default GitHubCallback;
