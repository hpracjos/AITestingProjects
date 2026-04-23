package com.salesforce.tests;

import com.salesforce.base.BaseTest;
import com.salesforce.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTests extends BaseTest {

    @Test(description = "Verify successful login with valid credentials")
    public void verifyValidLogin() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.navigateToLogin("https://login.salesforce.com/?locale=in");
            loginPage.enterUsername("valid.user@salesforce.com");
            loginPage.enterPassword("ValidPassword123!");
            loginPage.checkRememberMe();
            loginPage.clickLogin();
            
            boolean isDashboardDisplayed = loginPage.isDashboardDisplayed();
            Assert.assertTrue(isDashboardDisplayed, "Dashboard was not displayed after attempting valid login.");
        } catch (AssertionError | Exception e) {
            Assert.fail("Test failed due to an exception: " + e.getMessage(), e);
        }
    }

    @Test(description = "Verify failure message is displayed with invalid credentials")
    public void verifyInvalidLogin() {
        try {
            LoginPage loginPage = new LoginPage(driver);
            loginPage.navigateToLogin("https://login.salesforce.com/?locale=in");
            loginPage.enterUsername("invalid.user@salesforce.com");
            loginPage.enterPassword("WrongPassword123!");
            loginPage.clickLogin();

            String errorMessage = loginPage.getErrorMessage();
            Assert.assertTrue(errorMessage.contains("check your username and password") || errorMessage.contains("Please check your username and password"), "Error message text mismatch.");
        } catch (AssertionError | Exception e) {
            Assert.fail("Test failed due to an exception: " + e.getMessage(), e);
        }
    }
}
