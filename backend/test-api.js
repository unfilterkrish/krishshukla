/**
 * End-to-End API Automated Test Runner
 * Validates authentication, prompt management, stats, filtering, and AI services.
 */
const http = require('http');

// Wait for server to be up
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const request = (options, data = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('--- Starting Prompt Vault AI End-to-End API Verification ---');
  
  // Start server
  process.env.PORT = 5050;
  process.env.JWT_SECRET = 'test_secret_key_12345';
  process.env.NODE_ENV = 'test';
  
  const app = require('./server');
  await delay(2000); // Allow Mongo / MongoMemoryServer to connect

  const baseOptions = {
    hostname: '127.0.0.1',
    port: 5050,
    headers: { 'Content-Type': 'application/json' },
  };

  let token = '';
  let userId = '';
  let createdPromptId = '';

  try {
    // 1. Health check
    console.log('\n[TEST 1] GET /api/health');
    const health = await request({ ...baseOptions, path: '/api/health', method: 'GET' });
    console.log('Result:', health.status, health.data);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Register user
    console.log('\n[TEST 2] POST /api/auth/register');
    const testEmail = `tester_${Date.now()}@promptvault.ai`;
    const regRes = await request(
      { ...baseOptions, path: '/api/auth/register', method: 'POST' },
      { name: 'Alex Test', email: testEmail, password: 'password123' }
    );
    console.log('Result:', regRes.status, regRes.data.message, regRes.data.user);
    if (regRes.status !== 201 || !regRes.data.token) throw new Error('Registration failed');
    token = regRes.data.token;
    userId = regRes.data.user._id;

    // 3. Login user
    console.log('\n[TEST 3] POST /api/auth/login');
    const loginRes = await request(
      { ...baseOptions, path: '/api/auth/login', method: 'POST' },
      { email: testEmail, password: 'password123' }
    );
    console.log('Result:', loginRes.status, loginRes.data.message);
    if (loginRes.status !== 200 || !loginRes.data.token) throw new Error('Login failed');

    // 4. Current user GET /api/auth/me
    console.log('\n[TEST 4] GET /api/auth/me');
    const meRes = await request({
      ...baseOptions,
      path: '/api/auth/me',
      method: 'GET',
      headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
    });
    console.log('Result:', meRes.status, meRes.data.user?.email);
    if (meRes.status !== 200) throw new Error('Get Me failed');

    // 5. Create Prompt
    console.log('\n[TEST 5] POST /api/prompts');
    const createRes = await request(
      {
        ...baseOptions,
        path: '/api/prompts',
        method: 'POST',
        headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
      },
      {
        title: 'Cinematic Product Photography',
        content: 'Create a cinematic product photograph with dramatic studio lighting, {105mm f/1.4} lens depth of field.',
        category: 'Image Generation',
        aiModel: 'Midjourney',
        tags: ['cinematic', 'product', 'lighting'],
        description: 'Commercial studio render prompt'
      }
    );
    console.log('Result:', createRes.status, createRes.data.prompt?._id, createRes.data.prompt?.title);
    if (createRes.status !== 201 || !createRes.data.prompt?._id) throw new Error('Create prompt failed');
    createdPromptId = createRes.data.prompt._id;

    // 6. Get Prompts
    console.log('\n[TEST 6] GET /api/prompts');
    const getRes = await request({
      ...baseOptions,
      path: '/api/prompts',
      method: 'GET',
      headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
    });
    console.log('Result:', getRes.status, `Found ${getRes.data.count} prompts`);
    if (getRes.status !== 200 || getRes.data.count !== 1) throw new Error('Get prompts failed');

    // 7. Get Prompt by ID
    console.log('\n[TEST 7] GET /api/prompts/:id');
    const getSingleRes = await request({
      ...baseOptions,
      path: `/api/prompts/${createdPromptId}`,
      method: 'GET',
      headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
    });
    console.log('Result:', getSingleRes.status, getSingleRes.data.prompt?.title);
    if (getSingleRes.status !== 200) throw new Error('Get prompt by ID failed');

    // 8. Update Prompt
    console.log('\n[TEST 8] PUT /api/prompts/:id');
    const updateRes = await request(
      {
        ...baseOptions,
        path: `/api/prompts/${createdPromptId}`,
        method: 'PUT',
        headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
      },
      {
        title: 'Cinematic Product Photography (Updated)',
        category: 'Image Generation',
      }
    );
    console.log('Result:', updateRes.status, updateRes.data.prompt?.title);
    if (updateRes.status !== 200 || !updateRes.data.prompt.title.includes('Updated')) {
      throw new Error('Update prompt failed');
    }

    // 9. Toggle Favorite
    console.log('\n[TEST 9] PATCH /api/prompts/:id/favorite');
    const favRes = await request({
      ...baseOptions,
      path: `/api/prompts/${createdPromptId}/favorite`,
      method: 'PATCH',
      headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
    });
    console.log('Result:', favRes.status, 'isFavorite:', favRes.data.isFavorite);
    if (favRes.status !== 200 || favRes.data.isFavorite !== true) throw new Error('Favorite toggle failed');

    // 10. Dashboard Stats
    console.log('\n[TEST 10] GET /api/prompts/stats');
    const statsRes = await request({
      ...baseOptions,
      path: '/api/prompts/stats',
      method: 'GET',
      headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
    });
    console.log('Result:', statsRes.status, statsRes.data.stats);
    if (statsRes.status !== 200 || statsRes.data.stats.totalPrompts !== 1 || statsRes.data.stats.favoritesCount !== 1) {
      throw new Error('Stats endpoint failed');
    }

    // 11. AI Prompt Improver
    console.log('\n[TEST 11] POST /api/ai/improve');
    const aiRes = await request(
      {
        ...baseOptions,
        path: '/api/ai/improve',
        method: 'POST',
        headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
      },
      {
        prompt: 'make a good website for my project',
        category: 'Development',
        aiModel: 'ChatGPT'
      }
    );
    console.log('Result:', aiRes.status, 'Quality Score:', aiRes.data.data?.qualityScore, 'Suggested Title:', aiRes.data.data?.suggestedTitle);
    if (aiRes.status !== 200 || !aiRes.data.data?.improvedPrompt) throw new Error('AI improver failed');

    // 12. Public AI Demo (no auth required)
    console.log('\n[TEST 12] POST /api/ai/demo');
    const demoRes = await request(
      {
        ...baseOptions,
        path: '/api/ai/demo',
        method: 'POST',
      },
      {
        prompt: 'write copy for marketing',
        category: 'Marketing',
        aiModel: 'ChatGPT'
      }
    );
    console.log('Result:', demoRes.status, 'Quality Score:', demoRes.data.data?.qualityScore);
    if (demoRes.status !== 200) throw new Error('AI Demo endpoint failed');

    // 13. Delete Prompt
    console.log('\n[TEST 13] DELETE /api/prompts/:id');
    const deleteRes = await request({
      ...baseOptions,
      path: `/api/prompts/${createdPromptId}`,
      method: 'DELETE',
      headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
    });
    console.log('Result:', deleteRes.status, deleteRes.data.message);
    if (deleteRes.status !== 200) throw new Error('Delete prompt failed');

    // 14. Seed Sample Prompts (when library is 0)
    console.log('\n[TEST 14] POST /api/prompts/seed');
    const seedRes = await request({
      ...baseOptions,
      path: '/api/prompts/seed',
      method: 'POST',
      headers: { ...baseOptions.headers, Authorization: `Bearer ${token}` },
    });
    console.log('Result:', seedRes.status, `Seeded ${seedRes.data.count} prompts`);
    if (seedRes.status !== 201 || seedRes.data.count !== 5) throw new Error('Seed prompts failed');

    console.log('\n🎉 ALL 14 TEST SUITES PASSED FLAWLESSLY! 🎉\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();

