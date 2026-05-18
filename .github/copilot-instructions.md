# EtherScope V2 — AI Operating Instructions

## Purpose

This repository contains **EtherScope V2**, a React Native mobile application for tracking Ethereum wallet activity in real-time.

This file defines how AI assistants (including future AI agents and code reviewers) should operate inside this repository.

---

## 🚀 Mandatory Startup Sequence

Before performing ANY task on this codebase:

1. ✅ Read this file completely
2. ✅ Read `/docs/README.md` (documentation index)
3. ✅ Read `/docs/ARCHITECTURE.md` (system overview)
4. ✅ Read relevant rule docs:
   - `BACKEND_RULES.md` (if backend work)
   - `FRONTEND_RULES.md` (if frontend work)
5. ✅ Check `/docs/SESSION_LOG.md` (recent work)
6. ✅ Check `/docs/MAJOR_ERRORS.md` (known pitfalls)
7. ✅ Check `/docs/API_CONTRACTS.md` (if API work)

**Do not make assumptions without reading project context first.**

If you don't understand something after reading docs, ask for clarification before implementing.

---

## 📚 Documentation-First Workflow

This repository follows a **documentation-first engineering workflow**.

### Before Implementing Changes

1. Review `/docs/ARCHITECTURE.md` (big picture)
2. Review `/docs/FRONTEND_ARCHITECTURE.md` or `/docs/BACKEND_RULES.md` (specific patterns)
3. Check `/docs/MAJOR_ERRORS.md` (avoid known mistakes)
4. Follow established conventions religiously
5. Do NOT deviate from patterns without asking

### After Implementing Meaningful Changes

1. Update `/docs/SESSION_LOG.md` with session summary
2. Update relevant docs if patterns/standards changed:
   - `FRONTEND_RULES.md` (if frontend patterns changed)
   - `BACKEND_RULES.md` (if backend patterns changed)
   - `API_CONTRACTS.md` (if API changed)
   - `ARCHITECTURE.md` (if major architectural change)
3. Add entry to `/docs/MAJOR_ERRORS.md` if you fixed a significant bug
4. Keep documentation synchronized with code

**Never leave documentation for the final day.**

---

## 🎯 Project Philosophy

EtherScope V2 should feel:
- **premium** (high-end, polished, professional)
- **modern** (contemporary design, smooth animations)
- **technical** (sophisticated, intelligent, advanced)
- **responsive** (fast, snappy interactions)
- **trustworthy** (secure, reliable, stable)

Prioritize:
- **clarity** (understandable code and design)
- **maintainability** (easy to extend and modify)
- **UX quality** (smooth, delightful interactions)
- **performance** (responsive, 60 FPS minimum)
- **security** (protect user data, verify tokens)

Avoid:
- generic mobile app templates
- overengineering simple features
- premature optimization
- unnecessary abstractions
- cutting corners on quality

---

## 💻 Tech Stack

### Frontend (ether-scope/)
```
Expo 54.0 (React Native runtime)
React 19.1 + React Native 0.81.5
Expo Router (file-based navigation)
TypeScript 5
React Query 5.90 (server state)
NativeWind 4.2 (Tailwind CSS)
React Native Reanimated 4.1 (animations)
Clerk Expo 3.0 (OAuth)
Axios 1.13 (HTTP + JWT)
AsyncStorage 2.2 (secure local storage)
```

### Backend (backend/)
```
Hono 4.12 (web framework)
Cloudflare Workers (serverless compute)
D1 SQLite (database at edge)
Inngest 3.52 (background jobs)
Clerk Backend SDK 3.2 (JWT verification)
TypeScript 5
```

### External Services
```
Clerk (OAuth authentication + JWT)
Etherscan API (blockchain data)
Cloudflare (Workers + D1)
Inngest (event-driven jobs)
```

---

## 🏗️ Architecture Rules

### Frontend
- Use **feature-first** folder organization (not flat components)
- Keep components **focused** (single responsibility)
- Use **Expo Router only** for navigation
- Use **React Query only** for server state
- Use **NativeWind only** for styling (no inline styles)
- Use **TypeScript strictly** (no any types)
- Follow patterns from `/docs/FRONTEND_ARCHITECTURE.md`

### Backend
- Keep **controllers thin** (routing only)
- Separate **business logic** into services
- Use **prepared statements** (prevent SQL injection)
- Always return standardized **apiResponse** format
- Use **asyncHandler** for error handling
- Follow patterns from `/docs/BACKEND_RULES.md`

### General
- Prefer **explicit readable code** over clever abstractions
- Prefer **composition over inheritance**
- Prefer **small focused files** over monolithic files
- Use **clear naming** (variables, functions, files)
- Document **why** not just **what**

---

## 🤖 AI Usage Rules

AI should **assist development, not replace reasoning**.

### Allowed
- ✅ Scaffolding new features (following established patterns)
- ✅ Debugging and fixing bugs
- ✅ Refactoring code (maintaining readability)
- ✅ Writing tests
- ✅ Documentation help
- ✅ Styling/animation assistance
- ✅ Code review suggestions

### Not Allowed
- ❌ Fake reasoning or assumptions
- ❌ One-shot code generation without understanding
- ❌ Deviating from established patterns without asking
- ❌ Writing complex business logic without review
- ❌ Committing code without user approval

### Code Generation Standards

All generated code MUST:
1. Follow repository architecture from `/docs`
2. Follow style from rule docs (`FRONTEND_RULES.md`, `BACKEND_RULES.md`)
3. Remain readable (no obfuscation)
4. Remain maintainable (clear intent)
5. Include comments only where necessary
6. Be reviewed before acceptance (suggest to user)
7. Include TypeScript types
8. Have no `any` types

---

## 📝 Documentation Rules

**Documentation is mandatory.**

When changing:
- Architecture (system design, data flow)
- API contracts (endpoints, schemas)
- Database schema (tables, relationships)
- Frontend patterns (component structure, hooks)
- Backend structure (routes, controllers)
- Error handling patterns
- Authentication flows

**Update corresponding documentation immediately:**
- Update `/docs/ARCHITECTURE.md` (if system design changed)
- Update `/docs/FRONTEND_ARCHITECTURE.md` (if folder structure changed)
- Update `/docs/BACKEND_RULES.md` (if backend patterns changed)
- Update `/docs/API_CONTRACTS.md` (if endpoints changed)
- Update `/docs/FRONTEND_RULES.md` (if frontend standards changed)
- Update `/docs/MAJOR_ERRORS.md` (if you fixed a major bug)

After every session:
- Update `/docs/SESSION_LOG.md` (what was accomplished)

---

## 🔄 Git Workflow Rules

Use **conventional commits**:

```bash
git commit -m "feat: add wallet search functionality"
git commit -m "fix: prevent duplicate API requests"
git commit -m "docs: update API_CONTRACTS.md"
git commit -m "refactor: reorganize component structure"
git commit -m "test: add wallet validation tests"
git commit -m "chore: update dependencies"
```


**Rules:**
- Avoid meaningless commits
- One feature = one focused commit
- Documentation changes in separate commits
- Bug fixes in separate commits
- Test additions in separate commits

**Note:** AI suggests commits but does NOT commit. User must review and commit manually.

---

## 📋 Session Logging

Update `/docs/SESSION_LOG.md` after each development session.

### Format

```markdown
## [YYYY-MM-DD] - [SESSION_ID or Name]

**Duration**: [Start time] - [End time]  
**Focus**: [Main objective]  

**Completed**:
- [Feature/fix 1]
- [Feature/fix 2]
- [Documentation update]

**Decisions Made**:
- [Architecture decision]
- [Technology choice]
- [Pattern established]

**Problems Encountered**:
- [Issue 1 - how you resolved it]
- [Issue 2 - how you resolved it]

**Files Modified**:
- `path/to/file.ts`
- `path/to/file.tsx`

**Next Steps**:
- [What comes next]
- [Blocker if any]
```

---

## 📚 Documentation Structure

### Root-Level Docs (for GitHub)

- **README.md** - Project overview, quick start
- **claude.md** - This file (AI instructions)

### /docs/ (AI Reference)

- **README.md** - Documentation index and navigation
- **ARCHITECTURE.md** - System overview, data flows, tech stack
- **API_CONTRACTS.md** - All API endpoints and schemas
- **BACKEND_RULES.md** - Backend conventions and patterns
- **FRONTEND_ARCHITECTURE.md** - Frontend folder structure
- **FRONTEND_RULES.md** - Frontend coding standards
- **FRONTEND_CREATIVE_DIRECTION.md** - Design and UX vision
- **MAJOR_ERRORS.md** - Common errors and prevention
- **SESSION_LOG.md** - Development history

---

## 🎬 Working with AI

### When Starting a Task

1. Provide clear context
2. Ask AI to read relevant docs first
3. Ask AI to suggest approach before coding
4. Review AI suggestions against rules docs
5. Approve before AI implements

### When Reviewing AI Code

Check against:
- `/docs/FRONTEND_RULES.md` (frontend work)
- `/docs/BACKEND_RULES.md` (backend work)
- `/docs/ARCHITECTURE.md` (system changes)
- `/docs/MAJOR_ERRORS.md` (known pitfalls)

Ask: "Does this follow the documented patterns?"

### When AI Gets Stuck

1. Ask AI to re-read relevant docs
2. Ask AI to check `/docs/MAJOR_ERRORS.md`
3. Ask AI to explain the architecture from `/docs/ARCHITECTURE.md`
4. Provide additional context
5. Break down into smaller steps

---

## ✅ Pre-Implementation Checklist

Before implementing any feature:

- [ ] Read `/docs/ARCHITECTURE.md` (understand system)
- [ ] Read relevant rule doc (`FRONTEND_RULES.md` or `BACKEND_RULES.md`)
- [ ] Check `/docs/MAJOR_ERRORS.md` (avoid pitfalls)
- [ ] Check `/docs/SESSION_LOG.md` (understand context)
- [ ] Understand the existing patterns
- [ ] Ask for clarification if unclear
- [ ] Suggest approach to user (don't just build)
- [ ] Get approval before implementing

---

## ✅ Post-Implementation Checklist

After completing a feature:

- [ ] Code follows established patterns
- [ ] No `any` types in TypeScript
- [ ] Comments added only where necessary
- [ ] All functions have clear names
- [ ] Error handling implemented
- [ ] API/endpoints documented (if applicable)
- [ ] Updated `/docs/SESSION_LOG.md`
- [ ] Updated other docs if patterns changed
- [ ] Suggested git commit message to user
- [ ] Code ready for review

---

## 🚨 Critical Rules (Never Violate)

1. **Always read project docs first** - No exceptions
2. **Follow established patterns** - Consistency is mandatory
3. **No `any` types** - Be explicit with TypeScript
4. **Prepared statements only** - SQL injection prevention
5. **Standardized API responses** - Use `apiResponse` wrapper
6. **Async error handling** - Use `asyncHandler` + `apiError`
7. **NativeWind styling only** - No inline styles on mobile
8. **Validate inputs** - Security and reliability
9. **Document major changes** - Keep docs updated
10. **Never commit code** - Only suggest to user

---

## 🎯 Primary Objectives

Build the **most polished, production-ready MVP possible**.

Focus on:
1. **Code quality** - Clean, readable, maintainable
2. **UX quality** - Smooth, responsive, delightful
3. **Performance** - 60 FPS, fast load times
4. **Security** - Protect user data, verify authenticity
5. **Reliability** - Error handling, edge cases
6. **Documentation** - Keep docs in sync
7. **Developer experience** - Easy to extend

Avoid:
- Cutting corners on quality
- Ignoring performance
- Skipping error handling
- Leaving documentation outdated
- Deviating from patterns

---

## 📞 Questions?

If something is unclear:

1. Check `/docs/README.md` (navigation)
2. Check relevant rule doc (`FRONTEND_RULES.md`, `BACKEND_RULES.md`)
3. Check `/docs/MAJOR_ERRORS.md` (common issues)
4. Check `/docs/SESSION_LOG.md` (recent context)
5. Ask user for clarification

---

## 🔗 Quick Links

- **Architecture Overview**: `/docs/ARCHITECTURE.md`
- **API Reference**: `/docs/API_CONTRACTS.md`
- **Frontend Rules**: `/docs/FRONTEND_RULES.md`
- **Backend Rules**: `/docs/BACKEND_RULES.md`
- **Common Errors**: `/docs/MAJOR_ERRORS.md`
- **Session History**: `/docs/SESSION_LOG.md`
- **Design Vision**: `/docs/FRONTEND_CREATIVE_DIRECTION.md`
- **Frontend Structure**: `/docs/FRONTEND_ARCHITECTURE.md`

---

## ✨ Final Rule

**When in doubt, refer to the documentation.**

The `/docs` folder is the source of truth.

All code must align with documented patterns and standards.

All changes must be documented.

This ensures consistency, quality, and maintainability.

---

**Last Updated**: 2026-05-18  
**Version**: 1.0  
**For**: EtherScope V2 - Ethereum Wallet Tracker Mobile App

*This file is mandatory reading for all AI assistants working on this project.*
