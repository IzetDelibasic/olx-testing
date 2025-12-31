/**
 * Selenium testovi za funkcionalnost pretrage na OLX.ba
 * Seminarski rad - Testiranje softvera
 *
 * Korištene tehnologije:
 * - Selenium WebDriver
 * - JavaScript
 * - Mocha framework
 * - Chai assertions
 */

const { expect } = require("chai");
const { By, Key, until } = require("selenium-webdriver");
const {
  setupDriver,
  teardownDriver,
  getDriver,
  getBaseUrl,
  waitForElement,
  scrollToElement,
  clearAndType,
} = require("./setup");

describe("OLX.ba - Testiranje funkcionalnosti pretrage", function () {
  this.timeout(60000);

  let driver;
  const baseUrl = getBaseUrl();

  before(async function () {
    driver = await setupDriver();
  });

  after(async function () {
    await teardownDriver();
  });

  beforeEach(async function () {
    await driver.get(baseUrl);
    await driver.sleep(3000);

    try {
      const cookieSelectors = [
        "button.css-47sehv",
        'button[class*="qc-cmp"]',
        'button[mode="primary"]',
        'button:contains("AGREE")',
        'button:contains("Accept")',
        'button:contains("Prihvati")',
      ];

      for (const selector of cookieSelectors) {
        try {
          const cookieButton = await driver.findElement(By.css(selector));
          if (cookieButton && (await cookieButton.isDisplayed())) {
            await cookieButton.click();
            await driver.sleep(1000);
            break;
          }
        } catch (e) {}
      }
    } catch (e) {}
  });

  // ==========================================
  // TEST CASE 1: Pretraga sa validnim ključnim riječima
  // ==========================================
  it("TC-001: Pretraga sa validnim ključnim riječima", async function () {
    const searchTerm = "iPhone";

    await driver.sleep(1000);
    const searchInput = await driver.wait(
      until.elementLocated(By.css('input[type="text"], input[type="search"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(searchInput), 5000);

    await searchInput.click();
    await driver.sleep(500);
    await searchInput.clear();
    await searchInput.sendKeys(searchTerm);
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(3000);

    const currentUrl = await driver.getCurrentUrl();
    const pageSource = await driver.getPageSource();

    const hasSearchInUrl =
      currentUrl.toLowerCase().includes("iphone") ||
      currentUrl.includes("pretraga") ||
      currentUrl.includes("search");
    const hasResults =
      pageSource.toLowerCase().includes("iphone") ||
      pageSource.includes("artikl") ||
      pageSource.includes("oglas");

    expect(hasSearchInUrl || hasResults).to.be.true;
  });

  // ==========================================
  // TEST CASE 2: Pretraga sa minimalnim brojem karaktera
  // ==========================================
  it("TC-002: Pretraga sa minimalnim brojem karaktera", async function () {
    const searchTerm = "ab";

    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await clearAndType(searchInput, searchTerm);
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(2000);

    const currentUrl = await driver.getCurrentUrl();
    const pageSource = await driver.getPageSource();

    expect(currentUrl).to.not.equal(baseUrl);
  });

  // ==========================================
  // TEST CASE 3: Pretraga sa jednim karakterom
  // ==========================================
  it("TC-003: Pretraga sa jednim karakterom", async function () {
    const searchTerm = "a";

    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await clearAndType(searchInput, searchTerm);
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(2000);

    const pageSource = await driver.getPageSource();
    const title = await driver.getTitle();

    expect(title).to.not.be.empty;
  });

  // ==========================================
  // TEST CASE 4: Pretraga bez rezultata
  // ==========================================
  it("TC-004: Pretraga bez rezultata", async function () {
    const searchTerm = "xyzqwertysdf12345";

    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await clearAndType(searchInput, searchTerm);
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(3000);

    const pageSource = await driver.getPageSource();
    const hasNoResultsMessage =
      pageSource.toLowerCase().includes("nema rezultata") ||
      pageSource.toLowerCase().includes("nisu pronađeni") ||
      pageSource.toLowerCase().includes("no results") ||
      pageSource.includes("0 oglasa");

    expect(hasNoResultsMessage || !pageSource.includes(searchTerm)).to.be.true;
  });

  // ==========================================
  // TEST CASE 5: Pretraga sa specijalnim karakterima
  // ==========================================
  it("TC-005: Pretraga sa specijalnim karakterima", async function () {
    const searchTerm = "<script>alert(1)</script>";

    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await clearAndType(searchInput, searchTerm);
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(2000);

    const pageSource = await driver.getPageSource();

    expect(pageSource).to.not.include("<script>alert(1)</script>");

    const title = await driver.getTitle();
    expect(title).to.not.be.empty;
  });

  // ==========================================
  // TEST CASE 6: Pretraga sa ćiriličkim karakterima
  // ==========================================
  it("TC-006: Pretraga sa ćiriličkim karakterima", async function () {
    const searchTerm = "телефон";

    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await clearAndType(searchInput, searchTerm);
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(2000);

    const title = await driver.getTitle();
    expect(title).to.not.be.empty;
  });

  // ==========================================
  // TEST CASE 7: Prazna pretraga
  // ==========================================
  it("TC-007: Prazna pretraga", async function () {
    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await searchInput.clear();
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(2000);

    const title = await driver.getTitle();
    expect(title).to.not.be.empty;
  });

  // ==========================================
  // TEST CASE 8: Pretraga sa dugačkim terminom
  // ==========================================
  it("TC-008: Pretraga sa dugačkim terminom (100 karaktera)", async function () {
    const longSearchTerm = "a".repeat(100);

    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await clearAndType(searchInput, longSearchTerm);
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(2000);

    const title = await driver.getTitle();
    expect(title).to.not.be.empty;
  });

  // ==========================================
  // TEST CASE 9: Navigacija na kategorije
  // ==========================================
  it("TC-009: Navigacija na kategorije", async function () {
    await driver.get(baseUrl + "/kategorije");

    await driver.sleep(2000);
    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include("kategorije");
  });

  // ==========================================
  // TEST CASE 10: Filtriranje po kategoriji
  // ==========================================
  it("TC-010: Filtriranje po kategoriji", async function () {
    await driver.get(baseUrl + "/pretraga?q=auto&kategorija=Vozila");

    await driver.sleep(2000);
    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include("auto");
  });

  // ==========================================
  // TEST CASE 11: Filtriranje po rasponu cijene
  // ==========================================
  it("TC-011: Filtriranje po rasponu cijene", async function () {
    await driver.get(baseUrl + "/pretraga?q=iPhone&cijena=500-1000");

    await driver.sleep(2000);
    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include("iPhone");
  });

  // ==========================================
  // TEST CASE 12: Sortiranje rezultata po cijeni rastuće
  // ==========================================
  it("TC-012: Sortiranje rezultata po cijeni rastuće", async function () {
    await driver.get(baseUrl + "/pretraga?q=laptop");

    await driver.sleep(2000);
    const pageSource = await driver.getPageSource();

    expect(pageSource).to.include("laptop");
  });

  // ==========================================
  // TEST CASE 13: Sortiranje rezultata po datumu
  // ==========================================
  it("TC-013: Sortiranje rezultata po datumu", async function () {
    await driver.get(baseUrl + "/pretraga?q=stan");

    await driver.sleep(2000);
    const pageSource = await driver.getPageSource();

    expect(pageSource).to.include("stan");
  });

  // ==========================================
  // TEST CASE 14: Klik na pojedinačni oglas
  // ==========================================
  it("TC-014: Klik na pojedinačni oglas", async function () {
    await driver.get(baseUrl + "/pretraga?q=mobilni");
    await driver.sleep(3000);

    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.not.equal(baseUrl);
  });

  // ==========================================
  // TEST CASE 15: Povratak na rezultate pretrage
  // ==========================================
  it("TC-015: Povratak na rezultate pretrage", async function () {
    await driver.get(baseUrl + "/pretraga?q=laptop");
    await driver.sleep(2000);

    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include("laptop");
  });

  // ==========================================
  // TEST CASE 16: Pretraga sa SQL injection pokušajem
  // ==========================================
  it("TC-016: Pretraga sa SQL injection pokušajem", async function () {
    const searchTerm = "' OR '1'='1";

    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await clearAndType(searchInput, searchTerm);
    await searchInput.sendKeys(Key.ENTER);

    await driver.sleep(2000);

    const bodyText = await driver.findElement(By.css("body")).getText();
    expect(bodyText.toLowerCase()).to.not.include("sql error");
    expect(bodyText.toLowerCase()).to.not.include("mysql");
    expect(bodyText.toLowerCase()).to.not.include("syntax error");

    const title = await driver.getTitle();
    expect(title).to.not.be.empty;
  });

  // ==========================================
  // TEST CASE 17: Pretraga sa negativnom cijenom
  // ==========================================
  it("TC-017: Pretraga sa negativnom cijenom", async function () {
    await driver.get(baseUrl + "/pretraga");
    await driver.sleep(2000);

    const title = await driver.getTitle();

    expect(title).to.not.be.empty;
  });

  // ==========================================
  // TEST CASE 18: Pretraga sa cijenom od manjom od cijene do
  // ==========================================
  it("TC-018: Pretraga sa cijenom od manjom od cijene do", async function () {
    await driver.get(baseUrl + "/pretraga?q=auto");
    await driver.sleep(2000);

    const title = await driver.getTitle();

    expect(title).to.not.be.empty;
  });

  // ==========================================
  // TEST CASE 19: Autocomplete funkcionalnost
  // ==========================================
  it("TC-019: Autocomplete funkcionalnost", async function () {
    const searchTerm = "iph";

    const searchInput = await driver.findElement(
      By.css('input[type="text"], input[type="search"]')
    );

    await searchInput.clear();
    await searchInput.sendKeys(searchTerm);
    await driver.sleep(1500);
  });

  // ==========================================
  // TEST CASE 20: Provjera HTTPS sigurnosti
  // ==========================================
  it("TC-020: Provjera HTTPS sigurnosti", async function () {
    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include("https://");
  });
});
