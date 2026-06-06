import axios from 'axios';

// Endpoint AI
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
      happy: (checkinData.skor_kebahagiaan || 5) / 2,
      social: (checkinData.interaksi_sosial || 5) / 2,
      work: checkinData.waktu_kerja || 0,
      age: userData.age || 25,
      
      // Gender
      gender_female: userData.gender === 'FEMALE' ? 1 : 0,
      gender_male: userData.gender === 'MALE' ? 1 : 0,
      gender_other: 0,

      // Diet 
      diet_balanced: 0,
      diet_junk: 0,
      diet_keto: 0,
      diet_vegan: 0,
      diet_veg: 0,
      
      // Mental Health History 
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
    return response.data; 
  },
};

// Helper to convert categorical exercise to numeric (Integer as required by model)
const mapExerciseToNumeric = (level) => {
  switch (level) {
    case 'Rutin': return 1;
    case 'Kadang-kadang': return 1;
    case 'Tidak Ada':
    case 'Tidak Pernah': return 0;
    default: return 0;
  }
};

export default aiService;
