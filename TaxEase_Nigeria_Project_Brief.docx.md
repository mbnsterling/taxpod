**TaxEase Nigeria**

Tax Filing Made Simple

Project Brief & Product Plan  |  March 2026

| Product Name | TaxEase Nigeria |
| :---- | :---- |
| **Category** | FinTech / Tax Compliance SaaS |
| **Primary Market** | Nigeria (expansion: Ghana, Kenya, South Africa) |
| **Target Users** | Freelancers, SME owners, registered companies |
| **Tech Compliance** | **Nigeria Tax Act 2025** |
| **Filing Deadline** | Annual PIT Return: 30 June 2026 | Monthly VAT: 31 March 2026 |
| **Status** | Landing page live; Dashboard MVP in development |

# **1\. Executive Summary**

TaxEase Nigeria is a web-based tax compliance platform built for Nigerian entrepreneurs, freelancers, and small businesses. The product removes the complexity of self-assessment tax filing by guiding users step-by-step through income tracking, expense logging, tax estimation, and return submission — all within a single, jargon-free interface.

The platform is positioned around a clear value proposition: file your Nigerian taxes without the wahala. It is updated for the Nigeria Tax Act 2025 and targets the significant gap between the number of taxable individuals and those who actively file returns. Revenue is generated through a freemium SaaS model, with a free tier for basic filing and premium tiers for advanced features.

# **2\. Problem Statement**

Tax compliance in Nigeria suffers from three core friction points that TaxEase is designed to solve:

* Complexity. Self-assessment filing requires understanding PIT, VAT, PAYE, and other tax categories — knowledge most small business owners and freelancers do not have.

* Missed deadlines. Without proactive reminders, filers routinely miss PIT and VAT return windows, resulting in penalties.

* Poor tooling. Existing options require engaging accountants (expensive) or navigating FIRS portals designed for large enterprises. There is no accessible, guided tool for the informal and semi-formal segment.

TaxEase addresses all three by combining a smart calculator, a compliance dashboard, deadline alerts, and an AI-guided filing wizard into one affordable platform.

# **3\. Target Users**

**Primary Segment: Freelancers & Self-Employed**

* Digital professionals: designers, writers, developers, consultants

* Gig workers and platform-based income earners

* Individuals with multiple income sources who need to self-assess

**Secondary Segment: Small Business Owners**

* Shop owners, service businesses, and micro-enterprises

* Businesses transitioning from informal to formal tax registration

* Owners who need VAT tracking and monthly return filing

**Tertiary Segment: Registered Companies**

* Small incorporated companies needing company income tax (CIT) management

* Businesses that want to generate auditor-ready reports without an in-house accountant

# **4\. Product Architecture**

TaxEase is structured across five core modules, accessible through a persistent left-hand navigation sidebar. The dashboard serves as the command centre, aggregating data from all modules into a single compliance view.

## **4.1  Public-Facing Layer (Landing Page)**

The marketing site communicates the product value proposition, outlines the three-step filing process, showcases features, and drives conversion to account creation. Key sections include:

* Hero with primary CTA: "Start Filing — It's Free"

* Social proof statistics: accuracy rate, user rating, savings guarantee

* Feature highlights and how-it-works walkthrough

* Testimonials from Nigerian entrepreneurs

* Footer with product, resource, and company links

## **4.2  Onboarding Flow**

New users complete a structured onboarding sequence before reaching the dashboard:

1. Business type selection (Freelancer, Sole Trader, Registered Company)

2. TIN (Tax Identification Number) entry and verification

3. Profile setup: name, state of residence, tax year

Completing onboarding unlocks a 25% compliance score baseline ("Has TIN" step complete) and surfaces the remaining three compliance actions on the dashboard.

## **4.3  Dashboard Module**

The main user interface after login. The dashboard aggregates real-time data from all connected modules and surfaces the most critical information at a glance. Core components include:

| KPI Cards Total Income, Total Expenses, Estimated Tax, and Filing Deadline displayed as top-level summary metrics. | Compliance Score A circular progress indicator (0–100%) tracking completion across 4 milestones: TIN verified, income recorded, expenses recorded, return filed. |
| :---- | :---- |
| **Income by Category** Donut or bar chart breaking down income by source type (e.g. freelance, rental, dividends) once data is entered. | **Monthly Income Trend** Line chart showing month-over-month income across the current tax year. |
| **Recent Income** A list of the last 5 income entries with quick-add CTA for new users. | **Upcoming Deadlines** Countdown cards for Annual PIT Return and Monthly VAT Return with days remaining. |
| **Quick Actions** Shortcut buttons: Add Income, Add Expense, Start Filing, View Tax Estimate. |  |

## **4.4  Income Module**

Users log all income sources manually or via CSV import. Each entry captures:

* Income type (freelance, salary, rental, business, investment, other)

* Amount in Naira, date received, and description/client name

* Repeat/recurring income flag for subscription-based earners

The module feeds the tax calculator with gross income data and populates the Income by Category and Monthly Trend charts on the dashboard.

## **4.5  Expenses Module  (Planned)**

The expenses module will allow users to log deductible business expenses to reduce their taxable income. Key capabilities planned:

* Categorised expense entry (office, transport, equipment, software, professional fees, etc.)

* Receipt upload for documentation purposes

* Automatic allowable deduction suggestions based on business type and Nigeria Tax Act 2025 rules

* Running deduction total surfaced in the Estimated Tax calculation

## **4.6  Smart Tax Calculator**

The tax calculator sits behind the "View Tax Estimate" quick action and will automatically compute:

* Personal Income Tax (PIT) using the progressive rate schedule under the Nigerian Tax Act 2025

* Value Added Tax (VAT) obligations based on turnover thresholds

* Effective tax rate and net take-home displayed clearly alongside gross income

The calculator updates in real time as income and expense entries are added, giving users a live view of their tax liability throughout the year.

## **4.7  File Return Module  (Planned)**

The guided filing wizard is the core product differentiator. It walks users through return submission in a step-by-step, question-and-answer format. The flow will cover:

4. Review: Summary of income, expenses, and computed tax for the year

5. Declaration: Taxpayer confirms accuracy of submitted data

6. Generate: Instant PDF of the completed tax return document

7. Submit: Direct submission via FIRS portal integration or downloadable PDF for manual submission

# **5\. Compliance & Tax Logic**

TaxEase is built around Nigerian tax law and compliance calendars. The following tax types are addressed in the platform:

| Tax Type | Who It Applies To | Filing Frequency | Deadline |
| :---- | :---- | :---- | :---- |
| Personal Income Tax (PIT) | Freelancers, self-employed | Annual | 30 June |
| Value Added Tax (VAT) | Businesses with VAT registration | Monthly | 21st of following month |
| Company Income Tax (CIT) | Registered companies | Annual | 6 months after year-end |
| Withholding Tax (WHT) | Service providers | Per transaction | 21 days after deduction |

# **6\. Notification & Reminder System**

Deadline reminders are a named feature in TaxEase. The notification system will operate across three channels:

* SMS: Sent via a Nigerian bulk SMS provider (e.g. Termii, Arkesel) for users without consistent email access

* Email: Automated reminder emails at 30 days, 14 days, 7 days, and 1 day before each deadline

* WhatsApp: WhatsApp Business API messages for high-engagement deadline nudges, given WhatsApp's penetration in the Nigerian market

Reminder logic is tied to each user's registered tax obligations (PIT vs. VAT vs. CIT) and activated once their profile is complete.

# **7\. Revenue Model**

TaxEase operates on a freemium SaaS model with the following tier structure:

| Tier | Features Included | Target User |
| :---- | :---- | :---- |
| Free | Income tracking, tax estimate, compliance dashboard, 1 PDF report/year | Individuals filing PIT only |
| Pro (Paid) | Everything free \+ expense tracking, VAT returns, unlimited PDFs, email reminders, priority support | Active freelancers, sole traders |
| Business (Paid) | Everything Pro \+ CIT, multi-user access, accountant sharing, API access | Registered SMEs, growing businesses |

# **8\. Development Roadmap**

**Phase 1 — Foundation  (Current / Q1 2026\)**

* Public landing page: live

* User authentication and onboarding flow: live

* Dashboard shell with compliance score widget: live

* Income module (manual entry): live

* Estimated tax calculator (PIT): in progress

**Phase 2 — Core Filing  (Q2 2026\)**

* Expense module with deduction engine

* Guided filing wizard for PIT annual return

* Instant PDF report generation

* Deadline reminder system (email \+ SMS)

* VAT return module

**Phase 3 — Growth & Scale  (Q3–Q4 2026\)**

* WhatsApp notification integration

* CSV/bank statement import for income and expenses

* Accountant/advisor sharing feature

* Company Income Tax (CIT) module

* Mobile-responsive PWA or native app

* Expansion markets: Ghana, Kenya, South Africa

# **9\. Key Success Metrics**

The following KPIs will be used to measure product-market fit and growth:

| Registered Users Total signups and activation rate (users who complete onboarding). | Returns Filed Number of PIT and VAT returns completed and submitted through the platform. |
| :---- | :---- |
| **Compliance Score Distribution** Average compliance score across the user base — target 75%+ after 90 days. | **Conversion Rate** Free to paid tier conversion, target 8–12% within 6 months of Pro launch. |
| **Accuracy Rate** Tax computations verified against FIRS assessments — target 98%+ (as per landing page claim). | **Churn Rate** Monthly and annual subscription cancellations; target \<5% monthly churn. |

# **10\. Risks & Mitigations**

* Regulatory changes: Nigeria Tax Act amendments may require rapid updates to tax logic. Mitigate with a rule-engine architecture that separates tax rate data from application code.

* Low filing culture: Many target users have never filed a return. Mitigate with extensive in-app education, tooltip guidance, and plain-language copy.

* FIRS portal reliability: Direct submission integration depends on FIRS API availability. Mitigate by offering PDF download as a fallback submission path.

* Trust barriers: First-time users may be hesitant to share financial data. Mitigate with clear privacy policy, SSL/TLS, and no-log assurances visible at key UX touchpoints.

TaxEase Nigeria — Confidential Project Brief  |  March 2026