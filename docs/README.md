# Documentation Index

This is the master documentation for **EtherScope V2** - an Ethereum wallet tracking mobile app.

This documentation structure is designed to be **AI-friendly**: future AI agents can quickly understand the codebase, conventions, and decisions by reading these docs.

---

## 📚 Documentation Files

### 1. **SESSION_LOG.md** - Session History
**Purpose**: Track all work done with timestamps and summaries.  
**When to Update**: At the end of each development session.  
**Contains**: 
- Session metadata (date, duration, focus)
- Changes made
- Files modified
- Issues fixed/blockers
- Next steps

**Example Use**: "What work has been done on the project?"

---

### 2. **ARCHITECTURE.md** - High-Level Overview
**Purpose**: Understand the entire system at a glance.  
**Read First**: When onboarding to the project.  
**Contains**:
- System diagram (frontend → backend → database)
- Technology stack summary
- Data flow for major features
- Authentication flow
- Database schema & relationships
- API architecture
- Background jobs setup
- Deployment architecture

**Example Use**: "How do all the components fit together?"

---

### 3. **API_CONTRACTS.md** - API Specifications
**Purpose**: Define all API endpoints and their contracts.  
**Used By**: Frontend developers, backend developers, API consumers.  
**Contains**:
- Base URLs (dev & production)
- Authentication requirements
- All endpoints (GET, POST, DELETE, etc.)
- Request/response schemas
- Error response formats
- Status codes
- Data type definitions
- Frontend usage examples

**Example Use**: "What's the exact request format for tracking a wallet?"

---

### 4. **BACKEND_RULES.md** - Backend Architecture & Conventions
**Purpose**: Enforce consistent backend development practices.  
**Used By**: Backend developers, AI agents extending the backend.  
**Contains**:
- Tech stack overview
- Project folder structure
- Naming conventions
- File size rules
- Package dependencies
- Database schema rules
- Migration guidelines
- Code style rules
- Endpoint patterns
- Authentication & authorization
- External API integration
- Environment variables
- Performance optimization
- Security considerations
- Common patterns
- Adding new endpoints checklist

**Example Use**: "How should I structure a new endpoint?"

---

### 5. **FRONTEND_ARCHITECTURE.md** - Frontend Structure & Patterns
**Purpose**: Define folder structure and implementation patterns.  
**Used By**: Frontend developers, AI agents extending the frontend.  
**Contains**:
- Tech stack (Expo, React Native, etc.)
- Complete folder structure
- Navigation setup (Expo Router)
- Component patterns
- Custom hook patterns
- Service layer patterns
- Animated component patterns
- File descriptions
- Styling rules (NativeWind)
- State management strategy
- Authentication flow
- Performance optimization
- Dark/light mode
- Adding new screens checklist

**Example Use**: "Where should I put this new component?"

---

### 6. **FRONTEND_CREATIVE_DIRECTION.md** - Design & UX Vision
**Purpose**: Define the visual and interaction style.  
**Used By**: Frontend developers, designers, UI developers.  
**Contains**:
- Core feeling (premium, modern, technical)
- Visual style (colors, gradients, glow effects)
- Motion philosophy (smooth, intentional, 60 FPS)
- Screen-by-screen design direction
- Typography rules
- Interaction design (responsive, tactile)
- Component philosophy
- Visual density guidelines
- Performance constraints
- Design references (Robinhood, Coinbase, etc.)
- Accessibility requirements
- Final creative rules

**Example Use**: "How should the search screen look and feel?"

---

### 7. **FRONTEND_RULES.md** - Frontend Development Standards
**Purpose**: Enforce consistent frontend practices.  
**Used By**: Frontend developers, AI agents extending the frontend.  
**Contains**:
- Frontend stack (Expo, TypeScript, NativeWind, etc.)
- Mobile app architecture (feature-first organization)
- Component rules (focused, reusable)
- Styling rules (Tailwind only)
- UI philosophy (clean, polished, modern)
- Accessibility rules (critical for mobile)
- State management (React Query, Zustand)
- Form handling
- Performance rules (mobile optimization)
- Animation rules (React Native Reanimated)
- Navigation rules (Expo Router only)
- Authentication flow
- Data fetching rules
- Error handling
- TypeScript rules
- File naming conventions
- Testing
- Deployment instructions

**Example Use**: "What state management library should I use?"

---

### 8. **MAJOR_ERRORS.md** - Error Log & Prevention
**Purpose**: Document significant bugs and their fixes.  
**Used By**: All developers, debugging reference, prevention guide.  
**Contains**:
- Critical/High/Medium/Low issue logs
- Error details (date, symptom, root cause, fix)
- Prevention guide (common mistakes to avoid)
- Debugging checklist
- Performance troubleshooting
- Network troubleshooting
- Database troubleshooting
- Auth troubleshooting
- Frontend component troubleshooting
- Animation troubleshooting
- Build troubleshooting

**Example Use**: "What's a common mistake I should avoid?"

---

## 🗺️ Quick Navigation Guide

### **I want to understand the project**
1. Start with ARCHITECTURE.md (high-level overview)
2. Then read the specific component docs

### **I'm building a new backend endpoint**
1. Read BACKEND_RULES.md (patterns & structure)
2. Check API_CONTRACTS.md (existing endpoints)
3. Follow the checklist in BACKEND_RULES.md

### **I'm building a new frontend screen**
1. Read FRONTEND_ARCHITECTURE.md (folder structure)
2. Read FRONTEND_CREATIVE_DIRECTION.md (design direction)
3. Read FRONTEND_RULES.md (code standards)
4. Follow the checklist in FRONTEND_ARCHITECTURE.md

### **Something broke**
1. Check MAJOR_ERRORS.md (common issues & fixes)
2. Use the debugging checklist in MAJOR_ERRORS.md

### **I'm onboarding to the project**
1. Read ARCHITECTURE.md (big picture)
2. Read FRONTEND_RULES.md and BACKEND_RULES.md (standards)
3. Check SESSION_LOG.md (recent work)
4. Run the app locally and explore

### **I'm reviewing code changes**
1. Check BACKEND_RULES.md / FRONTEND_RULES.md for violations
2. Check MAJOR_ERRORS.md for prevention of known issues
3. Ask if changes follow established patterns

---

## 📋 Document Purposes at a Glance

| Doc | Primary Reader | Secondary Reader | Key Question |
|-----|---|---|---|
| SESSION_LOG | Project Manager | All | What has been done? |
| ARCHITECTURE | New Team Members | All | How does it all fit? |
| API_CONTRACTS | Frontend Dev | Backend Dev | What's the API? |
| BACKEND_RULES | Backend Dev | All | How to code backend? |
| FRONTEND_ARCHITECTURE | Frontend Dev | All | How to structure? |
| FRONTEND_CREATIVE_DIRECTION | Frontend Dev | Designer | What should it look like? |
| FRONTEND_RULES | Frontend Dev | All | How to code frontend? |
| MAJOR_ERRORS | All Devs | All | What are the pitfalls? |

---

## 🔄 Documentation Maintenance

### When to Update

- **SESSION_LOG.md**: At the end of each development session
- **MAJOR_ERRORS.md**: When a significant bug is found and fixed
- **ARCHITECTURE.md**: When major architectural changes occur
- **BACKEND_RULES.md**: When backend conventions change
- **FRONTEND_ARCHITECTURE.md**: When folder structure changes
- **API_CONTRACTS.md**: When API endpoints change
- **FRONTEND_RULES.md**: When frontend standards change
- **FRONTEND_CREATIVE_DIRECTION.md**: When design direction shifts

### How to Update

1. Make the code change
2. Update relevant documentation
3. Commit both together: "feat: add feature + update docs"
4. If fixing a major bug: add entry to MAJOR_ERRORS.md
5. Add entry to SESSION_LOG.md at session end

---

## 🤖 For AI Agents

If you're an AI working on this project:

1. **Always read ARCHITECTURE.md first** for context
2. **Check the relevant rules doc** (BACKEND_RULES.md or FRONTEND_RULES.md)
3. **Check MAJOR_ERRORS.md** for prevention of known issues
4. **Check SESSION_LOG.md** to see what has been done
5. **Follow the established patterns** - don't deviate without asking
6. **Update SESSION_LOG.md** when you finish work

### Quick Reference

- **"Where should I put this file?"** → Read FRONTEND_ARCHITECTURE.md or BACKEND_RULES.md
- **"What's the API endpoint?"** → Read API_CONTRACTS.md
- **"What's the folder structure?"** → Read FRONTEND_ARCHITECTURE.md
- **"What conventions should I follow?"** → Read FRONTEND_RULES.md or BACKEND_RULES.md
- **"What's a common mistake?"** → Read MAJOR_ERRORS.md
- **"How does it all work?"** → Read ARCHITECTURE.md
- **"What work has been done?"** → Read SESSION_LOG.md

---

## 📚 Related Project Files

Outside of `/docs`:

- `README.md` (root) - Project overview for GitHub
- `package.json` (root) - Monorepo configuration
- `prd.md` - Product requirements (if exists)
- `trd.md` - Technical requirements (if exists)
- `roadmap.md` - Implementation roadmap (if exists)

---

## ✅ Checklist for New Sessions

Before starting work:

- [ ] Read relevant rule doc (BACKEND_RULES.md or FRONTEND_RULES.md)
- [ ] Check MAJOR_ERRORS.md for relevant pitfalls
- [ ] Check SESSION_LOG.md for recent context
- [ ] Check API_CONTRACTS.md if API work
- [ ] Read ARCHITECTURE.md if major refactor

After finishing work:

- [ ] Updated SESSION_LOG.md with session summary
- [ ] Updated other docs if needed (rules, errors, API)
- [ ] Created git commit with clear message
- [ ] Ensured code follows established patterns
- [ ] Added comments only where needed (code should be self-documenting)

---

## 🎯 Documentation Goals

This documentation exists to:
1. **Onboard quickly** - New team members understand the project fast
2. **Maintain consistency** - All code follows same patterns & style
3. **Prevent common mistakes** - MAJOR_ERRORS.md logs lessons learned
4. **Enable AI** - AI agents can understand and extend the codebase
5. **Document decisions** - Understand "why" not just "what"
6. **Enable scale** - New features can be built consistently

---

## 📞 Questions?

If you can't find an answer:

1. Check the relevant rule doc
2. Check SESSION_LOG.md for context
3. Check MAJOR_ERRORS.md for similar issues
4. Ask in the project discussion/issues

---

**Last Updated**: 2026-05-18  
**Total Documentation Pages**: 8  
**Total Documentation Size**: ~76KB  

This documentation is a living document. Update it as the project evolves.
