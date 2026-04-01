import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

async function testStats() {
  try {
    const res = await axios.get(`${API_URL}/admin/stats`);
    console.log('STATS RESPONSE:', JSON.stringify(res.data, null, 2));
    if (res.data.total !== undefined) {
      console.log('✅ BACKEND STATS API IS WORKING');
    } else {
      console.log('❌ BACKEND STATS API RETURNED INVALID DATA');
    }
  } catch (error) {
    console.error('❌ BACKEND STATS API ERROR:', error.response?.data || error.message);
  }
}

testStats();
