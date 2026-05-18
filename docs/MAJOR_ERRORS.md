# Major Errors & Fixes

This document logs significant bugs, architectural issues, and their resolutions.

---

## Error Log Template

```
## [Error Title]

**Date Found**: [YYYY-MM-DD]  
**Severity**: [Critical / High / Medium / Low]  
**Component**: [Frontend / Backend / Database / Auth]  
**Symptom**: [What the user sees]  
**Root Cause**: [Why it happened]  
**Fix Applied**: [How it was fixed]  
**Files Changed**: [List of modified files]  
**Lesson Learned**: [What to prevent in future]  

---
```

---

## Critical Issues

(None logged yet)

---

## High Priority Issues

(None logged yet)

---

## Medium Priority Issues

(None logged yet)

---

## Low Priority Issues

(None logged yet)

---

## Prevention Guide

### Common Mistakes to Avoid

1. **Wallet Address Validation**
   - ❌ Don't forget 0x prefix check
   - ❌ Don't forget length = 42 check
   - ❌ Don't forget lowercase normalization
   - ✅ Always validate: `wallet.length === 42 && wallet.startsWith("0x")`

2. **Async Error Handling**
   - ❌ Don't use try-catch in route handlers (breaks asyncHandler)
   - ✅ Throw apiError() instead
   - ✅ Let asyncHandler + errorHandler deal with it

3. **React Query Caching**
   - ❌ Don't forget to set `staleTime` appropriately
   - ❌ Don't enable `refetchOnWindowFocus` for expensive queries
   - ✅ Set sensible cache/GC times

4. **JWT Token Handling**
   - ❌ Don't store tokens in localStorage (use encrypted AsyncStorage)
   - ❌ Don't manually attach tokens (use axios interceptor)
   - ✅ Let Clerk + setClerkGetToken handle token lifecycle

5. **Database Queries**
   - ❌ Don't concatenate SQL strings (SQL injection risk)
   - ✅ Always use prepared statements: `.prepare(...).bind(...)`

6. **API Response Format**
   - ❌ Don't return raw JSON: `c.json({ data })`
   - ✅ Always wrap: `c.json(new apiResponse(200, { data }, "message"))`

---

## Debugging Checklist

When something breaks:

1. **Check Frontend Logs**
   - React DevTools
   - Expo logs: `expo start --clear`
   - Console errors

2. **Check Backend Logs**
   - Wrangler dev: `npm run dev`
   - Check error handler output
   - Check database prepared statements

3. **Check Network**
   - Axios network tab
   - API endpoint correct?
   - JWT token valid?
   - CORS headers correct?

4. **Check Database**
   - Is data inserted?
   - Correct user_id?
   - Foreign key constraints OK?
   - Use D1 dashboard to query

5. **Check Auth**
   - Is user logged in?
   - Is Clerk token valid?
   - Is token attached to requests?
   - Check `c.get("userId")` in backend

6. **Check Environment Variables**
   - Frontend: `.env.local` exists?
   - Backend: `.dev.vars` or `wrangler.jsonc` set?
   - All required keys present?

---

## Performance Issues

### Symptom: App feels slow

**Diagnosis**:
1. Check React DevTools for re-renders
2. Check animation FPS with React Native Debugger
3. Check bundle size: `npm run build:bundle`

**Common Causes**:
- Excessive re-renders in lists
- Heavy animations with many objects
- Large JSON responses not cached
- Too many simultaneous requests

**Fix**:
- Memoize components: `React.memo()`
- Reduce animation complexity
- Implement query caching
- Batch API requests

---

## Network Issues

### Symptom: API requests fail

**Diagnosis**:
1. Is backend running? `npm run dev` in backend folder
2. Is API URL correct in `.env.local`?
3. Does backend have CORS enabled?
4. Is JWT token valid?

**Common Causes**:
- Backend not running
- Wrong API URL (localhost vs production)
- CORS not configured
- Expired JWT token

**Fix**:
- Verify backend is running
- Check env variables
- Check CORS middleware in backend
- Verify Clerk token generation

---

## Database Issues

### Symptom: Data not saving/loading

**Diagnosis**:
1. Check prepared statement syntax
2. Verify table exists: Check migrations
3. Verify user_id is correct
4. Check foreign key constraints

**Common Causes**:
- Table doesn't exist (migration not run)
- Wrong column name
- Wrong data type
- Foreign key violation
- Incorrect prepared statement

**Fix**:
- Run migrations: `wrangler d1 migrations apply`
- Check schema in migrations folder
- Verify all fields in prepared statement
- Check constraint violations

---

## Auth Issues

### Symptom: User can't log in or auth fails

**Diagnosis**:
1. Is Clerk publishable key correct?
2. Is Clerk configured in Expo?
3. Does JWT verification work?
4. Is user_id being extracted correctly?

**Common Causes**:
- Wrong Clerk key
- Clerk not wrapped in provider
- JWT verification failing
- User not synced to database

**Fix**:
- Check `.env.local` CLERK key
- Verify ClerkProvider wraps app
- Check auth middleware JWT verification
- Ensure Clerk webhook syncs users

---

## Frontend Issues

### Symptom: Component not rendering

**Diagnosis**:
1. Is component exported?
2. Is route correct in Expo Router?
3. Are props passed correctly?
4. Check console for errors

**Common Causes**:
- Export/import mismatch
- Wrong route path
- Missing props
- TypeScript type error

**Fix**:
- Verify exports match imports
- Check app folder structure matches routes
- Pass all required props
- Check tsconfig strictness

---

## Animation Issues

### Symptom: Animations feel janky or slow

**Diagnosis**:
1. Check animation complexity
2. Check for unnecessary re-renders
3. Profile with React Native Debugger

**Common Causes**:
- Too many simultaneous animations
- Heavy computations in render
- Unoptimized image loads
- Excessive state updates

**Fix**:
- Simplify animations
- Use CSS transforms only
- Lazy load images
- Batch state updates

---

## Build Issues

### Symptom: App won't build

**Diagnosis**:
1. Check TypeScript errors: `npx tsc --noEmit`
2. Check for syntax errors
3. Check dependency versions
4. Check native module compatibility

**Common Causes**:
- TypeScript compilation errors
- Dependency conflict
- Incompatible React/RN version
- Native module issue

**Fix**:
- Fix TS errors
- Update packages: `npm install`
- Check package.json overrides
- Check EAS build logs

---

## Template for Logging a New Error

When you encounter a significant issue:

1. **Document it immediately** in this file
2. **Include all details** (date, symptom, root cause)
3. **Describe the fix** clearly
4. **Note the lesson** for prevention
5. **Update SESSION_LOG.md** with "Fixed issue: ..."
6. **Create a git commit** with fix

```markdown
## [Error Title - Make it Descriptive]

**Date Found**: [Date]  
**Severity**: [Choose one]  
**Component**: [Frontend / Backend / Database / Auth]  
**Symptom**: 
[What the user sees/experiences]

**Root Cause**:
[Why did this happen?]

**Fix Applied**:
[Step by step how it was fixed]

**Files Changed**:
- file1.ts
- file2.tsx

**Lesson Learned**:
[What to remember for prevention]

**Prevention**:
[How to avoid this in future PRs]
```

---

## Related Documents

- See API_CONTRACTS.md for API error responses
- See BACKEND_RULES.md for error handling patterns
- See FRONTEND_ARCHITECTURE.md for component patterns
- See SESSION_LOG.md for session history
