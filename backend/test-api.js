const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : null;
          resolve({
            statusCode: res.statusCode,
            data: parsedData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testAPI() {
  console.log('🧪 Starting API Tests...\n');
  
  const baseOptions = {
    hostname: 'localhost',
    port: 8080,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    // Test 1: Root endpoint
    console.log('1️⃣ Testing root endpoint (GET /)');
    const rootResponse = await makeRequest({
      ...baseOptions,
      path: '/',
      method: 'GET'
    });
    console.log(`   Status: ${rootResponse.statusCode}`);
    console.log(`   Response: ${rootResponse.data}\n`);

    // Test 2: Create user with valid zip code
    console.log('2️⃣ Testing create user (POST /users)');
    const createResponse = await makeRequest({
      ...baseOptions,
      path: '/users',
      method: 'POST'
    }, {
      name: 'John Doe',
      zipCode: '10001' // New York zip code
    });
    console.log(`   Status: ${createResponse.statusCode}`);
    console.log(`   Response:`, createResponse.data);
    
    const userId = createResponse.data?.id;
    console.log(`   Created user ID: ${userId}\n`);

    // Test 3: Get all users
    console.log('3️⃣ Testing get all users (GET /users)');
    const getAllResponse = await makeRequest({
      ...baseOptions,
      path: '/users',
      method: 'GET'
    });
    console.log(`   Status: ${getAllResponse.statusCode}`);
    console.log(`   Users count: ${getAllResponse.data?.length || 0}`);
    console.log(`   Users:`, getAllResponse.data);
    console.log();

    // Test 4: Get user by ID
    if (userId) {
      console.log('4️⃣ Testing get user by ID (GET /users/:id)');
      const getUserResponse = await makeRequest({
        ...baseOptions,
        path: `/users/${userId}`,
        method: 'GET'
      });
      console.log(`   Status: ${getUserResponse.statusCode}`);
      console.log(`   User:`, getUserResponse.data);
      console.log();
    }

    // Test 5: Update user
    if (userId) {
      console.log('5️⃣ Testing update user (PUT /users/:id)');
      const updateResponse = await makeRequest({
        ...baseOptions,
        path: `/users/${userId}`,
        method: 'PUT'
      }, {
        name: 'Jane Doe',
        zipCode: '90210' // Beverly Hills zip code
      });
      console.log(`   Status: ${updateResponse.statusCode}`);
      console.log(`   Updated user:`, updateResponse.data);
      console.log();
    }

    // Test 6: Search users by zip code
    console.log('6️⃣ Testing search users by zip code (GET /users/search)');
    const searchResponse = await makeRequest({
      ...baseOptions,
      path: '/users/search?zip=90210',
      method: 'GET'
    });
    console.log(`   Status: ${searchResponse.statusCode}`);
    console.log(`   Search results:`, searchResponse.data);
    console.log();

    // Test 7: Error handling - invalid zip code
    console.log('7️⃣ Testing error handling - invalid zip code');
    const errorResponse = await makeRequest({
      ...baseOptions,
      path: '/users',
      method: 'POST'
    }, {
      name: 'Test User',
      zipCode: 'INVALID'
    });
    console.log(`   Status: ${errorResponse.statusCode}`);
    console.log(`   Error response:`, errorResponse.data);
    console.log();

    // Test 8: Error handling - missing required fields
    console.log('8️⃣ Testing error handling - missing required fields');
    const missingFieldsResponse = await makeRequest({
      ...baseOptions,
      path: '/users',
      method: 'POST'
    }, {
      name: 'Test User'
      // Missing zipCode
    });
    console.log(`   Status: ${missingFieldsResponse.statusCode}`);
    console.log(`   Error response:`, missingFieldsResponse.data);
    console.log();

    // Test 9: Delete user
    if (userId) {
      console.log('9️⃣ Testing delete user (DELETE /users/:id)');
      const deleteResponse = await makeRequest({
        ...baseOptions,
        path: `/users/${userId}`,
        method: 'DELETE'
      });
      console.log(`   Status: ${deleteResponse.statusCode}`);
      console.log(`   Delete response:`, deleteResponse.data);
      console.log();
    }

    console.log('✅ All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 8080');
      console.log('   Run: npm start');
    }
  }
}

// Run tests
testAPI();
