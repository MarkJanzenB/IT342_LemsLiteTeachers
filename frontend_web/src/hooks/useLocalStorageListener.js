import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import validateUserRole from '../utils/validateUserRole';

const useLocalStorageListener = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleStorageChange = async (event) => {
            if (event.key === "userRole") {
                const isValid = await validateUserRole();
                if (!isValid) {
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("userRole");
                    navigate('/login');
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [navigate]);
};

export default useLocalStorageListener;