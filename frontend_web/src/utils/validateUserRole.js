import axios from 'axios';

const validateUserRole = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) return false;

    try {
        const response = await axios.get('https://it342-lemsliteteachers.onrender.com/user/role', {
            headers: { "Authorization": `Bearer ${jwtToken}` },
        });
        const serverRole = response.data.role;
        const localRole = localStorage.getItem("userRole");

        return serverRole === localRole;
    } catch (error) {
        console.error("Error validating user role:", error);
        return false;
    }
};

export default validateUserRole;