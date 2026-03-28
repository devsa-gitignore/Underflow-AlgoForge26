import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const testAdminEndpoints = async () => {
  console.log('🚀 Testing Admin Heatmap Endpoints\n');

  try {
    // Test 1: Get heatmap data
    console.log('=== TEST 1: Get Heatmap Data ===');
    const heatmapResponse = await axios.get(`${BASE_URL}/admin/heatmap-data`);
    console.log('✓ SUCCESS');
    console.log(`  Total villages: ${heatmapResponse.data.summary.totalVillages}`);
    console.log(`  Total cases: ${heatmapResponse.data.summary.totalCases}`);
    console.log(`  Total high-risk: ${heatmapResponse.data.summary.totalHighRisk}`);
    console.log(`  Average severity: ${(heatmapResponse.data.summary.averageSeverity * 100).toFixed(1)}%\n`);

    if (heatmapResponse.data.data.length > 0) {
      const firstVillage = heatmapResponse.data.data[0];
      console.log(`  Top village: ${firstVillage.village}`);
      console.log(`    - Cases: ${firstVillage.totalCases}`);
      console.log(`    - High-risk: ${firstVillage.highRiskCount}`);
      console.log(`    - Severity score: ${(firstVillage.severityScore * 100).toFixed(1)}%\n`);

      // Test 2: Get village details
      console.log('=== TEST 2: Get Village Details ===');
      const villageResponse = await axios.get(
        `${BASE_URL}/admin/village-details/${firstVillage.village}`
      );
      console.log('✓ SUCCESS');
      console.log(`  Village: ${villageResponse.data.village}`);
      console.log(`  Total: ${villageResponse.data.summary.total}`);
      console.log(`  High-risk: ${villageResponse.data.summary.highRisk}`);
      console.log(`  Moderate: ${villageResponse.data.summary.moderateRisk}`);
      console.log(`  Low: ${villageResponse.data.summary.lowRisk}`);
      console.log(`  Patient count in details: ${villageResponse.data.patients.length}\n`);
    }

    console.log('✅ All admin endpoints working!\n');
  } catch (error) {
    console.error('✗ FAILED');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Error: ${error.response.data.message || error.response.statusText}`);
    } else {
      console.error(`  Error: ${error.message}`);
    }
  }

  process.exit(0);
};

testAdminEndpoints();
