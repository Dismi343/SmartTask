import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import {useApp} from '../context/AppContext';
export default function PasswordResetPage() {
    const { updatePassword } = useApp();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Extracts the token from ?token=xyz
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        // Logic to call your backend POST /api/auth/reset-password
        // using the 'token' and 'password'

        try{
        await updatePassword(token, password);
        console.log("Resetting password with token:", token);
        }
        catch(e){
            console.error("Error resetting password:", e);
        }
       
    };

    if (token) {
        // Render the "Set New Password" form
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>
                    <form className="space-y-4" onSubmit={handleResetSubmit}>
                        <input 
                            type="password" 
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            required 
                        />
                        <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Default: Render the "Request Reset Link" form (Existing code)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
                <form className="space-y-4">
                    <label>Email Address</label>
                    <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
}