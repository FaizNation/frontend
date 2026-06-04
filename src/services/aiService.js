import axios from 'axios';

// Ensure no trailing slash to avoid double slashes in endpoints
const AI_BASE_URL = import.meta.env.PROD 
  ? '/api-ai' 
  : (import.meta.env.VITE_AI_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

const aiService = {
  predictStress: async (userData, checkinData) => {
    // Wrapper to map internal parameters to AI model parameters
    const payload = {
      // Primary Metrics
      screen: checkinData.screen_time || 0,
      sleep: checkinData.waktu_tidur || 0,
      exercise: mapExerciseToNumeric(checkinData.tingkat_olahraga),
      happy: (checkinData.skor_kebahagiaan || 5) / 2, // Map 1-10 to 0.5-5.0
      social: (checkinData.interaksi_sosial || 5) / 2, // Map 1-10 to 0.5-5.0
      work: checkinData.waktu_kerja || 0,
      age: userData.age || 25,
      
      // Gender One-Hot (Now including Other)
      gender_female: userData.gender === 'FEMALE' ? 1 : 0,
      gender_male: userData.gender === 'MALE' ? 1 : 0,
      gender_other: 0, // Default zero as not yet supported in Profile
      
      // Diet One-Hot (Auto fill with 0)
      diet_balanced: 0,
      diet_junk: 0,
      diet_keto: 0,
      diet_vegan: 0,
      diet_veg: 0,
      
      // Mental Health History One-Hot (Auto fill with 0)
      mh_anxiety: 0,
      mh_bipolar: 0,
      mh_depress: 0,
      mh_ptsd: 0
    };

    const response = await axios.post(`${AI_BASE_URL}/predict`, payload);
    return response.data;
  },

  chat: async (message, stressLevel, recommendations) => {
    const payload = {
      user_message: message,
      stress_level: stressLevel || 'Unknown',
      recommendations: recommendations || [],
    };
    const response = await axios.post(`${AI_BASE_URL}/chat`, payload);
    return response.data; // Response is a direct string as per requirement
  },
};

// Helper to convert categorical exercise to numeric (Integer as required by model)
const mapExerciseToNumeric = (level) => {
  switch (level) {
    case 'Rutin': return 1;
    case 'Kadang-kadang': return 1; // Treat occasional as active if model requires int 0/1
    case 'Tidak Ada':
    case 'Tidak Pernah': return 0;
    default: return 0;
  }
};

export default aiService;
