import axios from "axios";

export const getCarBrands = async () => {
    try {
        const response = await axios.get('http://localhost:8081/api/v1/gearbox/brands');
        return response.data;
    } catch (error) {
        console.error('Error fetching brands:', error);
        return null;
    }
};

export const getGearboxesByBrand = async (brand) => {
    try {
        const response = await axios.get(`http://localhost:8081/api/v1/gearbox/brand/${brand}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching gearboxes for brand:', error);
        return null;
    }
};

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
        console.error('Error calculating speeds:', error);
        return null;
    }
};
