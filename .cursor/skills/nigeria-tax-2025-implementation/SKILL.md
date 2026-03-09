---
name: nigeria-tax-2025-implementation
description: Guides implementation of Nigeria Tax Act 2025 and related 2025 tax reform acts inside the TaxEase Nigeria app, including PIT bands, VAT rules, small-business reliefs, development levy, digital assets, and VAT input credits. Use when updating calculators, filing flows, or compliance logic to reflect the 2025 framework.
---

# Nigeria Tax 2025 Implementation

## Purpose

This skill aligns the **TaxEase Nigeria** app with the **Nigeria Tax Act (NTA) 2025** and companion 2025 tax reform acts.

Use it whenever you:
- Design or change **tax calculators** (PIT, VAT, CIT, CGT, development levy).
- Build or adjust **filing and reporting flows** (PIT returns, VAT returns, CIT, WHT summaries).
- Model **tax-relevant data** (income types, expenses, digital assets, thresholds, exemptions).
- Respond to **regulatory changes** that impact tax logic or compliance UX.

The context is the Next.js/T3-style TaxEase app described in `TaxEase_Nigeria_Project_Brief.docx.md`.

## Law Overview (Developer-Oriented)

High-level points from public commentary on the 2025 reforms (NTA, NTAA, NRSA, JTBA):

- **Consolidation**
  - NTA 2025 consolidates legacy **CITA, PPTA, CGTA, PITA, VAT Act, Stamp Duties** into a **single statute**.
  - Objective: remove overlapping/conflicting provisions; simplify compliance and administration.

- **Small Business Relief**
  - **Small enterprises** (turnover ≤ ₦100m and fixed assets ≤ ₦250m) are **fully exempt** from **CIT, CGT, and the new Development Levy**.

- **Development Levy**
  - A **4% Development Levy** replaces multiple prior earmarked levies (Tertiary Education Tax, IT Levy, NASENI Levy, Police Trust Fund, etc.).

- **Capital Gains & Digital Assets**
  - Corporate **CGT increases** from 10% to **30%** (aligned with corporate income tax).
  - Individuals pay CGT at **their PIT band rates**.
  - **Digital/virtual asset transactions** are explicitly taxable; losses are only deductible against digital asset business profits.

- **Minimum Effective Tax Rate**
  - Large entities (turnover ≥ ₦50bn or MNEs with global turnover ≥ €750m) must meet a **15% minimum effective tax rate**, with “top-up” liabilities where effective tax falls short.

- **VAT**
  - Standard **VAT rate remains 7.5%**.
  - **Input VAT credits expanded**:
    - Service providers can now claim **input VAT on all vatable purchases**.
    - Input VAT on **fixed assets** is recoverable where assets are used to make vatable supplies.
  - **Disallowed deductions**: expenses for which VAT should have been charged but was not are **non-deductible**.
  - **Zero-rating extended** to more essentials (exports other than crude oil/natural gas, tuition and school fees, basic medical/healthcare, electricity generation and transmission, textbooks, medicines/pharmaceuticals, basic foodstuffs).
  - **Electronic fiscalisation**: encrypted electronic fiscal devices and e-invoicing required for vatable sales over time.

- **Administration & Data**
  - **Nigeria Revenue Service (NRS)** replaces FIRS as the unified federal tax body.
  - A single **TIN** regime, digital filing, e-invoicing, and centralised data sharing via the Joint Tax Board framework.

For exact wording, rates, thresholds, and effective dates, always cross‑check the **NTA 2025 text** and current **official NRS/FIRS circulars** before hard-coding anything.

## Mapping Law → TaxEase Product

From the project brief, TaxEase has these core tax-relevant modules:

- **Smart Tax Calculator**
  - PIT calculation using **progressive bands under NTA 2025**.
  - VAT obligations based on **turnover thresholds** and registration status.
  - Future extensions: CIT, CGT, development levy, WHT summaries.

- **Income Module**
  - Tracks income by **type** (freelance, salary, rental, business, investment, other).
  - Feeds calculators for **PIT, VAT, WHT, and digital assets**.

- **Expenses Module**
  - Logs deductible expenses.
  - Applies NTA 2025 **allowable-deduction rules** and VAT conditions (no deduction where VAT should have been charged but wasn’t).

- **File Return Module**
  - Guided PIT filing (and later VAT/CIT) with summaries consistent with NTA 2025 terminology and line items.

- **Notification System**
  - Encodes correct **filing frequencies** and **deadlines** under the 2025 administrative framework.

The sections below give concrete implementation patterns tailored to this app’s tech stack and the `.cursor/rules/create-t3-app-standards.mdc` conventions (Formik + Zod, tRPC by domain, etc.).

## Implementation Principles

- **Separate tax rules from app code**
  - Store **rates, bands, thresholds, and zero-rated lists** in structured **config (TS constants or DB tables)**, not inline throughout business logic.
  - Represent each **tax year** explicitly (e.g. `taxYear: 2024 | 2025 | 2026`) so you can switch rules or support prior-year filings.

- **Model tax contexts explicitly**
  - Pass a structured `TaxContext` object into calculators:
    - `taxYear`, `residentState`, `businessType` (freelancer / sole trader / company),
    - `turnover`, `fixedAssetsValue`,
    - `hasVATRegistration`, `isSmallEnterprise`, `incomeBreakdown`, `expenseBreakdown`, `digitalAssetPositions`, etc.

- **Keep calculators pure and deterministic**
  - Functions should take **plain inputs** (context + amounts) and produce a **fully explained result** (tax components, effective rate, notes).
  - Avoid reading from global state, React hooks, or Prisma directly inside calculators; those should live in **service helpers** or **tRPC procedures**.

- **Explain results to humans**
  - For each computed tax, return both **numeric values** and **short textual reasons**:
    - e.g. `"Small enterprise exempt from Development Levy under NTA 2025; turnover and fixed assets below thresholds."`
  - Surface these messages in the UI so users understand how 2025 rules are being applied.

## Personal Income Tax (PIT) – Progressive Bands

### What needs to be true

- PIT logic should:
  - Use the **NTA 2025 PIT rate schedule** and relevant reliefs.
  - Handle **tax-free thresholds**, progressive bands, and **appropriate reliefs/allowances**.
  - Support **multi-source income** (freelance, rental, dividends, salary, etc.).

### Implementation pattern

1. **Define PIT bands per tax year**
   - Create a **config module** (e.g. `src/server/tax/config/pit-nta-2025.ts`) that exports:
     - PIT **bands** (`lower`, `upper`, `rate`),
     - **Tax-free thresholds** and **reliefs** as separate constants.
   - Derive **TypeScript types** from these objects to avoid mismatches.

2. **Implement core PIT calculator**
   - Add a pure function in a dedicated service file (e.g. `src/server/tax/pit.ts`):
     - Input: `TaxContext` + `totalChargeableIncome`.
     - Output: breakdown per band, total PIT, effective rate, and explanation string array.

3. **Wire into tRPC**
   - In a domain router (e.g. `taxRouter`), add:
     - `estimatePIT` **query** or **mutation** with a **Zod input schema** (income summary, tax year, residency, etc.).
     - Use the PIT calculator in the resolver and return the structured breakdown.

4. **Connect to UI**
   - From the dashboard and “View Tax Estimate” entry point:
     - Call the `estimatePIT` procedure.
     - Display:
       - **Total PIT**, **effective tax rate**, and **net take-home**.
       - A **band-by-band breakdown** so users can see how progressive rates applied.

5. **Keep rates up to date**
   - When PIT bands change:
     - Add **new config** for the affected tax year; **do not** alter past-year config in-place.
     - Add tests that assert sample scenarios for each year.

**Important:** Do **not** embed actual numeric bands in this skill. Always read the current PIT schedule from the official NTA 2025 text or up-to-date professional summaries before setting config values.

## VAT – Rate, Input Credits, Zero-Rating

### What needs to be true

- VAT logic in TaxEase must:
  - Apply a **7.5% standard rate**.
  - Respect **VAT registration status** and **turnover thresholds**.
  - Implement **expanded input VAT deductibility** for services and fixed assets.
  - Prevent deduction of expenses where **VAT should have been charged but wasn’t**.
  - Recognise **zero-rated supplies** so output VAT is zero but input VAT may be recoverable.

### Implementation pattern

1. **Model VAT attributes on income and expenses**
   - Income entries:
     - `isVatable`, `vatCollectedAmount`, `supplyCategory` (standard / zero-rated / exempt).
   - Expense entries:
     - `isBusinessExpense`, `shouldHaveVAT`, `vatPaidAmount`, `vatDocumented` (true if supported by invoice/receipt).

2. **Create VAT config**
   - A config file (e.g. `src/server/tax/config/vat-nta-2025.ts`) should define:
     - `standardRate = 0.075`.
     - `zeroRatedCategories` (aligned with NTA 2025, e.g. specific essential goods/services).
     - Any **turnover threshold(s)** for mandatory registration.

3. **Implement VAT calculator**
   - Core function:
     - Input: `TaxContext` (especially VAT registration, turnover) + lists of income and expense items.
     - Output:
       - Output VAT, input VAT eligible for credit, **disallowed expenses** (with reasons), and net VAT payable or refundable.
   - Apply NTA 2025 rules:
     - Allow **input VAT on vatable purchases**, including fixed assets, where used for vatable supplies.
     - Enforce **non-deductibility** of expenses where VAT should have been charged but wasn’t.

4. **Handle VAT refunds**
   - If net VAT is refundable:
     - Return metadata for the UI (e.g. “eligible VAT refund”, reference to NTA 2025 refund rules).
     - This prepares the product for future integration with digital refund processes described in the reforms.

5. **UI & onboarding**
   - Onboarding should collect:
     - **VAT registration status**, **registration date**, and **approximate annual turnover**.
   - The VAT module should:
     - Indicate whether the user is **below threshold** but voluntarily registered, or **above threshold** and required to register.

## Small Enterprises & Development Levy

### Small enterprise classification

- Maintain on the user/business profile:
  - `annualTurnover`
  - `fixedAssetsValue`
  - Derived field: `isSmallEnterprise` (turnover ≤ ₦100m AND fixed assets ≤ ₦250m).

### Applying relief in calculators

- **CIT & CGT**:
  - If `isSmallEnterprise` is true:
    - **Skip CIT and CGT charges** for that period and clearly annotate the reason in results.

- **Development Levy (4%)**
  - Implement Development Levy as a **separate tax component** in corporate calculators:
    - Only apply where `!isSmallEnterprise`.
    - Use a **configurable base** (aligned with the latest guidance—typically profit/adjusted profit rather than turnover).
  - Keep the levy amount and base visible to users (especially Business tier customers).

## Digital Assets & CGT

### Data model

- Extend the **Income Module** to support:
  - `incomeType: 'digitalAssetGain' | 'digitalAssetBusiness' | ...`
  - For digital asset positions, track:
    - Acquisition cost, disposal proceeds, realised gains/losses, and whether held in a **trading** or **investment** capacity.

### Calculator rules

- CGT:
  - Apply **corporate CGT at 30%** for companies.
  - For individuals, tax digital asset gains at the **PIT band rate** applicable to their total income.
- Loss relief:
  - Restrict **digital asset losses** to offset **only digital asset business profits**, as indicated by commentary on NTA 2025.

### UI/UX

- Clearly label digital asset sections as **higher-risk/complex** and, where appropriate, recommend users seek advice.
- Provide short tooltips that reference **NTA 2025 treatment of digital/virtual assets**.

## Minimum Effective Tax Rate (15%) – Large Entities

For TaxEase’s initial target segments (freelancers, SMEs, small companies), most users will be **below** the NTA 2025 15% minimum effective tax rate thresholds.

Implementation guidance:

- Add checks for:
  - `annualTurnover >= 50_000_000_000` (₦50bn) OR `isMultinationalEnterprise === true`.
- If triggered:
  - For now, display a **notice** that TaxEase does not fully implement the **minimum effective tax regime** and that such entities should consult specialist advisors.
  - Optionally, gate this behind an **“Enterprise” plan** or separate feature flag if you later choose to support it.

## Notifications, Filing Frequencies, and Deadlines

Base notification logic on **current NTA/NTAA filing obligations** and the project brief:

- **PIT**: annual, typically due by **30 June** for individuals.
- **VAT**: monthly, due by **21st of the following month** (confirm against current NRS guidance).
- **CIT**: annual, commonly **6 months after year‑end**.
- **WHT**: per transaction, remittance around **21 days after deduction**.

Implementation pattern:

- Store all **deadlines and frequencies** in a small config module (per tax type) with:
  - `frequency` (annual, monthly, perTransaction),
  - `dueDateRule` (e.g. `"30 June"`, `"21st of next month"`, `"6 months after year-end"`),
  - flags for `emailReminderOffsets`, `smsReminderOffsets`, `whatsAppReminderOffsets`.
- The notification service should:
  - Use that config, not ad‑hoc date math scattered around the codebase.
  - Support **tax-year-specific overrides** if NTA/NTAA change dates later.

## T3 App Integration Patterns

Follow `.cursor/rules/create-t3-app-standards.mdc` when applying tax rules:

- **Forms (Formik + Zod)**
  - For tax-related forms (e.g. profile setup, VAT registration info, income/expense entry, filing wizard steps):
    - Define **Zod schemas** capturing tax fields (e.g. `annualTurnover`, `fixedAssetsValue`, `hasVATRegistration`, `supplyCategory`, `vatPaidAmount`).
    - Derive `FormValues` types via `z.infer`.
    - Use `toFormikValidationSchema` to power Formik validation from Zod.

- **tRPC Routers**
  - Group procedures by domain:
    - `taxRouter` (calculators, summaries),
    - `filingRouter` (PIT/VAT/CIT filing wizards),
    - `notificationRouter` (reminder preferences).
  - Each procedure should validate **inputs with Zod** and delegate tax math to **pure helper functions**.

- **Server Components**
  - For Next.js server components that need tax data (e.g. dashboard widgets):
    - Treat `params` as async (`Promise<...>`) and `await` them at the top.
    - Call tRPC or service functions to fetch **pre‑computed tax summaries** rather than re‑implementing logic in the component.

## Workflow for Updating Tax Rules

When NTA or related regulations change again:

1. **Identify scope**
   - Determine whether the change affects **rates**, **bands**, **allowable deductions**, **deadlines**, or **administrative processes**.

2. **Update config, not logic**
   - Prefer adding/updating entries in **tax config modules or DB tables**.
   - Avoid duplicating rules in multiple places; keep each tax concept defined in exactly one module.

3. **Adjust calculators**
   - Where the **structure of the rule** changes (e.g. new band style, new exemption structure), update the relevant calculator functions and their tests.

4. **Align UX copy**
   - Ensure UI labels, tooltips, and help text reflect the new 2025+ wording (e.g. “Nigeria Revenue Service”, “Development Levy”).

5. **Regression tests**
   - Maintain **sample scenarios** (fixtures) representing common Nigerian user profiles (freelancer, VAT‑registered SME, small company) and assert that:
     - PIT, VAT, and other taxes match expected outputs for each tax year.

## Additional Resources

- **Always consult**:
  - The latest **Nigeria Tax Act 2025** consolidated text.
  - Current **NRS/FIRS circulars** and reputable professional commentaries (Big‑4 firm alerts, legal/tax advisory articles).
- Use those sources to:
  - Confirm **current PIT rate bands and reliefs**.
  - Validate **VAT threshold details**, **zero-rated lists**, and **administrative deadlines**.
  - Clarify **ambiguous areas** (e.g. Development Levy base, digital asset classification).

