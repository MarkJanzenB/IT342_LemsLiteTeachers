import { jwtDecode } from "jwt-decode";

const jwtDecoder = () => {
    const jwt = localStorage.getItem("jwtToken");
    const decodedToken = jwtDecode(jwt);

    return decodedToken;
}

export const isJWTExpired = () => {
    const decodedToken = jwtDecoder();
    const currentDate = new Date();
    
    return currentDate.getTime() >= decodedToken.exp * 1000;
}

export const getJWTSub = () => {
    const decodedToken = jwtDecoder();
    
    return decodedToken.sub;
}

export const getJWTRoleId = () => {
    const decodedToken = jwtDecoder();

    return decodedToken.role_id;
}

export const getJWTFName = () => {
    const decodedToken = jwtDecoder();

    return decodedToken.first_name;
}

export const getJWTFullName = () => {
    const decodedToken = jwtDecoder();

    return decodedToken.full_name;
}

// This code will return true if the user's role_id matches the expected role ID, and false otherwise.
export const checkUserRole = (expectedRoleId) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
        console.error("JWT token not found");
        return false;
    }

    const decodedToken = jwtDecode(jwtToken);
    return decodedToken.role_id === expectedRoleId;
};

// Usage example:
export const isUserRole1 = checkUserRole(1);
console.log("Is user role 1?", isUserRole1);

export const getJWTUid = () => {
    const decodedToken = jwtDecoder();

    return decodedToken.uid;
}

// Add this function to get instiId from the JWT
export const getJWTInstiId = () => {
    const decodedToken = jwtDecoder();
    return decodedToken?.sub || null;
}