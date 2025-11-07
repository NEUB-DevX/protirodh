export const convertToJson = (data) => {
    try {
        // If data is already an object, stringify it first
        let stringData = typeof data === 'object' ? JSON.stringify(data) : data;

        // Remove code block markers and clean up the string
        stringData = stringData
            .replace(/```json\n?/g, '')  // Remove ```json and any following newline
            .replace(/```\n?/g, '')      // Remove ``` and any following newline
            .replace(/^\s+|\s+$/g, '');  // Trim whitespace from both ends

        // Parse the cleaned string
        return JSON.parse(stringData);
    } catch (error) {
        console.error('Error converting to JSON:', error);
        console.error('Raw data:', data);
        throw error;
    }
}
