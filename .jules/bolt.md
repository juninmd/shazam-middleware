## 2024-05-22 - [Global Variable Race Condition in Middleware]
**Learning:** Found a critical performance/correctness anti-pattern where a global variable (`t0`) was used to track request start time in an Express middleware. This caused race conditions under concurrency, leading to incorrect timing metrics (negative or zero durations) for overlapping requests.
**Action:** Always scope request-specific data (like start time) to the request or response object (e.g., `res.locals` or `res._customProp`) to ensure thread safety in the event loop.

## 2024-05-22 - [Inefficient Object Iteration in Hot Path]
**Learning:** The `dateDiff` function was creating objects and iterating over keys (`Object.keys`) on every request logging. For fixed schemas (like time units), direct calculation is significantly faster and allocates less memory.
**Action:** Replace dynamic iteration with direct mathematical calculations for fixed-format transformations in hot paths.
