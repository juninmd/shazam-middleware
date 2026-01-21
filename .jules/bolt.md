## 2024-05-22 - [Global Variable Race Condition in Middleware]
**Learning:** Found a critical performance/correctness anti-pattern where a global variable (`t0`) was used to track request start time in an Express middleware. This caused race conditions under concurrency, leading to incorrect timing metrics (negative or zero durations) for overlapping requests.
**Action:** Always scope request-specific data (like start time) to the request or response object (e.g., `res.locals` or `res._customProp`) to ensure thread safety in the event loop.

## 2024-05-22 - [Inefficient Object Iteration in Hot Path]
**Learning:** The `dateDiff` function was creating objects and iterating over keys (`Object.keys`) on every request logging. For fixed schemas (like time units), direct calculation is significantly faster and allocates less memory.
**Action:** Replace dynamic iteration with direct mathematical calculations for fixed-format transformations in hot paths.

## 2024-05-24 - [Expensive User-Agent Parsing in Hot Path]
**Learning:** The `browser-detect` library uses regex to parse User-Agent strings, which can be expensive (20-30k ops/sec). Calling this indiscriminately on every request, even for empty User-Agents or known bots (like Postman), wastes CPU cycles.
**Action:** Use "Guard Clauses" to handle simple cases (empty/undefined) or specific known patterns (like 'PostmanRuntime') before invoking heavy parsing libraries. This yielded a ~48x speedup for empty UAs and ~280x speedup for Postman requests.

## 2024-05-27 - [Caching Repeated User-Agents]
**Learning:** Even with guard clauses, repeated calls to `browser-detect` for standard User-Agents (e.g., Chrome, Firefox) remain expensive (~0.05ms per call) and can consume significant CPU under load.
**Action:** Implement an LRU-like cache (Map) for User-Agent parsing results. Since User-Agent strings are repetitive and finite in practice, this reduces parsing cost to near-zero (~20x speedup) for 99% of requests.

## 2024-05-28 - [Cache Thrashing in Simple Map Cache]
**Learning:** Using `map.clear()` when a cache reaches its limit causes a "performance cliff" where all subsequent requests miss the cache until it refills. This negates the benefit of caching for high-traffic environments with diverse clients.
**Action:** Implement true LRU eviction by deleting the oldest key (`map.keys().next().value`) when the limit is reached, and re-inserting keys on access to refresh their position.

## 2024-05-30 - [Bypassed Optimizations in Error Handling]
**Learning:** Performance optimizations (like User-Agent caching) implemented in one module (middleware) were bypassed by other modules (error handlers) that duplicated the expensive logic. This caused the "optimized" path to be ignored during critical failures, potentially worsening the impact of errors.
**Action:** Extract expensive logic (like regex parsing) into shared, cached utilities so that all parts of the application benefit from the optimization, ensuring consistent performance even in edge cases.
