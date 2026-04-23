package com.salesforce.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {
    private WebDriver driver;
    private WebDriverWait wait;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;
    
    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        PageFactory.initElements(driver, this);
    }

    public void navigateToLogin(String url) {
        try {
            driver.get(url);
        } catch (Exception e) {
            throw new RuntimeException("Failed to navigate to URL: " + url, e);
        }
    }

    public void enterUsername(String username) {
        try {
            WebElement input = wait.until(ExpectedConditions.visibilityOf(usernameInput));
            input.clear();
            input.sendKeys(username);
        } catch (Exception e) {
            throw new RuntimeException("Failed to enter username using XPath: //input[@id='username']", e);
        }
    }

    public void enterPassword(String password) {
        try {
            WebElement input = wait.until(ExpectedConditions.visibilityOf(passwordInput));
            input.clear();
            input.sendKeys(password);
        } catch (Exception e) {
            throw new RuntimeException("Failed to enter password using XPath: //input[@id='password']", e);
        }
    }

    public void clickLogin() {
        try {
            WebElement button = wait.until(ExpectedConditions.elementToBeClickable(loginButton));
            button.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click login button using XPath: //input[@id='Login']", e);
        }
    }
    
    public void checkRememberMe() {
        try {
            WebElement checkbox = wait.until(ExpectedConditions.elementToBeClickable(rememberMeCheckbox));
            if (!checkbox.isSelected()) {
                checkbox.click();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to click remember me checkbox using XPath: //input[@id='rememberUn']", e);
        }
    }

    public String getErrorMessage() {
        try {
            WebElement error = wait.until(ExpectedConditions.visibilityOf(errorMessage));
            return error.getText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve error message using XPath: //div[@id='error']", e);
        }
    }

    public boolean isDashboardDisplayed() {
        try {
            return wait.until(ExpectedConditions.urlContains("lightning"));
        } catch (Exception e) {
            return false;
        }
    }
}
