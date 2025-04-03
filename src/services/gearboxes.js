import axios from "axios";


export const getGearboxes = async () => {
    try {
        const response = await axios.get('http://localhost:8081/api/v1/gearbox/getAll');
        return response.data;  //  This returns actual data
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Handle error gracefully
    }
};

export const calculateGearboxSpeeds = async (gearbox) => {
    try {
        const response = await axios.post("http://localhost:8081/api/v1/gearbox/calculateSpeeds", gearbox);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        return null;
    }
};
