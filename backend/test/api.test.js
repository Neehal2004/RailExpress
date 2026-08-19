/**
 * Automated Backend Test Suite for RailExpress API
 * Tests validation, authentication, status codes, error handling, concurrency, and privacy guards.
 */

let BASE_URL = 'http://127.0.0.1:5000';

async function findActivePort() {
  const candidatePorts = [5000, 5001, 5002, 5003];
  for (const port of candidatePorts) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      if (res.ok) {
        BASE_URL = `http://127.0.0.1:${port}`;
        console.log(`[Test Runner] Connected to RailExpress Server on ${BASE_URL}\n`);
        return true;
      }
    } catch (e) {
      // try next port
    }
  }
  throw new Error('Could not find active RailExpress server on ports 5000-5003');
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const fetchOptions = {
    method: options.method || 'GET',
    headers
  };
  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  return { status: res.status, headers: res.headers, data };
}

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    failed++;
  }
}

async function runTests() {
  console.log('======================================================');
  console.log('🧪 RUNNING RAILEXPRESS BACKEND API TEST SUITE');
  console.log('======================================================\n');

  try {
    await findActivePort();

    // 1. Health check & security headers (Database host NOT exposed publicly)
    console.log('1. Testing Root Endpoint & Security Headers:');
    const health = await request('/');
    assert(health.status === 200, 'GET / returns HTTP 200', `Status: ${health.status}`);
    assert(health.headers.get('x-content-type-options') === 'nosniff', 'Security header X-Content-Type-Options is nosniff');
    assert(health.data?.success === true, 'Response contains success: true');
    assert(!health.data?.connectedHost, 'Root endpoint does NOT expose database host');

    // 2. Input Validation on Registration & Role Escalation Prevention
    console.log('\n2. Testing Input Validation & Role Escalation Guard:');
    const invalidReg = await request('/api/auth/register', {
      method: 'POST',
      body: { name: 'A', email: 'invalid-email', phone: '123', password: '123' }
    });
    assert(invalidReg.status === 400, 'Invalid registration payload returns HTTP 400', `Status: ${invalidReg.status}`);

    const adminRegAttempt = await request('/api/auth/register', {
      method: 'POST',
      body: { name: 'Hacker', email: `hacker_${Date.now()}@example.com`, phone: '9876543210', password: 'Password123', role: 'admin' }
    });
    assert(adminRegAttempt.status === 400, "Registration with role: 'admin' rejected with HTTP 400", `Status: ${adminRegAttempt.status}`);

    // 3. User Login (Valid Passenger Credentials)
    console.log('\n3. Testing Authentication (Passenger Login):');
    const passLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'john@example.com', password: 'User@123' }
    });
    assert(passLogin.status === 200, 'Valid passenger login returns HTTP 200', `Status: ${passLogin.status}`);
    assert(!!passLogin.data?.token, 'Login returns JWT token');
    const passengerToken = passLogin.data?.token;

    // 4. Invalid Login Credentials
    console.log('\n4. Testing Authentication (Invalid Credentials):');
    const badLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'john@example.com', password: 'WrongPassword' }
    });
    assert(badLogin.status === 401, 'Invalid password returns HTTP 401', `Status: ${badLogin.status}`);

    // 5. Admin Login
    console.log('\n5. Testing Admin Authentication:');
    const adminLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@railway.com', password: 'Admin@123' }
    });
    assert(adminLogin.status === 200, 'Admin login returns HTTP 200', `Status: ${adminLogin.status}`);
    assert(adminLogin.data?.role === 'admin', 'Admin login returns role: admin');
    const adminToken = adminLogin.data?.token;

    // 6. Train Search & Schedules (Strict non-empty check without fallback)
    console.log('\n6. Testing Train Search & Schedules:');
    const trainsRes = await request('/api/trains?source=New+Delhi&destination=Mumbai');
    assert(trainsRes.status === 200, 'GET /api/trains returns HTTP 200', `Status: ${trainsRes.status}`);
    assert(Array.isArray(trainsRes.data?.trains), 'trains field is an array');
    assert(Array.isArray(trainsRes.data?.stations), 'stations field is an array');
    assert(trainsRes.data?.trains?.length > 0, 'train search returned active trains without fallback');
    const testTrain = trainsRes.data.trains[0];

    // 7. Booking Security (Missing Token)
    console.log('\n7. Testing Booking Security (Missing Token):');
    const noTokenBooking = await request('/api/bookings', {
      method: 'POST',
      body: { trainId: testTrain._id, travelDate: '2026-12-01', classType: '3A', passengers: [] }
    });
    assert(noTokenBooking.status === 401, 'Unauthenticated booking attempt returns HTTP 401', `Status: ${noTokenBooking.status}`);

    // 8. Null, Primitive & Malformed Passenger Guards
    console.log('\n8. Testing Null & Non-Object Passenger Guards:');
    const nullPassengerBooking = await request('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: {
        trainId: testTrain._id,
        travelDate: '2026-12-01',
        classType: '3A',
        passengers: [null]
      }
    });
    assert(nullPassengerBooking.status === 400, 'Null passenger entry rejected with HTTP 400', `Status: ${nullPassengerBooking.status}`);

    const primitivePassengerBooking = await request('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: {
        trainId: testTrain._id,
        travelDate: '2026-12-01',
        classType: '3A',
        passengers: ['Jane Doe', 25]
      }
    });
    assert(primitivePassengerBooking.status === 400, 'Primitive non-object passenger rejected with HTTP 400', `Status: ${primitivePassengerBooking.status}`);

    const malformedPassengerBooking = await request('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: {
        trainId: testTrain._id,
        travelDate: '2026-12-01',
        classType: '3A',
        passengers: [{ name: '', age: 'invalid' }]
      }
    });
    assert(malformedPassengerBooking.status === 400, 'Malformed passenger details rejected with HTTP 400', `Status: ${malformedPassengerBooking.status}`);

    // 9. Timezone-Safe Date Validation (Past Rejected, Future Allowed)
    console.log('\n9. Testing Timezone-Safe Date Validation:');
    const pastDateBooking = await request('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: {
        trainId: testTrain._id,
        travelDate: '2020-01-01',
        classType: '3A',
        passengers: [{ name: 'Test User', age: 25, gender: 'Male' }]
      }
    });
    assert(pastDateBooking.status === 400, 'Past journey date returns HTTP 400', `Status: ${pastDateBooking.status}`);

    // 10. Successful Ticket Booking Flow
    console.log('\n10. Testing Successful Ticket Booking:');
    const tomorrow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    const bookingRes = await request('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: {
        trainId: testTrain._id,
        travelDate: tomorrow,
        classType: '3A',
        passengers: [{ name: 'Alice Smith', age: 30, gender: 'Female', berth: 'Lower' }],
        paymentMethod: 'UPI'
      }
    });
    assert(bookingRes.status === 201, 'Valid booking returns HTTP 201 Created', `Status: ${bookingRes.status}`);
    assert(!!bookingRes.data?.booking?.pnr, 'Created booking contains valid PNR');
    const testPnr = bookingRes.data?.booking?.pnr;

    // 11. Public PNR Privacy Protection (Strictly Redacted Payload)
    console.log('\n11. Testing Public PNR Privacy Protection:');
    if (testPnr) {
      const pnrRes = await request(`/api/bookings/pnr/${testPnr}`);
      assert(pnrRes.status === 200, 'GET /api/bookings/pnr/:pnr returns HTTP 200', `Status: ${pnrRes.status}`);
      assert(pnrRes.data?.booking?.pnr === testPnr, 'PNR matches requested booking');
      assert(!pnrRes.data?.userId, 'Public PNR lookup does NOT leak top-level userId');
      assert(!pnrRes.data?.booking?.userId?.email, 'Public PNR lookup does NOT leak passenger email');
      assert(!pnrRes.data?.booking?.userId?.phone, 'Public PNR lookup does NOT leak passenger phone');
    }

    // 12. Role Authorization Guard (Passenger accessing Admin Route)
    console.log('\n12. Testing Role Authorization Guard:');
    const forbiddenAdmin = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${passengerToken}` }
    });
    assert(forbiddenAdmin.status === 403, 'Passenger accessing admin endpoint returns HTTP 403 Forbidden', `Status: ${forbiddenAdmin.status}`);

    // 13. Admin Dashboard & Password Sanitization
    console.log('\n13. Testing Admin Dashboard & Security Sanitization:');
    const adminStats = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminStats.status === 200, 'Admin accessing admin stats returns HTTP 200', `Status: ${adminStats.status}`);
    assert(typeof adminStats.data?.totalRevenue === 'number', 'Admin stats contains totalRevenue number');
    assert(Array.isArray(adminStats.data?.recentBookings), 'recentBookings is an array');
    assert(adminStats.data?.recentBookings?.length <= 10, 'recentBookings length is capped at 10');

    const hasPasswordLeak = adminStats.data?.recentBookings?.some(
      (b) => b.userId && (b.userId.password || b.userId.passwordHash)
    );
    assert(!hasPasswordLeak, 'recentBookings does NOT leak user password or passwordHash');

    // 14. Admin Train Update Field Whitelisting
    console.log('\n14. Testing Admin Train Update:');
    const trainUpdateRes = await request(`/api/trains/${testTrain._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        distanceKm: 1400,
        unauthorizedInjectedField: 'malicious'
      }
    });
    assert(trainUpdateRes.status === 200, 'Train update returns HTTP 200', `Status: ${trainUpdateRes.status}`);
    assert(Number(trainUpdateRes.data?.distanceKm) === 1400, 'Train distanceKm was updated to 1400');
    assert(!trainUpdateRes.data?.unauthorizedInjectedField, 'Unauthorized field was not accepted on train update');

    // 15. Ticket Cancellation Flow
    console.log('\n15. Testing Ticket Cancellation:');
    if (testPnr) {
      const cancelRes = await request(`/api/bookings/cancel/${testPnr}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${passengerToken}` }
      });
      assert(cancelRes.status === 200, 'Ticket cancellation returns HTTP 200', `Status: ${cancelRes.status}`);
      assert(cancelRes.data?.booking?.status === 'Cancelled', 'Booking status updated to Cancelled');
    }

    // 16. 404 Route Not Found
    console.log('\n16. Testing 404 Route Not Found:');
    const notFoundRes = await request('/api/nonexistent-route-12345');
    assert(notFoundRes.status === 404, 'Undefined route returns HTTP 404', `Status: ${notFoundRes.status}`);
    assert(notFoundRes.data?.success === false, '404 returns success: false');

    console.log('\n======================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
