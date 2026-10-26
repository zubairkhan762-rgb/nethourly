# US Payroll & FLSA Wage Calculation Rules (Reference Context)

Always follow these exact US labor standards when writing calculation logic:

1. **Pay Frequencies (Based on 52 Weeks/Year):**
   - **Hourly:** Base Rate ($/hr)
   - **Daily:** `(Hourly * HoursPerWeek) / 5` (Standard 5-day workweek)
   - **Weekly:** `Hourly * HoursPerWeek` (52 paychecks/year)
   - **Bi-Weekly (Most Common in US):** `(Weekly * 2)` or `(Annual / 26)` (26 paychecks/year)
   - **Semi-Monthly:** `Annual / 24` (Paid on 1st and 15th -> 24 paychecks/year)
   - **Monthly:** `Annual / 12` (12 paychecks/year)
   - **Annual Gross:** `Hourly * HoursPerWeek * WeeksPerYear`

2. **Overtime Rules (FLSA Standard):**
   - **Time and a Half (1.5x):** `Hourly * 1.5` (Applies to hours worked over 40/week)
   - **Double Time (2x):** `Hourly * 2.0` (Applies to holidays or California 12+ hr shifts)

3. **24-Hour Shift & Live-In Caregiver Rules (FLSA Sleep/Meal Exclusion):**
   - Total Shift = 24 Hours.
   - **Sleep Time Deduction:** Up to 8 hours can be excluded ONLY IF the worker gets at least 5 hours of uninterrupted sleep.
   - **Meal Time Deduction:** Up to 3 hours (1 hr each for breakfast, lunch, dinner) can be excluded if duty-free.
   - **Payable Hours in 24-Hr Shift:** `24 - SleepDeduction (0 to 8) - MealDeduction (0 to 3)`.
   - **Daily Overtime Split Mode (e.g., California Rule):** First 8 payable hours = Regular Rate (1x), Hours 8 to 12 = 1.5x Overtime, Hours beyond 12 = 2.0x Double Time.

4. **US Tax Approximations (For Quick Net Take-Home Toggle):**
   - **FICA Tax (Mandatory):** `7.65%` (6.2% Social Security + 1.45% Medicare).
   - **Standard Single Filer Effective Estimate:** `~18%` total (FICA 7.65% + ~10.35% Effective Federal Tax).
   - **High-Tax State (CA/NY/NJ/OR) Estimate:** `~24%` total.
   - **No Income Tax State (TX/FL/WA/NV) Estimate:** `~15%` total (FICA + Federal only).