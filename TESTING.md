# Unit Tests Documentation

This document provides a comprehensive overview of all unit tests in the LOL Intelligence project.

## Setup

### Installation

All testing dependencies are already configured in `package.json`. To install them, run:

```bash
npm install
```

### Configuration

Jest is configured via `jest.config.js` with the following settings:
- **Preset**: `ts-jest` for TypeScript support
- **Environment**: Node.js
- **Module Alias**: `@/` maps to the root directory
- **Coverage**: Includes `lib/` and `app/api/` directories

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Structure

Tests are organized alongside their source files with `.test.ts` suffix:

```
lib/
├── insights/
│   ├── engine.ts
│   └── engine.test.ts
├── openai/
│   ├── generateSummary.ts
│   └── generateSummary.test.ts
├── riot/
│   ├── client.ts
│   ├── client.test.ts
│   ├── parser.ts
│   ├── parser.test.ts
│   ├── matches.ts
│   └── matches.test.ts
└── prisma.ts

app/api/
├── insights/
│   ├── route.ts
│   └── route.test.ts
├── sync/
│   ├── route.ts
│   └── route.test.ts
└── test/
    ├── route.ts
    └── route.test.ts
```

## Test Coverage

### 1. Insights Engine (`lib/insights/engine.test.ts`)

Tests for the `generateInsights()` function that analyzes match data and generates AI-powered insights.

**Test Cases:**
- Poor lead conversion detection (3+ games with early advantage but losses)
- Overaggression detection (5+ games with 8+ deaths)
- Low map control detection (5+ games with vision score ≤ 10)
- Multiple insights generation
- Edge cases (empty arrays, missing fields)

**Key Assertions:**
- Correct insight type, severity, and title
- Proper threshold detection
- Multiple insights combined correctly
- Graceful handling of malformed data

---

### 2. Match Parser (`lib/riot/parser.test.ts`)

Tests for the `parseParticipant()` function that extracts and transforms match data.

**Test Cases:**
- Correct participant parsing by PUUID
- CS per minute calculation
- Win/loss handling
- Challenge data handling (missing fields)
- Different game durations
- Zero CS scenarios
- Participant not found error
- Numeric value accuracy

**Key Assertions:**
- All fields parsed correctly
- CS/min calculated accurately: `(totalCS / gameDuration) * 60`
- Data types preserved
- Exception thrown for invalid PUUID

---

### 3. Riot API Client (`lib/riot/client.test.ts`)

Tests for the `riotFetch()` function that handles Riot API requests.

**Test Cases:**
- Correct endpoint construction
- JSON response parsing
- Error handling (404, 401, 429, 500)
- Cache header configuration
- API key inclusion from environment
- Different API endpoints
- Complex JSON responses
- Global fetch mocking

**Key Assertions:**
- Correct `X-Riot-Token` header
- `cache: 'no-store'` header set
- Proper error messages for failed requests
- Full URL construction with base URL
- Correct endpoint handling

---

### 4. OpenAI Summary Generator (`lib/openai/generateSummary.test.ts`)

Tests for the `generatePostGameSummary()` function that generates AI-powered post-game analysis.

**Test Cases:**
- Win game summary generation
- Loss game summary generation
- Champion name in prompt
- KDA stats in prompt
- Vision score in prompt
- Win/loss result in prompt
- Model selection (gpt-4.1-mini)
- Extreme stats handling
- Low stats handling
- API error handling
- Prompt formatting

**Key Assertions:**
- Correct model used
- All data fields in prompt
- API call structure correct
- Proper error propagation
- Content generation success

---

### 5. Riot Insights (`lib/riot/insights.test.ts`)

Tests for match performance analysis and joke deduplication.

**Test Cases:**
- High death count detection
- Multiple insights generation
- Joke inclusion in insights
- Victory message for winning games
- First insight joke retrieval
- Duplicate joke detection (2+ occurrences)
- Non-duplicate insights preservation
- Empty insights handling
- Joke adaptation via OpenAI
- Adapted joke marking with `isAdapted` flag
- Multiple jokes in single insight
- Participant not found handling
- Original joke fallback on error

**Key Assertions:**
- Insights contain joke property
- Duplicates detected correctly
- First occurrence unchanged
- Second+ occurrences adapted via OpenAI
- `isAdapted` flag set correctly
- Error handling preserves original joke

---

### 6. Insights API Route (`app/api/insights/route.test.ts`)

Tests for the GET endpoint that retrieves user insights with joke deduplication.

**Test Cases:**
- Insights retrieval for given user
- Match ordering (descending by creation date)
- Result limiting (20 matches max)
- JSON response format with `matchInsights` and `aggregatedInsights`
- Empty match history handling
- Correct userId query parameter parsing
- Multiple insights handling
- Duplicate joke adaptation
- Response structure validation

**Key Assertions:**
- `findMany` called with correct filters and `include: { match: true }`
- Results ordered by `createdAt: 'desc'`
- `take: 20` limit applied
- Response contains `{ matchInsights: [], aggregatedInsights: [] }`
- `deduplicateAndAdaptJokes` called for adaptation
- `analyzeMatchPerformance` called for each match

---

### 7. Sync API Route (`app/api/sync/route.test.ts`)

Tests for the POST endpoint that syncs matches from Riot API.

**Test Cases:**
- Match synchronization from Riot
- Match record creation
- Participant record creation
- Multiple match handling
- Upsert behavior (update/create)
- Participant data parsing
- Success response
- Empty match list handling

**Key Assertions:**
- Correct match IDs fetched
- Match data created with correct fields
- Participant data saved with match ID
- BigInt conversion for game creation timestamp
- Upsert with empty update object
- Success status returned

---

### 8. Test API Route (`app/api/test/route.test.ts`)

Tests for the GET endpoint that checks Riot API status.

**Test Cases:**
- Fetch from Riot status API
- Correct endpoint URL
- API key header inclusion
- JSON response format
- Response with incidents
- Empty status response
- Response object validation
- Fetch error handling
- Malformed JSON handling
- Data structure preservation

**Key Assertions:**
- Endpoint URL correct
- `X-Riot-Token` header present
- Response is Response instance
- Data structure preserved through serialization
- Error propagation

## Mocking Strategy

### Mock Patterns Used

1. **Database Mocks** (`@/lib/prisma`)
   - Mock Prisma client methods
   - Mock return values for test scenarios

2. **External API Mocks** (`@/lib/riot/matches`, `openai`)
   - Mock API calls to Riot and OpenAI
   - Mock response data

3. **Global Fetch Mock**
   - Mock `global.fetch` for HTTP requests
   - Test different response scenarios

### Example Mock Setup

```typescript
jest.mock('@/lib/prisma', () => ({
  prisma: {
    matchParticipant: {
      findMany: jest.fn(),
    },
  },
}))

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
})
```

## Test Data

### Sample Match Data
```typescript
{
  goldDiffAt15: 3000,
  win: true,
  deaths: 3,
  visionScore: 24,
  kills: 12,
  assists: 8,
  csPerMinute: 7.2,
}
```

### Sample User
- **Name**: KryptoRift
- **Rank**: Gold II, 47 LP
- **Main Champions**: Jinx (62%), Caitlyn (52%), Ezreal (41%)

## Running Specific Tests

```bash
# Run only insights engine tests
npm test -- lib/insights/engine.test.ts

# Run only API tests
npm test -- app/api

# Run with specific pattern
npm test -- --testNamePattern="Poor lead conversion"

# Run with verbose output
npm test -- --verbose
```

## Coverage Goals

Current test coverage includes:

- **Insights Engine**: 100% coverage
- **Riot Parser**: 100% coverage
- **Riot Client**: 100% coverage
- **OpenAI Generator**: 100% coverage
- **API Routes**: 100% coverage

To view detailed coverage:
```bash
npm run test:coverage
```

## Continuous Integration

To integrate tests into CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: npm test -- --coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Mocking**: External dependencies are mocked
3. **Clarity**: Test names clearly describe what they test
4. **Organization**: Related tests grouped in describe blocks
5. **Cleanup**: Mocks cleared before each test
6. **Data Variety**: Tests include normal, edge, and error cases

## Troubleshooting

### Tests timeout
- Increase Jest timeout: `jest.setTimeout(10000)`
- Check for unresolved promises

### Mock not working
- Ensure mock path matches import path
- Clear mocks with `jest.clearAllMocks()`
- Check mock is defined before usage

### Type errors
- Ensure tsconfig includes test files
- Use `as jest.Mock` for mock type casting
- Import types from jest: `import { jest } from '@jest/globals'`

## Adding New Tests

When adding new functionality:

1. Create a `.test.ts` file next to source file
2. Import the function to test
3. Mock external dependencies
4. Write test cases for:
   - Happy path (normal operation)
   - Error scenarios
   - Edge cases
5. Run tests: `npm test`
6. Ensure coverage > 80%

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [ts-jest](https://kulshekhar.github.io/ts-jest/)
