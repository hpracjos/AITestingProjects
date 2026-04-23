# Enterprise Salesforce UI Automation Framework

## 📖 Project Overview
This repository contains a robust, enterprise-grade Selenium automation framework specifically designed to test the Salesforce login application. The architecture enforces strict coding standards, dynamic elements synchronization, and comprehensive test reporting.

## 🛠️ Technology Stack
* **Language:** Java 11+
* **Automation Tool:** Selenium WebDriver 4.20.0
* **Testing Framework:** TestNG 7.9.0
* **Build Tool:** Apache Maven
* **Reporting:** Allure TestNG
* **Driver Management:** WebDriverManager (Bonigarcia)

## 🏗️ Framework Architecture & Design Patterns
### 1. Page Object Model (POM) with PageFactory
The framework strictly adheres to the Page Object Model structure. All UI locators and page-specific interactions are isolated inside the `src/main/java/com/salesforce/pages` directory. 
* Elements are initialized dynamically using `PageFactory.initElements()`.
* **Locators:** Strictly implemented using pure `XPath` for resilient and scalable identification (CSS, ID, and Name locators are intentionally avoided).

### 2. Synchronization Strategy
`Thread.sleep()` is completely prohibited within this framework. 
* The framework relies exclusively on Selenium's **Explicit Waits (`WebDriverWait`)** paired with `ExpectedConditions` to handle dynamic rendering, maximizing test speed and preventing flaky executions.

### 3. Robust Exception Handling
Every critical interaction inside the Page classes is wrapped in strict `try-catch` blocks. If an element cannot be found or clicked, a meaningful runtime exception provides pinpoint accuracy on which XPath failed, ensuring that error logs are highly readable for rapid debugging.

---

## 📂 Directory Structure
```text
Project_02_RICE_POT_SeleniumFramework/
├── src/
│   ├── main/java/com/salesforce/pages/       # Page Object Classes (e.g., LoginPage.java)
│   └── test/java/com/salesforce/             
│       ├── base/                             # Core Setup & Teardown (BaseTest.java)
│       └── tests/                            # TestNG Test Scripts (LoginTests.java)
├── pom.xml                                   # Maven dependencies & plugins
├── testng.xml                                # Test suite execution configuration
└── README.md                                 # Project documentation
```

---

## 🚀 Environment Setup & Execution Instructions

### Prerequisites
Before running the tests, ensure you have the following installed and configured on your system:
1. **Java JDK 11** or higher (Ensure `JAVA_HOME` is set).
2. **Apache Maven** (Ensure `MAVEN_HOME` is set and `mvn` is accessible via your terminal PATH).

### Running the Test Suite
To trigger the automated test suite, navigate to the project root directory using your terminal and run:
```bash
mvn clean test
```
*This command will invoke the `maven-surefire-plugin`, execute the `testng.xml` suite, and produce the raw `allure-results` metadata.*

### Generating and Viewing the Allure Report
Once the execution is fully completed, you can render the interactive dashboard using the Allure Maven Plugin:
```bash
mvn allure:serve
```
*This spins up a local web server and automatically opens the Allure graphical report in your default browser, allowing you to comprehensively examine the test metrics, execution durations, and step-by-step outcomes.*

---

## 🧪 Included Test Scenarios (Salesforce Login)
1. **`verifyValidLogin`**: Supplies correct credentials, authenticates the user, and dynamically asserts that the Salesforce Lightning Dashboard is displayed.
2. **`verifyInvalidLogin`**: Supplies incorrect credentials and strictly verifies the presence and exact text of the expected failure message on the User Interface.
