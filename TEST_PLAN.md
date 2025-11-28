# Orlando Vacation Deals - Complete Test Plan
## Version 1.0 | November 28, 2025

---

## 📋 TEST OVERVIEW

**Site URL:** https://crav-orlando-deals.vercel.app
**Tester:** _______________
**Date:** _______________
**Browser:** _______________
**Device:** _______________

---

## 🔗 SECTION 1: PAGE LOAD TESTS

| # | Page | URL | Expected | Status | Notes |
|---|------|-----|----------|--------|-------|
| 1.1 | Homepage | / | 200 OK, loads in <3s | ☐ Pass ☐ Fail | |
| 1.2 | Hotels/Results | /results | 200 OK, shows 11 hotels | ☐ Pass ☐ Fail | |
| 1.3 | DVC Calculator | /dvc | 200 OK, calculator works | ☐ Pass ☐ Fail | |
| 1.4 | Deals | /deals | 200 OK, shows promotions | ☐ Pass ☐ Fail | |
| 1.5 | Passholder Hub | /passholder | 200 OK, shows 3 tabs | ☐ Pass ☐ Fail | |
| 1.6 | Investors | /investors | 200 OK, shows revenue model | ☐ Pass ☐ Fail | |
| 1.7 | Travel Agents | /agents | 200 OK, shows commission tiers | ☐ Pass ☐ Fail | |
| 1.8 | Contact | /contact | 200 OK, shows contact form | ☐ Pass ☐ Fail | |
| 1.9 | Hotels (alias) | /hotels | 200 OK, same as /results | ☐ Pass ☐ Fail | |
| 1.10 | API Status | /api/hotels.js?action=status | 200 OK, returns JSON | ☐ Pass ☐ Fail | |

---

## 🔗 SECTION 2: NAVIGATION LINK TESTS

### 2.1 Homepage Navigation Bar
| # | Link Text | Expected Destination | Status | Notes |
|---|-----------|---------------------|--------|-------|
| 2.1.1 | Logo/Site Name | / (homepage) | ☐ Pass ☐ Fail | |
| 2.1.2 | "Hotels" | /results | ☐ Pass ☐ Fail | |
| 2.1.3 | "Current Deals" | /deals | ☐ Pass ☐ Fail | |
| 2.1.4 | "DVC Calculator" | /dvc | ☐ Pass ☐ Fail | |
| 2.1.5 | "Passholder Hub" | /passholder | ☐ Pass ☐ Fail | |
| 2.1.6 | "Travel Agents" | /agents | ☐ Pass ☐ Fail | |
| 2.1.7 | "Get Deal Alerts" button | Opens email modal | ☐ Pass ☐ Fail | |

### 2.2 Homepage Hero Section
| # | Link Text | Expected Destination | Status | Notes |
|---|-----------|---------------------|--------|-------|
| 2.2.1 | "Build My Custom Trip" | Scrolls to #trip-builder | ☐ Pass ☐ Fail | |
| 2.2.2 | "Ask Javari AI" | Opens AI chat widget | ☐ Pass ☐ Fail | |
| 2.2.3 | "Today's Hot Deals" | /deals | ☐ Pass ☐ Fail | |

### 2.3 Homepage Deals Section
| # | Link Text | Expected Destination | Status | Notes |
|---|-----------|---------------------|--------|-------|
| 2.3.1 | "View All →" | /deals | ☐ Pass ☐ Fail | |
| 2.3.2 | Disney "Book Now →" | External Disney site | ☐ Pass ☐ Fail | |
| 2.3.3 | Universal "Get Tickets →" | External Universal site | ☐ Pass ☐ Fail | |
| 2.3.4 | DVC "Calculate →" | /dvc | ☐ Pass ☐ Fail | |

### 2.4 Homepage Tools Section
| # | Link Text | Expected Destination | Status | Notes |
|---|-----------|---------------------|--------|-------|
| 2.4.1 | DVC Calculator card | /dvc | ☐ Pass ☐ Fail | |
| 2.4.2 | Hotel Comparison card | /results | ☐ Pass ☐ Fail | |
| 2.4.3 | Current Deals card | /deals | ☐ Pass ☐ Fail | |
| 2.4.4 | Passholder Hub card | /passholder | ☐ Pass ☐ Fail | |

### 2.5 Homepage Footer
| # | Link Text | Expected Destination | Status | Notes |
|---|-----------|---------------------|--------|-------|
| 2.5.1 | "Trip Builder" | #trip-builder | ☐ Pass ☐ Fail | |
| 2.5.2 | "Hotel Search" | /results | ☐ Pass ☐ Fail | |
| 2.5.3 | "DVC Calculator" | /dvc | ☐ Pass ☐ Fail | |
| 2.5.4 | "Current Deals" | /deals | ☐ Pass ☐ Fail | |
| 2.5.5 | "Passholder Hub" | /passholder | ☐ Pass ☐ Fail | |
| 2.5.6 | "Investors" | /investors | ☐ Pass ☐ Fail | |
| 2.5.7 | "Travel Agents" | /agents | ☐ Pass ☐ Fail | |
| 2.5.8 | "CR AudioViz AI" | https://craudiovizai.com | ☐ Pass ☐ Fail | |
| 2.5.9 | "Contact Us" | /contact | ☐ Pass ☐ Fail | |

### 2.6 Sub-Page Navigation (test from each page)
| # | Page | Back Link Works | All Nav Links Work | Status |
|---|------|-----------------|-------------------|--------|
| 2.6.1 | /results | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 2.6.2 | /dvc | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 2.6.3 | /deals | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 2.6.4 | /passholder | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 2.6.5 | /investors | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 2.6.6 | /agents | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 2.6.7 | /contact | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |

---

## 🎛️ SECTION 3: FUNCTIONALITY TESTS

### 3.1 Homepage Trip Builder
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 3.1.1 | Park selection | Click Disney card | Card highlights, checkmark appears | ☐ Pass ☐ Fail |
| 3.1.2 | Park deselection | Click selected card again | Card unhighlights, checkmark hides | ☐ Pass ☐ Fail |
| 3.1.3 | Multi-park select | Click Disney + Universal | Both highlighted | ☐ Pass ☐ Fail |
| 3.1.4 | Date picker - checkin | Select future date | Date populates | ☐ Pass ☐ Fail |
| 3.1.5 | Date picker - checkout | Select date after checkin | Date populates, trip length updates | ☐ Pass ☐ Fail |
| 3.1.6 | Trip length calc | Set 7-night stay | Shows "7 nights" | ☐ Pass ☐ Fail |
| 3.1.7 | Adults dropdown | Change to 3 adults | Selection persists | ☐ Pass ☐ Fail |
| 3.1.8 | Children dropdown | Change to 2 children | Selection persists | ☐ Pass ☐ Fail |
| 3.1.9 | DVC checkbox | Uncheck box | Box unchecked | ☐ Pass ☐ Fail |
| 3.1.10 | Military checkbox | Check box | Box checked | ☐ Pass ☐ Fail |
| 3.1.11 | Search button | Click "Find Best Deals" | Redirects to /results with params | ☐ Pass ☐ Fail |

### 3.2 Results Page Filters
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 3.2.1 | Type filter - Disney | Uncheck all except Disney | Only Disney hotels show | ☐ Pass ☐ Fail |
| 3.2.2 | Type filter - DVC | Check only DVC | Only DVC rentals show (3) | ☐ Pass ☐ Fail |
| 3.2.3 | Price filter - Under $150 | Check only Under $150 | Shows budget hotels | ☐ Pass ☐ Fail |
| 3.2.4 | Price filter - Multi | Check $150-300 AND $300-500 | Shows hotels in both ranges | ☐ Pass ☐ Fail |
| 3.2.5 | Amenity - Early Entry | Check Early Entry | Only hotels with early entry | ☐ Pass ☐ Fail |
| 3.2.6 | Amenity - Multiple | Check Pool AND Parking | Hotels must have BOTH | ☐ Pass ☐ Fail |
| 3.2.7 | Rating - 4.5+ | Select 4.5+ radio | Only 4.5+ rated hotels | ☐ Pass ☐ Fail |
| 3.2.8 | Combined filters | Type=DVC + Rating 4.5+ | Narrow results correctly | ☐ Pass ☐ Fail |
| 3.2.9 | No results | Apply impossible combo | Shows "No hotels match" message | ☐ Pass ☐ Fail |
| 3.2.10 | Reset filters | Click "Clear all" | All filters reset, all hotels show | ☐ Pass ☐ Fail |

### 3.3 Results Page Sort
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 3.3.1 | Price Low-High | Select from dropdown | Cheapest hotel first | ☐ Pass ☐ Fail |
| 3.3.2 | Price High-Low | Select from dropdown | Most expensive first | ☐ Pass ☐ Fail |
| 3.3.3 | Biggest Savings | Select from dropdown | Highest savings % first | ☐ Pass ☐ Fail |
| 3.3.4 | Guest Rating | Select from dropdown | Highest rated first | ☐ Pass ☐ Fail |
| 3.3.5 | Recommended | Select from dropdown | Balanced algorithm | ☐ Pass ☐ Fail |

### 3.4 Results Page Hotel Selection
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 3.4.1 | Select hotel | Click hotel card | Highlights with ring | ☐ Pass ☐ Fail |
| 3.4.2 | Bottom bar updates | Select hotel | Shows hotel name + total | ☐ Pass ☐ Fail |
| 3.4.3 | Continue button | Click "Continue to Booking" | Opens external URL | ☐ Pass ☐ Fail |
| 3.4.4 | Selection persists | Filter then check | Same hotel still selected | ☐ Pass ☐ Fail |

### 3.5 DVC Calculator
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 3.5.1 | Resort selection | Change dropdown | Points/prices update | ☐ Pass ☐ Fail |
| 3.5.2 | Room type | Change room type | Points change | ☐ Pass ☐ Fail |
| 3.5.3 | Season selection | Change season | Points change | ☐ Pass ☐ Fail |
| 3.5.4 | Date selection | Pick checkin/checkout | Night count updates | ☐ Pass ☐ Fail |
| 3.5.5 | Calculate button | Click calculate | Shows DVC vs Direct price | ☐ Pass ☐ Fail |
| 3.5.6 | Savings display | View results | Shows $ saved and % | ☐ Pass ☐ Fail |
| 3.5.7 | Broker links | Click rental broker | External site opens | ☐ Pass ☐ Fail |

### 3.6 Deals Page
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 3.6.1 | Filter tabs | Click "Disney" tab | Only Disney deals show | ☐ Pass ☐ Fail |
| 3.6.2 | Filter tabs | Click "Universal" | Only Universal deals | ☐ Pass ☐ Fail |
| 3.6.3 | All Deals tab | Click "All Deals" | All deals show | ☐ Pass ☐ Fail |
| 3.6.4 | External links | Click deal link | Opens external site | ☐ Pass ☐ Fail |

### 3.7 Passholder Hub
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 3.7.1 | Disney tab | Default or click Disney | Purple theme, Disney benefits | ☐ Pass ☐ Fail |
| 3.7.2 | Universal tab | Click Universal | Blue theme, Universal benefits | ☐ Pass ☐ Fail |
| 3.7.3 | SeaWorld tab | Click SeaWorld | Cyan theme, SeaWorld benefits | ☐ Pass ☐ Fail |
| 3.7.4 | Official links | Click "View All Passes" | Opens official site | ☐ Pass ☐ Fail |

---

## 💬 SECTION 4: JAVARI AI CHAT TESTS

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 4.1 | Open chat | Click robot FAB | Chat widget opens | ☐ Pass ☐ Fail |
| 4.2 | Close chat | Click X | Widget closes, FAB returns | ☐ Pass ☐ Fail |
| 4.3 | Send message | Type + click send | Message appears in chat | ☐ Pass ☐ Fail |
| 4.4 | Enter key | Type + press Enter | Message sends | ☐ Pass ☐ Fail |
| 4.5 | AI responds | Send any message | AI response appears | ☐ Pass ☐ Fail |
| 4.6 | Disney query | "Plan Disney trip" | Relevant Disney response | ☐ Pass ☐ Fail |
| 4.7 | Budget query | "How to save money" | Shows savings tips | ☐ Pass ☐ Fail |
| 4.8 | DVC query | "What is DVC" | Explains DVC rentals | ☐ Pass ☐ Fail |
| 4.9 | Links in response | Response has links | Links are clickable | ☐ Pass ☐ Fail |
| 4.10 | No repeat response | Send multiple messages | Different responses each time | ☐ Pass ☐ Fail |

---

## 📧 SECTION 5: EMAIL CAPTURE TESTS

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 5.1 | Modal appears | Wait 30 seconds | Modal pops up | ☐ Pass ☐ Fail |
| 5.2 | Close modal | Click X | Modal closes | ☐ Pass ☐ Fail |
| 5.3 | Modal submit | Enter email + submit | Success message | ☐ Pass ☐ Fail |
| 5.4 | Inline form | Enter email in hero | Success message | ☐ Pass ☐ Fail |
| 5.5 | Footer form | Enter email in footer | Success message | ☐ Pass ☐ Fail |
| 5.6 | Invalid email | Enter "notanemail" | Form validation error | ☐ Pass ☐ Fail |
| 5.7 | Modal once | Reload page | Modal doesn't repeat | ☐ Pass ☐ Fail |

---

## 📝 SECTION 6: FORM SUBMISSION TESTS

### 6.1 Contact Page Form
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 6.1.1 | Required fields | Submit empty | Validation errors | ☐ Pass ☐ Fail |
| 6.1.2 | Valid submission | Fill all + submit | Success message | ☐ Pass ☐ Fail |
| 6.1.3 | Email validation | Invalid email | Error shown | ☐ Pass ☐ Fail |

### 6.2 Investor Page Form
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 6.2.1 | Required fields | Submit empty | Validation errors | ☐ Pass ☐ Fail |
| 6.2.2 | Valid submission | Fill + submit | Success message | ☐ Pass ☐ Fail |
| 6.2.3 | Interest dropdown | Select different options | Selection works | ☐ Pass ☐ Fail |

### 6.3 Agent Signup Form
| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 6.3.1 | Required fields | Submit empty | Validation errors | ☐ Pass ☐ Fail |
| 6.3.2 | Valid submission | Fill all + submit | Success message | ☐ Pass ☐ Fail |
| 6.3.3 | Terms checkbox | Submit without checking | Error shown | ☐ Pass ☐ Fail |

---

## 📱 SECTION 7: RESPONSIVE DESIGN TESTS

| # | Device/Size | Page | Layout OK | Touch Works | Status |
|---|-------------|------|-----------|-------------|--------|
| 7.1 | Mobile (375px) | Homepage | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 7.2 | Mobile (375px) | Results | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 7.3 | Mobile (375px) | DVC | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 7.4 | Tablet (768px) | Homepage | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 7.5 | Tablet (768px) | Results | ☐ Yes | ☐ Yes | ☐ Pass ☐ Fail |
| 7.6 | Desktop (1280px) | All Pages | ☐ Yes | N/A | ☐ Pass ☐ Fail |

---

## ⚡ SECTION 8: PERFORMANCE TESTS

| # | Page | Load Time | Lighthouse Score | Status |
|---|------|-----------|------------------|--------|
| 8.1 | Homepage | _____ sec | _____ | ☐ Pass ☐ Fail |
| 8.2 | Results | _____ sec | _____ | ☐ Pass ☐ Fail |
| 8.3 | DVC | _____ sec | _____ | ☐ Pass ☐ Fail |

Target: <3 seconds, Lighthouse >70

---

## 🐛 SECTION 9: ERROR HANDLING TESTS

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 9.1 | 404 page | Visit /nonexistent | Shows 404 message | ☐ Pass ☐ Fail |
| 9.2 | Invalid params | /results?adults=abc | Page still loads | ☐ Pass ☐ Fail |
| 9.3 | Empty filters | Filter to no results | Shows "no results" | ☐ Pass ☐ Fail |

---

## 🔒 SECTION 10: SECURITY TESTS

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 10.1 | HTTPS | Check URL | https:// | ☐ Pass ☐ Fail |
| 10.2 | XSS in chat | Send <script>alert(1)</script> | Escaped, no alert | ☐ Pass ☐ Fail |
| 10.3 | XSS in forms | Submit <script> in fields | Escaped | ☐ Pass ☐ Fail |

---

## 📊 TEST SUMMARY

| Section | Total Tests | Passed | Failed | % Pass |
|---------|-------------|--------|--------|--------|
| 1. Page Load | 10 | | | |
| 2. Navigation | 30+ | | | |
| 3. Functionality | 35+ | | | |
| 4. Javari AI | 10 | | | |
| 5. Email Capture | 7 | | | |
| 6. Forms | 9 | | | |
| 7. Responsive | 6 | | | |
| 8. Performance | 3 | | | |
| 9. Error Handling | 3 | | | |
| 10. Security | 3 | | | |
| **TOTAL** | **116+** | | | |

---

## 🔴 ISSUES FOUND

| # | Page | Issue Description | Severity | Status |
|---|------|-------------------|----------|--------|
| | | | High/Med/Low | Open/Fixed |
| | | | | |
| | | | | |

---

## ✅ SIGN-OFF

**Tested By:** _______________
**Date:** _______________
**Overall Status:** ☐ Pass ☐ Fail ☐ Conditional Pass

**Notes:**
