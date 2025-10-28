# Clippy Test App

A Node.js/Express playground to reproduce bug.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```bash
curl --location 'http://localhost:3001/health'
```

### Concurrency Testing Endpoints

#### 1. Unawaited Async (Missing await)
**Endpoint:** `POST /concurrency/unawaited-async`

This endpoint demonstrates the classic "unawaited async" bug where a Promise is not awaited, causing type mismatches.

```bash
curl --location 'http://localhost:3001/concurrency/unawaited-async' \
--header 'Content-Type: application/json' \
--data '{"userId": "user1", "amount": 100}'
```

**Expected Error:** `Error: Error in newBalance` - The function returns a Promise instead of a number.

**Fix:** Add `await` before `updateUserBalance(userId, amount)` on line 47.

#### 2. Deadlock Demo
**Endpoint:** `POST /concurrency/deadlock`

This endpoint demonstrates deadlock scenarios with resource locking.

```bash
curl --location 'http://localhost:3001/concurrency/deadlock' \
--header 'Content-Type: application/json' \
--data '{"userId1": "user1", "userId2": "user2"}'
```

**Expected Behavior:** May cause deadlock or timeout depending on timing.

#### 3. Promise Rejection Handling
**Endpoint:** `GET /concurrency/promise-rejection`

This endpoint demonstrates unhandled promise rejections.

```bash
curl --location 'http://localhost:3001/concurrency/promise-rejection'
```

## Contributing

This is a test application for reproducing various bug patterns. Feel free to add more test scenarios or improve existing ones.
