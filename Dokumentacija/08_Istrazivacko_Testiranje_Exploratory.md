# 8. ISTRAŽIVAČKO TESTIRANJE (Exploratory Testing)

## Funkcionalnost: Pretraga na OLX.ba

Istraživačko testiranje je pristup testiranju gdje se dizajn testa, izvršavanje testa i učenje dešavaju istovremeno. Tester istražuje aplikaciju bez striktno definisanih test skripti, koristeći svoje znanje, intuiciju i kreativnost da pronađe defekte koje formalne metode možda ne bi otkrile.

---

## Definicija i Karakteristike

**Istraživačko testiranje je:**

- Simultano učenje o aplikaciji, dizajniranje testova i njihovo izvršavanje
- Ad-hoc pristup koji nije nasumičan već vođen testerovim znanjem
- Fokus na otkrivanju neočekivanih defekta
- Dopuna skript-baziranom testiranju

**Nije:**

- Nasumično klikanje bez cilja
- Zamjena za strukturirano testiranje
- Testiranje bez plana ili strategije

---

## Organizacija Istraživačkog Testiranja za Funkcionalnost Pretrage

### **Faza 1: Charter Definicija (Mission Statement)**

Prije početka istraživačkog testiranja, definišemo **charter** - kratku misiju koja opisuje šta ćemo testirati i koliko dugo.

**Charter primjeri za pretragu:**

1. **Charter 1:** "Istraži funkcionalnost pretrage fokusirajući se na edge case-ove i neobične kombinacije filtera - 90 minuta"
2. **Charter 2:** "Testiraj kako sistem reaguje na nevažeće unose i pokušaje napada - 60 minuta"
3. **Charter 3:** "Istraži interakciju između pretrage, filtera i paginacije - 60 minuta"
4. **Charter 4:** "Testiraj pretragu na različitim browser-ima i device-ima - 90 minuta"

---

### **Faza 2: Tip Istraživačkog Testiranja**

Za funkcionalnost pretrage na OLX.ba, koristit ćemo **Session-Based Test Management (SBTM)** pristup.

#### **Zašto Session-Based Test Management?**

1. **Strukturiran pristup:** SBTM daje strukturu istraživačkom testiranju kroz sesije sa definisanim charter-ima
2. **Mjerljiv:** Možemo pratiti koliko vremena provodimo na testiranju
3. **Dokumentovan:** Svaka sesija ima report sa pronađenim defektima
4. **Balansirano:** Kombinuje slobodu istraživanja sa odgovornošću dokumentovanja
5. **Ponovljiv:** Sesije se mogu ponoviti sa istim charter-om

#### **Alternativne metode koje ne koristimo:**

- **Freestyle Exploratory:** Previše ad-hoc, teško mjerljiv
- **Scenario-Based:** Preslično skript-baziranom testiranju
- **Strategy-Based:** Zahtijeva više iskustva sa aplikacijom

---

### **Faza 3: Struktura SBTM Sesije**

Svaka SBTM sesija sastoji se od:

1. **Time Box:** 60-120 minuta neprekidnog testiranja
2. **Charter:** Jasna misija šta testirati
3. **Tester:** Ko izvršava sesiju (u našem slučaju - mi)
4. **Notes:** Bilješke tokom sesije
5. **Test Ideas:** Ideje za testove koje se pojave tokom istraživanja
6. **Bugs:** Pronađeni defekti
7. **Issues:** Pitanja ili nedoumice
8. **Debrief:** Kratak sastanak nakon sesije (10-20 minuta)

---

## Detaljan Plan Istraživačkih Sesija

### **SESIJA 1: Edge Case-ovi i Neobične Kombinacije**

**Charter:** Istraži funkcionalnost pretrage fokusirajući se na edge case-ove i neobične kombinacije filtera - 90 minuta

**Oblasti za istraživanje:**

1. **Kombinacije filtera:**

   - Primijeni sve filtere odjednom (search term + kategorija + cijena + lokacija + sortiranje)
   - Primijeni filtere u različitom redoslijedu
   - Ukloni jedan filter nakon što su svi primijenjeni
   - Resetuj sve filtere

2. **Granične vrijednosti:**

   - Testirati vrijednosti na granicama (1, 2, 100, 101 karaktera)
   - Testirati cijene na granicama (0, -1, 999999, 1000000)
   - Testirati kombinaciju minimalnih i maksimalnih vrijednosti

3. **Neobični unosi:**

   - Emoji u search polju (😀🚗📱)
   - Unicode karakteri (→ ← ↑ ↓)
   - RTL karakteri (عربي)
   - Ćirilica + latinica mješano (телефоn)

4. **Browser behavior:**
   - Back/Forward navigacija
   - Refresh stranice tokom pretrage
   - Otvaranje više tabova sa različitim pretragama

**Test ideje koje bi se mogle pojaviti:**

- Šta se dešava ako korisnik promijeni URL parametar ručno?
- Da li se filter čuva ako refreshujemo stranicu?
- Šta ako otvorimo link sa starim parametrima (bookmarked search)?

---

### **SESIJA 2: Sigurnost i Nevažeći Unosi**

**Charter:** Testiraj kako sistem reaguje na nevažeće unose i pokušaje napada - 60 minuta

**Oblasti za istraživanje:**

1. **Injection napadi:**

   - XSS payloads različite kompleksnosti:
     - `<script>alert(1)</script>`
     - `<img src=x onerror=alert(1)>`
     - `<svg/onload=alert(1)>`
     - `<iframe src=javascript:alert(1)>`
   - SQL injection payloads:
     - `' OR '1'='1`
     - `'; DROP TABLE--`
     - `1' UNION SELECT NULL--`
   - Command injection:
     - `; ls -la`
     - `| whoami`

2. **Path traversal:**

   - `../../../etc/passwd`
   - `..\..\windows\system32\`

3. **XXE (XML External Entity):**

   - `<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>`

4. **LDAP injection:**

   - `*)(uid=*))(|(uid=*`

5. **Encoding bypasses:**
   - Double encoding: `%253Cscript%253E`
   - Unicode encoding: `\u003cscript\u003e`
   - HTML entities: `&lt;script&gt;`

**Test ideje koje bi se mogle pojaviti:**

- Da li postoji rate limiting?
- Šta se dešava ako šaljemo malformed JSON?
- Da li CORS headeri pravilno konfigurisani?

---

### **SESIJA 3: Interakcija Između Komponenata**

**Charter:** Istraži interakciju između pretrage, filtera i paginacije - 60 minuta

**Oblasti za istraživanje:**

1. **Pretraga + Paginacija:**

   - Pretraži, idi na stranicu 5, promijeni search term
   - Šta se dešava sa page number-om?
   - Idi na zadnju stranicu, dodaj filter - da li se vraća na stranicu 1?

2. **Pretraga + Sortiranje:**

   - Pretraži, sortiraj po cijeni, dodaj kategoriju filter
   - Da li se sortiranje čuva?
   - Promijeni sortiranje tokom scroll-a

3. **Filteri + Kategorije:**

   - Odaberi kategoriju, zatim search term - da li se kategorija čuva?
   - Odaberi kategoriju sa 0 rezultata

4. **URL state:**

   - Kopiraj URL sa svim parametrima, otvori u novom tabu
   - Ručno promijeni URL parametre
   - Bookmark pretragu, otvori nakon nekoliko dana

5. **Session state:**
   - Otvori 2 taba, različite pretrage u svakom
   - Da li se state miješa između tabova?

**Test ideje koje bi se mogle pojaviti:**

- Šta ako simultano šaljemo 2 zahtjeva?
- Da li infinite scroll funkcionira sa filterima?
- Kako se ponašaju browser back/forward buttons?

---

### **SESIJA 4: Cross-Browser i Device Testing**

**Charter:** Testiraj pretragu na različitim browser-ima i device-ima - 90 minuta

**Oblasti za istraživanje:**

1. **Browser testiranje:**

   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
   - Mobile browsers (Chrome Mobile, Safari Mobile)

2. **Responsive testing:**

   - Desktop (1920x1080)
   - Laptop (1366x768)
   - Tablet portrait (768x1024)
   - Tablet landscape (1024x768)
   - Mobile (375x667, 414x896)

3. **Touch vs Mouse:**

   - Da li autocomplete radi na touch?
   - Da li dropdown-ovi funkcionišu na mobile?
   - Swipe gestures

4. **Keyboard navigation:**

   - Tab kroz sve elemente
   - Enter za submit
   - Escape za zatvaranje
   - Arrow keys u dropdown-ima

5. **Performance na različitim uređajima:**
   - Brzina učitavanja na slow 3G
   - Throttle CPU i memory
   - Testiranje na starim device-ima

**Test ideje koje bi se mogle pojaviti:**

- Da li postoje memorijske leak-ove?
- Kako se aplikacija ponaša sa malim viewport-om?
- Da li postoje rendering problemi na retina display-ima?

---

## Dokumentovanje Sesije (Template)

```
ISTRAŽIVAČKA SESIJA REPORT

================================
OSNOVNE INFORMACIJE
================================
Charter: [Opis misije]
Tester: [Ime]
Datum: [DD.MM.YYYY]
Start Time: [HH:MM]
Duration: [X minuta]
Test Coverage: [Što je testirano]
Session Type: SBTM

================================
ŠTA JE TESTIRANO
================================
[Detaljan opis aktivnosti tokom sesije]
-Area 1: [Opis]
- Area 2: [Opis]
- Area 3: [Opis]

================================
PRONAĐENI DEFEKTI
================================
Bug #1: [Kratak opis]
  Severity: [Critical/High/Medium/Low]
  Steps: [Kako reproducirati]

Bug #2: [Kratak opis]
  Severity: [Critical/High/Medium/Low]
  Steps: [Kako reproducirati]

================================
PITANJA/NEDOUMICE
================================
1. [Pitanje o aplikaciji ili funkcionalnosti]
2. [Nedoumico ponašanju]

================================
IDEJE ZA BUDUĆE TESTOVE
================================
1. [Ideja za novi test ili sesiju]
2. [Area koja zahtijeva dodatno istraživanje]

================================
BILJEŠKE
================================
[Opšte bilješke, zapažanja, zanimljivi nalazi]

================================
METRIKE
================================
Time spent testing: [X min]
Time spent investigating bugs: [Y min]
Time spent setup: [Z min]
Bugs found: [N]
Test ideas generated: [M]
```

---

## Primjer Popunjenog Reporta

```
ISTRAŽIVAČKA SESIJA REPORT

================================
OSNOVNE INFORMACIJE
================================
Charter: Istraži funkcionalnost pretrage fokusirajući se na edge case-ove
Tester: QA Team
Datum: 31.12.2025
Start Time: 14:00
Duration: 90 minuta
Test Coverage: Search functionality, Filters, Pagination, URL handling
Session Type: SBTM

================================
ŠTA JE TESTIRANO
================================
- Kombinacije svih filtera odjednom (search + category + price + sort)
- Granične vrijednosti za search term (1, 2, 100, 101 karaktera)
- Granične vrijednosti za cijene (0, -1, 999999, 1000000)
- Emoji i Unicode karakteri u search polju (😀, →, ↑)
- Mix ćirilice i latinice (телефоn, лаптоp)
- Browser back/forward behavior sa filterima
- Ručna izmjena URL parametara

================================
PRONAĐENI DEFEKTI
================================
Bug #1: Cookie popup nije persistent - pojavljuje se na svakoj stranici
  Severity: Medium
  Steps: 1. Zatvori cookie popup, 2. Pretraži nešto, 3. Otvori oglas, 4. Vrati se nazad - popup se ponovo pojavljuje

Bug #2: Filteri se gube nakon browser refresh-a
  Severity: High
  Steps: 1. Primijeni kategoriju + cijenu filtere, 2. Refreshuj stranicu - filteri nestaju

Bug #3: Emoji u search term-u uzrokuju broken URL
  Severity: Low
  Steps: 1. Unesi "iPhone 😀" 2. URL sadrži malformed encoding

================================
PITANJA/NEDOUMICE
================================
1. Da li aplikacija namjerno briše filtere nakon refresh-a ili je to bug?
2. Šta je expected behavior za cijenu = 0? Besplatni oglasi ili greška?
3. Zašto autocomplete ne radi za ćirilična slova?

================================
IDEJE ZA BUDUĆE TESTOVE
================================
1. Dublje testiranje autocomplete funkcionalnosti
2. Performance testing sa velikim brojem rezultata (>10000)
3. Testiranje sa slow network connections
4. A/B testing različitih filter UI-eva

================================
BILJEŠKE
================================
- Search je generalno brz i responsivan
- UX za filtere mogao bi biti bolji (previše klikova)
- Neke kategorije imaju 0 oglasa - možda ih sakriti?
- Mobile version ima layout issues na malim screen-ovima

================================
METRIKE
================================
Time spent testing: 65 min
Time spent investigating bugs: 20 min
Time spent setup: 5 min
Bugs found: 3
Test ideas generated: 4
```

---

## Tours (Test Tours) - Dodatna Strategija

Pored SBTM, možemo koristiti i **Test Tours** - metafore koje vode istraživanje:

### **1. The Money Tour**

Testiraj najvažnije feature-e koje većina korisnika koristi.

- **Za pretragu:** Osnovna pretraga → Klik na rezultat → Povratak

### **2. The Landmark Tour**

Testiraj sve glavne feature-e bar jednom.

- **Za pretragu:** Search, Filters, Categories, Sort, Pagination

### **3. The Intellectual Tour**

Testiraj kompleksne scenarije koji zahtijevaju razmišljanje.

- **Za pretragu:** Kombinacije filtera, Edge cases, Nested searches

### **4. The Back Alley Tour**

Testiraj retko korištene feature-e i hidden functionality.

- **Za pretragu:** Direct URL manipulation, Query string hacking

### **5. The Bad Neighborhood Tour**

Namjerno unosi loše podatke i testira error handling.

- **Za pretragu:** XSS, SQL injection, Invalid inputs

---

## Prednosti i Mane Istraživačkog Testiranja

### **Prednosti:**

✅ Otkriva neočekivane defekte koje skript-bazirano testiranje propušta
✅ Fleksibilno i adaptivno
✅ Stimuliše kreativnost testera
✅ Brzo daje feedback
✅ Ne zahtijeva detaljnu dokumentaciju unaprijed

### **Mane:**

❌ Teško replicirati testove
❌ Zavisi od vještine testera
❌ Može biti nestrukturirano bez SBTM
❌ Teško mjeriti pokrivenost
❌ Dokumentacija se kreira nakon testiranja

---

## Zaključak:

Za funkcionalnost pretrage na OLX.ba, koristimo **Session-Based Test Management (SBTM)** pristup istraživačkom testiranju. Organizovali smo **4 sesije** (ukupno 5 sati testiranja):

1. **90 min:** Edge case-ovi i neobične kombinacije
2. **60 min:** Sigurnost i nevažeći unosi
3. **60 min:** Interakcija između komponenata
4. **90 min:** Cross-browser i device testing

SBTM je odabran jer pruža **balans između strukture i slobode**, omogućava **mjerenje napretka**, i **dokumentuje pronađene defekte** na sistematičan način. Ova tehnika dopunjuje naše formalne automation testove i otkriva defekte koje strukturirano testiranje ne bi pronašlo.
