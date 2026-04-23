# API Test Case Architecture - Restful Booker

## What Was Instructed
The objective was to act as a **Senior QA Automation Tester / Test Manager** and construct a comprehensive, enterprise-grade suite of API Test Cases targeting the endpoints documented at [Restful Booker API](https://restful-booker.herokuapp.com/apidoc/index.html).

Key instructions included:
- **Scope & Constraints:** Deliver a full scope of Test Scenarios mapped directly to CRUD endpoints (`POST /auth`, `GET /booking`, `POST /booking`, `PUT`, `PATCH`, `DELETE`).
- **TestCase Rigor:** Detail robust positive workflows alongside critical negative workflows (e.g., faulty invalid tokens, missing imperative JSON payload values, deleted retrieval checks). 
- **Formatting Conventions:** strictly utilize an Excel `.xlsx` grid mimicking the supplied `Test cases - Ultimate _ TheTestingAcademy.xlsx` reference framework. Mandatory fields requested were: `Test Case ID`, `Test Scenario`, `Preconditions`, `Test Steps`, `Test Data`, `Expected Result`, `Priority`, and `Status`.
- **Exclusivity Constraint:** Provide outputs without vagueness, assuming specific data (e.g., exact URLs, explicit HTTP Expected status codes).

## What Was Created
1. **`Project04_Task2_TestCases_API Documentation.xlsx`**
   - Synthesized using automated COM manipulation to format a highly readable, perfectly gridded Excel dataset.
   - Headers span from A to H, configured explicitly with Dark Blue backgrounds (`#00008B`) enforcing professional optics.
   - **Content Specifics:** Consists of 19 meticulously tailored API Test Scenarios. It defines explicit JSON payloads, authorization Cookie schemas (`token=<token>`), edge-case missing payloads resulting in explicit `400`/`500` HTTP traps, and boundaries for Unauthenticated `403 Forbidden` API interceptions.

2. **`README.md`** 
   - This exact documentation file recording what was mandated alongside the resulting executed deployment.

Couldnt save PROMPT -- It was RICE POT method