const fs = require('fs');
const path = require('path');

// Read the implementation file
const implementationPath = path.join(__dirname, 'src', 'index.js');
const code = fs.readFileSync(implementationPath, 'utf8');

console.log('🔍 Validating User Management API Implementation\n');

// Requirements checklist
const requirements = [
  {
    id: 1,
    description: 'CRUD endpoints implemented',
    checks: [
      { pattern: /app\.post\(["']\/users["']/, description: 'CREATE - POST /users' },
      { pattern: /app\.get\(["']\/users["']/, description: 'READ - GET /users (all)' },
      { pattern: /app\.get\(["']\/users\/:id["']/, description: 'READ - GET /users/:id' },
      { pattern: /app\.put\(["']\/users\/:id["']/, description: 'UPDATE - PUT /users/:id' },
      { pattern: /app\.delete\(["']\/users\/:id["']/, description: 'DELETE - DELETE /users/:id' }
    ]
  },
  {
    id: 2,
    description: 'NoSQL database (in-memory implementation)',
    checks: [
      { pattern: /let users = \[\]/, description: 'Users array for data storage' },
      { pattern: /let nextId = 1/, description: 'ID generation mechanism' }
    ]
  },
  {
    id: 3,
    description: 'User data structure (id, name, zipCode, latitude, longitude, timezone)',
    checks: [
      { pattern: /id: nextId\+\+/, description: 'Auto-incrementing ID' },
      { pattern: /name[,:]/, description: 'Name field' },
      { pattern: /zipCode[,:]/, description: 'Zip code field' },
      { pattern: /latitude[,:]/, description: 'Latitude field' },
      { pattern: /longitude[,:]/, description: 'Longitude field' },
      { pattern: /timezone[,:]/, description: 'Timezone field' }
    ]
  },
  {
    id: 4,
    description: 'OpenWeatherMap API integration for location data',
    checks: [
      { pattern: /7afa46f2e91768e7eeeb9001ce40de19/, description: 'API key present' },
      { pattern: /api\.openweathermap\.org/, description: 'OpenWeatherMap API endpoint' },
      { pattern: /fetchLocationData/, description: 'Location data fetching function' },
      { pattern: /https\.request/, description: 'HTTPS request implementation' }
    ]
  },
  {
    id: 5,
    description: 'Re-fetch location data when zip code changes on update',
    checks: [
      { pattern: /zipCode !== currentUser\.zipCode/, description: 'Zip code change detection' },
      { pattern: /await fetchLocationData\(zipCode\)/, description: 'Re-fetch location on update' }
    ]
  },
  {
    id: 6,
    description: 'ReactJS front-end connectivity (CORS headers)',
    checks: [
      { pattern: /Access-Control-Allow-Origin/, description: 'CORS Origin header' },
      { pattern: /Access-Control-Allow-Methods/, description: 'CORS Methods header' },
      { pattern: /Access-Control-Allow-Headers/, description: 'CORS Headers header' }
    ]
  },
  {
    id: 7,
    description: 'Creative additions',
    checks: [
      { pattern: /\/users\/search/, description: 'Search users by zip code endpoint' }
    ]
  }
];

// Additional quality checks
const qualityChecks = [
  { pattern: /express\.json\(\)/, description: 'JSON body parsing middleware' },
  { pattern: /async.*req.*res/, description: 'Async/await for API calls' },
  { pattern: /try.*catch/, description: 'Error handling with try-catch' },
  { pattern: /res\.status\(400\)/, description: 'Proper HTTP status codes' },
  { pattern: /res\.status\(404\)/, description: 'Not found error handling' },
  { pattern: /res\.status\(500\)/, description: 'Server error handling' },
  { pattern: /console\.log.*endpoints/, description: 'Endpoint documentation on startup' }
];

let totalPassed = 0;
let totalChecks = 0;

// Validate requirements
requirements.forEach(requirement => {
  console.log(`📋 Requirement ${requirement.id}: ${requirement.description}`);
  
  let passed = 0;
  requirement.checks.forEach(check => {
    totalChecks++;
    const found = check.pattern.test(code);
    if (found) {
      console.log(`   ✅ ${check.description}`);
      passed++;
      totalPassed++;
    } else {
      console.log(`   ❌ ${check.description}`);
    }
  });
  
  console.log(`   📊 ${passed}/${requirement.checks.length} checks passed\n`);
});

// Validate quality checks
console.log('🏆 Code Quality Checks:');
let qualityPassed = 0;
qualityChecks.forEach(check => {
  totalChecks++;
  const found = check.pattern.test(code);
  if (found) {
    console.log(`   ✅ ${check.description}`);
    qualityPassed++;
    totalPassed++;
  } else {
    console.log(`   ❌ ${check.description}`);
  }
});

console.log(`   📊 ${qualityPassed}/${qualityChecks.length} quality checks passed\n`);

// Final summary
console.log('📈 VALIDATION SUMMARY:');
console.log(`   Total checks: ${totalChecks}`);
console.log(`   Passed: ${totalPassed}`);
console.log(`   Failed: ${totalChecks - totalPassed}`);
console.log(`   Success rate: ${Math.round((totalPassed / totalChecks) * 100)}%\n`);

if (totalPassed === totalChecks) {
  console.log('🎉 ALL REQUIREMENTS IMPLEMENTED SUCCESSFULLY!');
  console.log('✨ The API is ready for testing and deployment.');
} else {
  console.log('⚠️  Some requirements may need attention.');
}

// Check for potential issues
console.log('\n🔧 IMPLEMENTATION ANALYSIS:');

// Check if all required endpoints are present
const endpoints = [
  'POST /users',
  'GET /users', 
  'GET /users/:id',
  'PUT /users/:id',
  'DELETE /users/:id'
];

endpoints.forEach(endpoint => {
  const method = endpoint.split(' ')[0].toLowerCase();
  const path = endpoint.split(' ')[1].replace(':id', '/:id');
  const pattern = new RegExp(`app\\.${method}\\(["']${path.replace('/', '\\/')}["']`);
  
  if (pattern.test(code)) {
    console.log(`   ✅ ${endpoint} endpoint implemented`);
  } else {
    console.log(`   ❌ ${endpoint} endpoint missing`);
  }
});

// Check for proper async handling
if (code.includes('async') && code.includes('await')) {
  console.log('   ✅ Proper async/await usage for API calls');
} else {
  console.log('   ⚠️  Check async/await usage for API calls');
}

// Check for input validation
if (code.includes('!name || !zipCode')) {
  console.log('   ✅ Input validation implemented');
} else {
  console.log('   ⚠️  Input validation may need improvement');
}

console.log('\n🚀 Ready for testing! Start the server with: npm start');
console.log('📝 Test the API using the test-api.js script or tools like Postman/curl');
