# 7. POGAĐANJE POGREŠKE (Error Guessing)

## Funkcionalnost: Pretraga na OLX.ba

Pogađanje pogreške (Error Guessing) je tehnika testiranja bazirana na iskustvu gdje tester koristi svoje znanje o sličnim aplikacijama, čestim defektima i poznatim problemima da predvidi gdje bi moglo doći do greški. Ova tehnika dopunjuje formalne metode testiranja i često otkriva defekte koje druge tehnike ne bi pronašle.

---

## Identifikovani Mogući Defekti

### **Kategorija 1: Sigurnosni Defekti**

#### **DEFEKT 1: Cross-Site Scripting (XSS)**

**Opis:** Aplikacija može biti ranjiva na XSS napade ako ne escapuje specijalne HTML karaktere u search polju.

**Kako može nastati:**

- Direktno renderovanje korisničkog unosa u HTML bez sanitizacije
- Korištenje innerHTML umjesto textContent
- Nepotpuna validacija specijalnih karaktera

**Potencijalni uticaj:**

- Izvršavanje malicioznog JavaScript koda u browseru korisnika
- Krađa cookie-ja i session token-a
- Phishing napadi
- Defacing stranice

**Testovi koji napadaju ovaj defekt:**

- **TC-005: Pretraga sa specijalnim karakterima**
  - Input: `<script>alert(1)</script>`
  - Input: `<img src=x onerror=alert(1)>`
  - Input: `<svg onload=alert(1)>`
  - Input: `javascript:alert(1)`

**Očekivano ponašanje:** Karakteri treba biti escapovani ili prikazana validaciona poruka.

---

#### **DEFEKT 2: SQL Injection**

**Opis:** Aplikacija može biti ranjiva na SQL injection ako direktno ugrađuje korisnički unos u SQL upite.

**Kako može nastati:**

- Konkatenacija stringova za kreiranje SQL upita
- Nedostatak prepared statements
- Nedovoljna validacija ulaza

**Potencijalni uticaj:**

- Neovlašten pristup podacima u bazi
- Brisanje ili modifikacija podataka
- Bypass autentikacije
- Izvršavanje proizvoljnih komandi na serveru

**Testovi koji napadaju ovaj defekt:**

- **TC-016: Pretraga sa SQL injection pokušajem**
  - Input: `' OR '1'='1`
  - Input: `'; DROP TABLE oglasi--`
  - Input: `' UNION SELECT * FROM korisnici--`
  - Input: `admin'--`

**Očekivano ponašanje:** Input treba biti sanitizovan ili korišteni prepared statements.

---

### **Kategorija 2: Validacioni Defekti**

#### **DEFEKT 3: Nedovoljna validacija dužine unosa**

**Opis:** Aplikacija može dozvoliti previše kratke ili preduge search term-ove.

**Kako može nastati:**

- Nedostaje validacija na frontendu ili backend-u
- Netačna provjera dužine (off-by-one error)
- Različite validacije na različitim nivoima

**Potencijalni uticaj:**

- Nepotrebno opterećenje servera (pretrage sa 1 karakterom vraćaju previše rezultata)
- Buffer overflow ili DOS napad (predugi unosi)
- Loša korisničko iskustvo

**Testovi koji napadaju ovaj defekt:**

- **TC-003: Pretraga sa jednim karakterom**
  - Input: `a`
  - Očekivano: Poruka ili odbijanje
- **TC-002: Pretraga sa minimalnim brojem karaktera (2)**
  - Input: `ab`
  - Očekivano: Pretraga se izvršava
- **TC-008: Pretraga sa dugačkim terminom (100 karaktera)**
  - Input: `"a" * 100`
  - Očekivano: Prihvaćeno ili truncate
- **Dodatni test: Preko 100 karaktera**
  - Input: `"a" * 101`
  - Očekivano: Truncate ili error

---

#### **DEFEKT 4: Nedovoljna validacija raspona cijene**

**Opis:** Aplikacija može dozvoliti nelogične kombinacije cijena ili negativne vrijednosti.

**Kako može nastati:**

- Nedostaje validacija relacije između OD i DO cijene
- Nema provjere za negativne brojeve
- Frontend i backend validacija nisu sinhronizovani

**Potencijalni uticaj:**

- Neočekivani rezultati pretrage
- Greške u backend-u
- Loša korisničko iskustvo
- Potencijalno otkrivanje svih oglasa ako se validacija ne provjerava

**Testovi koji napadaju ovaj defekt:**

- **TC-017: Pretraga sa negativnom cijenom**
  - Input: `priceFrom = -100`
  - Očekivano: Validaciona poruka
- **TC-018: Pretraga sa cijenom OD > DO**

  - Input: `priceFrom = 1000, priceTo = 500`
  - Očekivano: Validaciona poruka ili automatska zamjena

- **Dodatni test: Cijena = 0**
  - Input: `priceFrom = 0, priceTo = 0`
  - Očekivano: Besplatni oglasi ili error

---

### **Kategorija 3: Encoding i Charset Defekti**

#### **DEFEKT 5: Nepodržani ćirilični karakteri**

**Opis:** Aplikacija može ne podržavati pravilno ćirilične karaktere zbog problema sa encoding-om.

**Kako može nastati:**

- Pogrešan charset (npr. Latin1 umjesto UTF-8)
- Nedostaje konverzija između ćirilice i latinice
- Problem sa database collation-om

**Potencijalni uticaj:**

- Korisnici ne mogu pretražiti oglase na ćirilici
- Prikazuju se "mojibake" karakteri (????, □□□□)
- Nema rezultata čak i ako postoje

**Testovi koji napadaju ovaj defekt:**

- **TC-006: Pretraga sa ćiriličkim karakterima**
  - Input: `телефон`
  - Input: `аутомобил`
  - Input: `лаптоп`
  - Očekivano: Rezultati se prikazuju ili konverzija u latinicu

---

#### **DEFEKT 6: URL encoding problemi**

**Opis:** Specijalni karakteri u URL-u mogu biti nepravilno encoded/decoded.

**Kako može nastati:**

- Nedostaje URL encoding za query parametrima
- Dvostruko encoding
- Nedostaje decoding na serveru

**Potencijalni uticaj:**

- Search term se ne prenosi pravilno na server
- 404 greške
- Nefunkcionalni bookmarks ili shared links

**Testovi koji napadaju ovaj defekt:**

- **Dodatni test: Specijalni karakteri u URL-u**
  - Input: `iPhone 13 Pro Max`
  - Očekivano URL: `?q=iPhone%2013%20Pro%20Max`
  - Input: `a&b`, `c+d`, `#hashtag`
  - Očekivano: Pravilno encoding

---

### **Kategorija 4: Performance i Load Defekti**

#### **DEFEKT 7: Nedovoljna paginacija (N+1 problem)**

**Opis:** Aplikacija može učitati previše rezultata odjednom što uzrokuje performance probleme.

**Kako može nastati:**

- Nema limita na broj rezultata po stranici
- Inefficient SQL upiti
- N+1 query problem

**Potencijalni uticaj:**

- Sporo učitavanje stranice
- Timeout-ovi
- Prekomjerno opterećenje servera i baze
- Loša korisničko iskustvo

**Testovi koji napadaju ovaj defekt:**

- **Dodatni test: Pretraga sa mnogo rezultata**
  - Input: `a` (1 karakter ako je dozvoljen - vraća sve oglase)
  - Očekivano: Maksimum 50-100 rezultata po stranici

---

#### **DEFEKT 8: DOS napad kroz kompleksne upite**

**Opis:** Maliciozni korisnik može kreirati upite koji zahtijevaju mnogo resursa.

**Kako može nastati:**

- Nedostaje rate limiting
- Kompleksni full-text search bez optimizacije
- Nema timeout-a za upite

**Potencijalni uticaj:**

- Server nedostupan za druge korisnike
- Povećani troškovi hosting-a
- Pad performansi

**Testovi koji napadaju ovaj defekt:**

- **Dodatni test: Brzi uzastopni upiti**
  - Slanje 100 zahtjeva u 1 sekundi
  - Očekivano: Rate limiting ili throttling

---

### **Kategorija 5: UX i Edge Case Defekti**

#### **DEFEKT 9: Prazna pretraga vraća neočekivane rezultate**

**Opis:** Aplikacija može imati nekonzistentno ponašanje kada je search term prazan.

**Kako može nastati:**

- Različito ponašanje za prazan string, null, undefined
- Nedostaje explicit handling prazne pretrage

**Potencijalni uticaj:**

- Zbunjujući UX (prikazuje sve oglase ili ništa?)
- Nekonzistentno ponašanje

**Testovi koji napadaju ovaj defekt:**

- **TC-007: Prazna pretraga**
  - Input: `` (prazan string)
  - Input: `   ` (samo razmaci)
  - Očekivano: Definisano ponašanje (sve oglase ili ostani na početnoj)

---

#### **DEFEKT 10: Autocomplete ne funkcioniše ili je spor**

**Opis:** Autocomplete može biti loše implementiran ili preslabi za veliku bazu podataka.

**Kako može nastati:**

- Previše rezultata vraćenih od autocomplete-a
- Nema debounce-a na input event
- Inefficient query

**Potencijalni uticaj:**

- Sporo tipkanje
- Previše poziva serveru
- Loša korisničko iskustvo

**Testovi koji napadaju ovaj defekt:**

- **TC-019: Autocomplete funkcionalnost**
  - Input: `iph` (3 karaktera)
  - Očekivano: Sugestije se pojavljuju brzo (< 300ms)

---

### **Kategorija 6: State Management Defekti**

#### **DEFEKT 11: Gubljenje parametara pretrage nakon povratka**

**Opis:** Search parametri se ne čuvaju kada korisnik klikne na oglas pa se vrati nazad.

**Kako može nastati:**

- Session state nije održavan
- Query parametri nisu preservirani u URL-u
- Browser history nije pravilno implementiran

**Potencijalni uticaj:**

- Korisnik mora ponovo unositi pretragu
- Frustrirajuće iskustvo
- Gubitak filtera

**Testovi koji napadaju ovaj defekt:**

- **TC-015: Povratak na rezultate pretrage**
  - Koraci: Pretraži → Klikni oglas → Back dugme
  - Očekivano: Parametri pretrage očuvani

---

#### **DEFEKT 12: Cookie popup blokira interakciju**

**Opis:** Cookie consent popup može blokirati klikove na search polje ili rezultate.

**Kako može nastati:**

- Z-index problema
- Overlay prekriva elemente
- Nema dismiss mehanizma

**Potencijalni uticaj:**

- Korisnici ne mogu koristiti search
- Abandoned sessions
- Negativan UX

**Testovi koji napadaju ovaj defekt:**

- **Implicit u svim testovima**
  - beforeEach hook zatvara cookie popup
  - Provjera da je search input accessible

---

### **Kategorija 7: HTTPS i Security Headers**

#### **DEFEKT 13: Nedostaje HTTPS**

**Opis:** Aplikacija može biti dostupna preko HTTP umjesto HTTPS.

**Kako može nastati:**

- Nepravilna konfiguracija servera
- Nema redirect sa HTTP na HTTPS
- Mixed content warnings

**Potencijalni uticaj:**

- Man-in-the-middle napadi
- Presretanje podataka
- Browser warnings
- SEO penalty

**Testovi koji napadaju ovaj defekt:**

- **TC-020: Provjera HTTPS sigurnosti**
  - Provjera: `expect(url).to.include("https://")`
  - Očekivano: Sve stranice koriste HTTPS

---

## Sažetak Defekta i Testova

| **Defekt ID** | **Kategorija** | **Defekt**                   | **Testovi**            | **Prioritet** |
| ------------- | -------------- | ---------------------------- | ---------------------- | ------------- |
| D1            | Sigurnost      | XSS                          | TC-005                 | KRITIČAN      |
| D2            | Sigurnost      | SQL Injection                | TC-016                 | KRITIČAN      |
| D3            | Validacija     | Nedovoljna validacija dužine | TC-002, TC-003, TC-008 | VISOK         |
| D4            | Validacija     | Nevažeći raspon cijene       | TC-017, TC-018         | SREDNJI       |
| D5            | Encoding       | Ćirilični karakteri          | TC-006                 | SREDNJI       |
| D6            | Encoding       | URL encoding                 | Dodatni test           | SREDNJI       |
| D7            | Performance    | Paginacija                   | Dodatni test           | VISOK         |
| D8            | Performance    | DOS napad                    | Dodatni test           | KRITIČAN      |
| D9            | UX             | Prazna pretraga              | TC-007                 | NIZAK         |
| D10           | UX             | Autocomplete                 | TC-019                 | NIZAK         |
| D11           | State          | Gubljenje parametara         | TC-015                 | SREDNJI       |
| D12           | UX             | Cookie popup                 | beforeEach hook        | SREDNJI       |
| D13           | Sigurnost      | HTTPS                        | TC-020                 | VISOK         |

---

## Zaključak:

Identifikovano je **13 mogućih defekta** u 7 kategorija korištenjem Error Guessing tehnike. Ovi defekti pokrivaju:

- ✅ 3 Sigurnosna defekta (XSS, SQL Injection, HTTPS)
- ✅ 2 Validaciona defekta (dužina, cijene)
- ✅ 2 Encoding defekta (ćirilica, URL)
- ✅ 2 Performance defekta (paginacija, DOS)
- ✅ 3 UX defekta (prazna pretraga, autocomplete, cookie popup)
- ✅ 1 State management defekt (gubljenje parametara)

Naši automation testovi pokrivaju **10 od 13** identifikovanih defekta, što pokazuje dobru pokrivenost kritičnih scenarija baziranu na iskustvu i poznatim problemima sličnih aplikacija.
