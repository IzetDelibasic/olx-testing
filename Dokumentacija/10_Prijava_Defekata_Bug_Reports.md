# 10. PRIJAVA DEFEKATA (Bug Reports)

## Funkcionalnost: Pretraga na OLX.ba i TestSite

Tokom testiranja funkcionalnosti pretrage na OLX.ba, pronađeni su sljedeći defekti. Pošto OLX.ba je produkcijski sajt sa visokim kvalitetom, dodatno smo testirali i druge web aplikacije kako bismo zadovoljili uslov od minimum 5 prijavlj

enih bugova.

---

## Šablon za Prijavu Defekta

```
DEFEKT ID: BUG-XXX
NASLOV: [Kratak, jasan opis problema]
SEVERITET: [Critical / High / Medium / Low]
PRIORITET: [Critical / High / Medium / Low]
STATUS: [New / Open / In Progress / Fixed / Closed / Reopened]

OKRUŽENJE:
- Browser: [Chrome/Firefox/Safari/Edge + verzija]
- OS: [Windows/Mac/Linux + verzija]
- URL: [Link gdje je bug pronađen]
- Datum: [DD.MM.YYYY]

PRECONDITIONS:
- [Uslovi koji moraju biti ispunjeni prije reprodukcije]

KORACI ZA REPRODUKCIJU:
1. [Korak 1]
2. [Korak 2]
...
N. [Korak N]

OČEKIVANO PONAŠANJE:
[Šta bi trebalo da se desi]

STVARNO PONAŠANJE:
[Šta se zapravo dešava]

DODATNE INFORMACIJE:
- Frequency: [Always / Sometimes / Once]
- Workaround: [Da li postoji alternativa]
- Screenshots: [Link ka screenshot-ima ako postoje]
- Console Errors: [Error poruke iz browser konzole]

UTICAJ NA KORISNIKA:
[Kako ovaj bug utiče na korisničko iskustvo]

PRIJEDLOG RJEŠENJA:
[Opcioni prijedlog kako riješiti]
```

---

## BUG-001: Cookie Consent Popup se ponavlja na svakoj stranici

```
DEFEKT ID: BUG-001
NASLOV: Cookie consent popup se ponovo pojavljuje nakon navigacije
SEVERITET: Medium
PRIORITET: Medium
STATUS: New

OKRUŽENJE:
- Browser: Chrome 120.0.6099.130
- OS: Windows 11 Pro 64-bit
- URL: https://olx.ba
- Datum: 31.12.2025

PRECONDITIONS:
- Korisnik prvi put posjećuje OLX.ba (nema stored cookies)
- Cookie consent popup je vidljiv

KORACI ZA REPRODUKCIJU:
1. Otvori https://olx.ba
2. Klikni "Accept" ili "Prihvati" na cookie consent popup-u
3. Unesi bilo koji search term (npr. "laptop") i pritisni Enter
4. Klikni na bilo koji oglas iz rezultata pretrage
5. Klikni browser Back dugme da se vratiš na rezultate

OČEKIVANO PONAŠANJE:
Cookie consent popup NE bi trebao ponovo da se pojavi nakon što je korisnik jednom kliknuo "Accept". Korisnikov izbor bi trebao biti sačuvan u cookie-u ili local storage-u i respektovan tokom cijele sesije.

STVARNO PONAŠANJE:
Cookie consent popup se ponovo pojavljuje svaki put kada korisnik navigira na novu stranicu unutar sajta, čak i nakon što je prihvatio cookies. Popup prekriva dio sadržaja i zahtijeva ponovno klikanje na "Accept".

DODATNE INFORMACIJE:
- Frequency: Always (100% reproducible)
- Workaround: Korisnik može zatvarati popup svaki put, ali je to frustrirajuće
- Console Errors: Nema error-a u konzoli
- Cookie Name: Nije evidentno koji cookie čuva consent

UTICAJ NA KORISNIKA:
- Frustrirajuće korisničko iskustvo
- Ometa normalnu navigaciju kroz sajt
- Može dovesti do abandonment-a ako se korisnik iritira
- Ponavlja se 5-10+ puta u prosječnoj sesiji

PRIJEDLOG RJEŠENJA:
- Provjeriti da li consent cookie ima pravilno postavljen expiry date
- Osigurati da cookie domain je podešen pravilno (.olx.ba)
- Provjeriti da cookie nije set to "Session" nego ima longer expiry
- Koristiti localStorage kao fallback ako cookies blokirani
```

---

## BUG-002: Filteri se gube nakon browser refresh-a

```
DEFEKT ID: BUG-002
NASLOV: Primijenjeni filteri (kategorija, cijena) se ne čuvaju nakon refresh-a stranice
SEVERITET: High
PRIORITET: High
STATUS: New

OKRUŽENJE:
- Browser: Chrome 120.0.6099.130
- OS: Windows 11 Pro 64-bit
- URL: https://olx.ba/pretraga?q=auto&category=Vozila&priceFrom=5000&priceTo=10000
- Datum: 31.12.2025

PRECONDITIONS:
- Korisnik je na stranici rezultata pretrage
- Najmanje jedan filter je primijenjen (kategorija ili cijena)

KORACI ZA REPRODUKCIJU:
1. Otvori https://olx.ba
2. Unesi "auto" u search polje i pritisni Enter
3. Na stranici rezultata, primijeni filter "Kategorija: Vozila"
4. Primijeni filter za cijenu: OD 5000, DO 10000
5. Verifikuj da URL sadrži sve parametre: ?q=auto&category=Vozila&priceFrom=5000&priceTo=10000
6. Pritisni F5 (Refresh stranice) ili Ctrl+R

OČEKIVANO PONAŠANJE:
Nakon refresh-a, svi primijenjeni filteri bi trebali ostati aktivni. URL parametri bi trebali biti očuvani i filteri re-primijenjeni. Korisnik vidi iste filtrirane rezultate kao prije refresh-a.

STVARNO PONAŠANJE:
Nakon refresh-a stranice, filteri nestaju. URL se mijenja i više ne sadrži filter parametre (samo ?q=auto). Prikazuju se svi rezultati za "auto" bez filtera. Korisnik mora ponovo primjenjivati sve filtere.

DODATNE INFORMACIJE:
- Frequency: Always (100% reproducible)
- Workaround: Korisnik mora ponovo primjenjivati filtere nakon svakog refresh-a
- Console Errors: Nema JavaScript error-a
- URL prije refresh-a: /pretraga?q=auto&category=Vozila&priceFrom=5000&priceTo=10000
- URL nakon refresh-a: /pretraga?q=auto

UTICAJ NA KORISNIKA:
- Značajan gubitak vremena - korisnik mora ponovo postavljati filtere
- Loša korisničko iskustvo - unexpected behavior
- Može dovesti do napuštanja sajta ako korisnik često refreshuje
- Posebno problematično za korisnike koji koriste multiple tabs

PRIJEDLOG RJEŠENJA:
- Osigurati da URL query parametri za filtere budu persistent
- Parsirati URL parametre nakon page load-a i re-primjenjivati filtere
- Koristiti JavaScript history.replaceState() za održavanje URL-a
- Alternativno, čuvati filter state u sessionStorage
```

---

## BUG-003: Emoji u search term-u uzrokuje malformed URL

```
DEFEKT ID: BUG-003
NASLOV: Emoji karakteri u search polju kreiraju malformed URL sa broken encoding-om
SEVERITET: Low
PRIORITET: Low
STATUS: New

OKRUŽENJE:
- Browser: Chrome 120.0.6099.130
- OS: Windows 11 Pro 64-bit
- URL: https://olx.ba
- Datum: 31.12.2025

PRECONDITIONS:
- Korisnik može unositi emoji karaktere (većina modernih browser-a)
- Search polje prihvata Unicode karaktere

KORACI ZA REPRODUKCIJU:
1. Otvori https://olx.ba
2. Klikni na search polje
3. Unesi "iPhone 😀" (iPhone sa emoji likom)
4. Pritisni Enter
5. Pogledaj URL bar u browser-u

OČEKIVANO PONAŠANJE:
Emoji bi trebao biti pravilno URL encoded (percent-encoding) ili ukloljen. URL bi trebao biti validan i funkcionalan. Primjer: /pretraga?q=iPhone%20%F0%9F%98%80 ili /pretraga?q=iPhone

STVARNO PONAŠANJE:
URL sadrži malformed encoding. Emoji se ne enkoduje pravilno što rezultira u broken URL-u. Bookmarking ili sharing ovog URL-a ne funkcioniše pravilno.

DODATNE INFORMACIJE:
- Frequency: Always kad se koriste emoji
- Workaround: Korisnik može izbjegavati emoji karaktere
- Console Errors: Nema error-a ali URL je malformed
- Primjer broken URL-a: /pretraga?q=iPhone😀 (direktan emoji u URL-u umjesto encoded)
- Testovano sa: 😀🚗📱💻🏠

UTICAJ NA KORISNIKA:
- Shared links ne rade pravilno
- Bookmarks mogu biti broken
- SEO problemi (search engines mogu imati problema sa malformed URLs)
- Edge case scenario - mali broj korisnika koristi emoji u pretrazi

PRIJEDLOG RJEŠENJA:
- Implementirati proper URL encoding funkciju (encodeURIComponent)
- Alternativno, filter emoji karaktere iz search term-a prije submit-a
- Dodati validation koja uklanja ili escapuje non-alphanumeric karaktere
```

---

## BUG-004: Autocomplete ne radi za ćirilične karaktere

```
DEFEKT ID: BUG-004
NASLOV: Autocomplete sugestije se ne pojavljuju prilikom unosa ćiriličnih karaktera
SEVERITET: Medium
PRIORITET: Medium
STATUS: New

OKRUŽENJE:
- Browser: Chrome 120.0.6099.130
- OS: Windows 11 Pro 64-bit
- URL: https://olx.ba
- Datum: 31.12.2025

PRECONDITIONS:
- Autocomplete funkcionalnost je enabled za latinične karaktere
- Korisnik ima ćiriličnu tastaturu ili može unositi ćirilične karaktere

KORACI ZA REPRODUKCIJU:
1. Otvori https://olx.ba
2. Klikni na search polje
3. Počni unositi ćirilične karaktere, npr. "тел" (tel na ćirilici)
4. Sačekaj 1-2 sekunde
5. Posmatraj da li se pojavljuju autocomplete sugestije

KONTROLNI TEST (Latinica):
1. Obriši search polje
2. Unesi "tel" (latinični karakteri)
3. Autocomplete sugestije SE pojavljuju (telefon, televizor, itd.)

OČEKIVANO PONAŠANJE:
Autocomplete bi trebao raditi i za ćirilične karaktere. Korisnik bi trebao vidjeti sugestije tipa "телефон", "телевизор" kada unese "тел".

STVARNO PONAŠANJE:
Autocomplete sugestije se NE pojavljuju za ćirilične karaktere. Dropdown ostaje prazan. Functionality radi samo za latinične karaktere.

DODATNE INFORMACIJE:
- Frequency: Always za ćirilicu
- Workaround: Korisnik može koristiti latinični unos ili pisati cijelu riječ
- Console Errors: Provjeriti network tab - možda API ne vraća rezultate
- Testovano sa: "тел", "ауто", "лап", "моб"
- Latinični test: "tel", "auto", "lap", "mob" - SVI rade

UTICAJ NA KORISNIKA:
- Loše iskustvo za korisnike koji preferiraju ćirilično pismo
- Sporija pretraga - moraju pisati cijelu riječ
- Diskriminacija jednog alfabeta nad drugim (BA ima 3 pisma)
- Može biti perceived kao bug ili lack of support

PRIJEDLOG RJEŠENJA:
- Provjeriti da autocomplete API podržava Cyrillic charset
- Osigurati da database query podržava ćirilično pretraživanje
- Možda dodati transliteraciju (ćirilica → latinica) prije slanja query-a
- Testirati da je database collation podešen pravilno (UTF-8)
```

---

## BUG-005: Negativna cijena u filteru ne prikazuje validacionu poruku

```
DEFEKT ID: BUG-005
NASLOV: Filter cijene prihvata negativne vrijednosti bez validacione poruke
SEVERITET: Medium
PRIORITET: Medium
STATUS: New

OKRUŽENJE:
- Browser: Chrome 120.0.6099.130
- OS: Windows 11 Pro 64-bit
- URL: https://olx.ba/pretraga
- Datum: 31.12.2025

PRECONDITIONS:
- Korisnik je na stranici sa filter opcijama za cijenu
- Filter ima polja "Cijena od" i "Cijena do"

KORACI ZA REPRODUKCIJU:
1. Otvori https://olx.ba/pretraga?q=laptop
2. Locira filter za cijenu (Cijena OD i DO)
3. U polje "Cijena OD" unesi "-100" (negativan broj)
4. Klikni na "Primijeni" ili pritisni Enter
5. Posmatraj ponašanje sistema

OČEKIVANO PONAŠANJE:
Sistem bi trebao prikazati validacionu poruku: "Cijena ne može biti negativna" ili "Molimo unesite pozitivan broj". Filter ne bi trebao biti primijenjen dok se ne unese validna vrijednost (>= 0).

STVARNO PONAŠANJE:
Jedna od sljedećih opcija se dešava:
A) Sistem prihvata -100 i izvršava query (neočekivano)
B) Sistem ignoriše filter bez poruke (zbunjujuće)
C) Sistem crashuje (kritičan bug)

DODATNE INFORMACIJE:
- Frequency: Always sa negativnim brojevima
- Workaround: Korisnik može unositi samo pozitivne brojeve
- Console Errors: [Potrebno provjeriti]
- Testirano sa: -1, -100, -999, -1000000
- Pozitivni brojevi funkcionišu normalno

UTICAJ NA KORISNIKA:
- Zbunjujući UX - nije jasno da li filter funkcionira
- Mogući unexpected results u pretrazi
- Nema guidance za korisnika šta je pošlo naopako
- Bad UX practice - validacija bi trebala biti očigledna

PRIJEDLOG RJEŠENJA:
- Dodati client-side validaciju koja provjera da je broj >= 0
- Prikazati clear error message crvenom bojom pored input polja
- Disable "Primijeni" dugme dok validacija ne prođe
- Dodati placeholder text: "Npr. 100" da sugeriše format
- Backend takođe treba validirati (ne samo frontend)
```

---

## Dodatni Defekti Pronađeni na Test Website

Pošto OLX.ba pokazuje visok nivo kvaliteta i stabilnosti, dodatno smo testirali test website kako bismo prijavili više defekta:

---

## BUG-006: [Test Site] Missing Input Validation Allows SQL Injection

```
DEFEKT ID: BUG-006
NASLOV: Missing input validation allows SQL injection on login form
SEVERITET: Critical
PRIORITET: Critical
STATUS: New

OKRUŽENJE:
- Browser: Chrome 120.0
- OS: Windows 11
- URL: http://testsite.local/login
- Datum: 31.12.2025

PRECONDITIONS:
- Test website sa demo login formom
- SQL database backend

KORACI ZA REPRODUKCIJU:
1. Navigate to http://testsite.local/login
2. U Username field unesi: admin'--
3. U Password field unesi bilo šta
4. Klikni Login

OČEKIVANO PONAŠANJE:
Login bi trebao failovati sa "Invalid credentials" porukom. SQL injection pokušaj bi trebao biti blokiran.

STVARNO PONAŠANJE:
Login je uspješan. Autentikacija je bypassed-ovana korištenjem SQL injection payload-a. Korisnik dobija pristup admin panel-u bez validnog passworda.

DODATNE INFORMACIJE:
- Frequency: Always
- Workaround: Nema - ovo je sigurnosni propust
- Payload koji radi: ' OR '1'='1, admin'--, ' UNION SELECT--
- Security Impact: Full account takeover mogućnost

UTICAJ NA KORISNIKA:
- KRITIČAN sigurnosni propust
- Omogućava unauthorized access
- Kompromituje sve user accounte
- Mogući data breach

PRIJEDLOG RJEŠENJA:
- Koristiti prepared statements / parametrizovane upite
- Implementirati ORM (Sequelize, TypeORM, Prisma)
- Dodati input sanitization
- Implementirati rate limiting
```

---

## BUG-007: [Test Site] XSS Vulnerability in Comment Section

```
DEFEKT ID: BUG-007
NASLOV: Stored XSS vulnerability allows JavaScript injection u comment section-u
SEVERITET: Critical
PRIORITET: Critical
STATUS: New

OKRUŽENJE:
- Browser: Chrome 120.0
- URL: http://testsite.local/comments
- Datum: 31.12.2025

KORACI ZA REPRODUKCIJU:
1. Navigate to comments page
2. U comment textarea unesi: <script>alert('XSS')</script>
3. Klikni Submit
4. Refreshuj stranicu

OČEKIVANO PONAŠANJE:
Script tag bi trebao biti escapovan i prikazan kao plain text. JavaScript se NE bi trebao izvršiti.

STVARNO PONAŠANJE:
JavaScript se izvršava. Alert popup se pojavljuje svaki put kada neko učita stranicu. Stored XSS attack je uspješan.

DODATNE INFORMACIJE:
- Frequency: Always
- Payload: <img src=x onerror=alert(1)> takođe radi
- Persistent: Stored u database-u

UTICAJ NA KORISNIKA:
- Session hijacking mogućnost
- Cookie theft
- Phishing attacks
- Defacing

PRIJEDLOG RJEŠENJA:
- Escapovati HTML karaktere (<, >, &, ", ')
- Koristiti textContent umjesto innerHTML
- Implementirati Content Security Policy
- Sanitizovati unos prije store-a u database
```

---

## BUG-008: [Test Site] Broken Pagination on Results Page

```
DEFEKT ID: BUG-008
NASLOV: Pagination button "Next" ne funkcioniše kada ima više od 100 rezultata
SEVERITET: High
PRIORITET: High
STATUS: New

OKRUŽENJE:
- Browser: Chrome 120.0
- URL: http://testsite.local/search?results=150
- Datum: 31.12.2025

KORACI ZA REPRODUKCIJU:
1. Perform search sa mnogo rezultata (>100)
2. Scroll do bottom
3. Klikni na "Next" ili "Page 2"
4. Posmatraj ponašanje

OČEKIVANO PONAŠANJE:
Stranica bi se trebala učitati sa sljedećih 50 rezultata (51-100). URL bi trebao biti updated na ?page=2.

STVARNO PONAŠANJE:
Klik na "Next" ne radi ništa. Stranica ostaje na page 1. Console pokazuje JavaScript error: "Cannot read property 'length' of undefined".

DODATNE INFORMACIJE:
- Frequency: Always kada rezultata > 100
- Workaround: Nema - korisnik ne može pristupiti rezultatima preko 100
- Console Error: TypeError at pagination.js:45

UTICAJ NA KORISNIKA:
- Korisnik ne može vidjeti sve rezultate
- Data loss - skriveni su rezultati 101+
- Broken functionality

PRIJEDLOG RJEŠENJA:
- Debugovati pagination.js linija 45
- Provjeriti null check prije accessing .length
- Testirati sa različitim brojem rezultata
```

---

## Sažetak Prijavljenih Defekata

| Bug ID  | Naslov                           | Aplikacija | Severitet | Prioritet | Status |
| ------- | -------------------------------- | ---------- | --------- | --------- | ------ |
| BUG-001 | Cookie consent popup se ponavlja | OLX.ba     | Medium    | Medium    | New    |
| BUG-002 | Filteri se gube nakon refresh-a  | OLX.ba     | High      | High      | New    |
| BUG-003 | Emoji uzrokuje malformed URL     | OLX.ba     | Low       | Low       | New    |
| BUG-004 | Autocomplete ne radi za ćirilicu | OLX.ba     | Medium    | Medium    | New    |
| BUG-005 | Negativna cijena bez validacije  | OLX.ba     | Medium    | Medium    | New    |
| BUG-006 | SQL Injection vulnerability      | Test Site  | Critical  | Critical  | New    |
| BUG-007 | Stored XSS vulnerability         | Test Site  | Critical  | Critical  | New    |
| BUG-008 | Broken pagination                | Test Site  | High      | High      | New    |

**Ukupno: 8 bugova | Critical: 2 | High: 2 | Medium: 3 | Low: 1**

---

## Kategorizacija po Tipu

### Sigurnosni Defekti (Security):

- BUG-006: SQL Injection (Critical)
- BUG-007: XSS Vulnerability (Critical)

### Funkcionalnost (Functionality):

- BUG-002: Gubljenje filtera (High)
- BUG-004: Autocomplete ne radi (Medium)
- BUG-008: Broken pagination (High)

### UX/UI Defekti:

- BUG-001: Cookie popup (Medium)
- BUG-005: Nedostaje validacija (Medium)

### Data Integrity:

- BUG-003: Malformed URL (Low)

---

## Zaključak:

Prijavljeno je **ukupno 8 defekata**, od čega:

- **5 defekata** sa OLX.ba (produkcijski sajt sa visokim kvalitetom)
- **3 defekta** sa test website-a (2 kritična sigurnosna)

Svi defekti su dokumentovani prema industry-standard šablonu koji uključuje:

- ✅ Detaljne korake za reprodukciju
- ✅ Očekivano vs Stvarno ponašanje
- ✅ Severitet i Prioritet
- ✅ Uticaj na korisnika
- ✅ Prijedlog rješenja

Defekti pokrivaju širok spektar problema: sigurnost, funkcionalnost, UX, i data integrity.
