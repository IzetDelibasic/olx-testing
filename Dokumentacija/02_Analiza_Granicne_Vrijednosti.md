# 2. ANALIZA GRANIČNE VRIJEDNOSTI (Boundary Value Analysis)

## Funkcionalnost: Pretraga na OLX.ba

Analiza granične vrijednosti je tehnika testiranja koja fokusira na testiranje graničnih vrijednosti particija ekvivalencije. Iskustvo pokazuje da defekti često nastaju na granicama ulaznih domena. Ova tehnika testira vrijednosti na granici, kao i jednu vrijednost ispod i iznad granice.

---

## Tabela parametara, particija ekvivalencije i graničnih vrijednosti

| **Parametar**                  | **Particija Ekvivalencije**    | **Granične Vrijednosti** | **Testne Vrijednosti**                                                                                         | **Opis**                                                         |
| ------------------------------ | ------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Search Term - Dužina**       | P1: 2-100 karaktera (važeća)   | Min: 2, Max: 100         | 1 karakter ("a")<br>2 karaktera ("ab")<br>3 karaktera ("abc")<br>99 karaktera<br>100 karaktera<br>101 karakter | Testiranje minimalne (2) i maksimalne (100) dužine search term-a |
|                                | P3: < 2 karaktera (nevažeća)   | Min boundary - 1         | 0 karaktera (prazno)<br>1 karakter ("x")                                                                       | Testiranje ispod minimalne granice                               |
|                                | P5: > 100 karaktera (nevažeća) | Max boundary + 1         | 101 karakter<br>102 karaktera<br>200 karaktera                                                                 | Testiranje iznad maksimalne granice                              |
| **Cijena OD**                  | P9: 0-999999 (važeća)          | Min: 0, Max: 999999      | -1<br>0<br>1<br>999998<br>999999<br>1000000                                                                    | Testiranje raspona cijena "OD"                                   |
|                                | P10: < 0 (nevažeća)            | Below Min                | -1<br>-100<br>-999                                                                                             | Negativne vrijednosti                                            |
| **Cijena DO**                  | P14: > Cijena OD (važeća)      | Min: Cijena OD + 1       | Ako OD=100:<br>99 (ispod)<br>100 (jednako)<br>101 (iznad)<br>999999 (max)                                      | Testiranje relacije između OD i DO cijene                        |
|                                | P15: < Cijena OD (nevažeća)    | Below Min                | Ako OD=100:<br>0<br>50<br>99                                                                                   | DO cijena manja od OD cijene                                     |
| **Broj rezultata po stranici** | P23: 10-100 (važeća)           | Min: 10, Max: 100        | 9<br>10<br>11<br>99<br>100<br>101                                                                              | Testiranje paginacije                                            |
| **Stranica (Page number)**     | P24: 1-N (važeća)              | Min: 1                   | 0<br>1<br>2<br>Last page<br>Last page + 1                                                                      | Testiranje broja stranice                                        |

---

## Detaljno objašnjenje graničnih vrijednosti:

### 1. **Search Term - Dužina karaktera**

**Važeća particija: 2-100 karaktera**

Granične vrijednosti:

- **1 karakter** (ispod minimuma) - Očekuje se validaciona poruka ili odbijanje
- **2 karaktera** (minimum) - Najmanji prihvatljiv unos, test bi trebao proći
- **3 karaktera** (minimum + 1) - Sigurno u važećem opsegu
- **99 karaktera** (maximum - 1) - Blizu gornje granice ali još uvijek važeće
- **100 karaktera** (maximum) - Najveći prihvatljiv unos
- **101 karakter** (iznad maksimuma) - Očekuje se odbijanje ili truncation

**Zašto testiramo ove granice:**

- Greške često nastaju na granicama (off-by-one errors)
- Validacija može biti netačno implementirana (>= umjesto >, <= umjesto <)
- Buffer overflow problemi kod dugih stringova

---

### 2. **Cijena OD (Minimalna cijena)**

**Važeća particija: 0-999999**

Granične vrijednosti:

- **-1** (ispod minimuma) - Negativan broj, nevažeće
- **0** (minimum) - Granični slučaj, može biti besplatno ili invalidno
- **1** (minimum + 1) - Najmanja realna cijena
- **999998** (maximum - 1) - Blizu gornje granice
- **999999** (maximum) - Najviša dopuštena cijena
- **1000000** (iznad maksimuma) - Prelazi limit

**Zašto testiramo ove granice:**

- Testiranje kako sistem rukuje sa cijenom 0 (besplatni oglasi)
- Testiranje kako se ponašaju negativne cijene (greška validacije)
- Testiranje maksimalnog broja koji sistem može pohraniti

---

### 3. **Cijena DO (Maksimalna cijena)**

**Važeća particija: Cijena DO > Cijena OD**

Primjer: Ako je Cijena OD = 100

Granične vrijednosti:

- **99** (ispod OD) - Logička greška, DO < OD
- **100** (jednako OD) - Granični slučaj, raspon = 0
- **101** (iznad OD) - Minimalni važeći raspon
- **999999** (maximum) - Najveći mogući raspon

**Zašto testiramo ove granice:**

- Testiranje logičke validacije (DO mora biti >= OD)
- Granični slučaj gdje je raspon = 0 (OD = DO)
- Testiranje kako sistem rukuje sa nelogičnim unosima

---

### 4. **Broj rezultata po stranici**

**Važeća particija: 10-100**

Granične vrijednosti:

- **9** (ispod minimuma) - Previše malo rezultata
- **10** (minimum) - Najmanji broj rezultata po stranici
- **11** (minimum + 1) - Sigurno važeće
- **99** (maximum - 1) - Blizu gornje granice
- **100** (maximum) - Maksimalan broj rezultata
- **101** (iznad maksimuma) - Može uzrokovati performanse probleme

**Zašto testiramo ove granice:**

- Performance testing - previše rezultata može usporiti stranicu
- UX testing - premalo rezultata zahtijeva često listanje
- Testiranje kako sistem rukuje sa krajnjim vrijednostima

---

## Testni slučajevi za granične vrijednosti:

| **Test ID** | **Parametar**   | **Granična Vrijednost** | **Ulazna Vrijednost** | **Očekivani Rezultat**                                      |
| ----------- | --------------- | ----------------------- | --------------------- | ----------------------------------------------------------- |
| BVA-001     | Search Term     | Min - 1                 | 1 karakter ("a")      | Poruka: "Minimalno 2 karaktera" ili pretraga se ne izvršava |
| BVA-002     | Search Term     | Min                     | 2 karaktera ("ab")    | Pretraga se uspješno izvršava                               |
| BVA-003     | Search Term     | Min + 1                 | 3 karaktera ("abc")   | Pretraga se uspješno izvršava                               |
| BVA-004     | Search Term     | Max - 1                 | 99 karaktera          | Pretraga se uspješno izvršava                               |
| BVA-005     | Search Term     | Max                     | 100 karaktera         | Pretraga se uspješno izvršava                               |
| BVA-006     | Search Term     | Max + 1                 | 101 karakter          | String se truncira na 100 ili prikazuje se poruka           |
| BVA-007     | Cijena OD       | Min - 1                 | -1                    | Validaciona poruka: "Cijena ne može biti negativna"         |
| BVA-008     | Cijena OD       | Min                     | 0                     | Prihvaćeno (besplatni oglasi) ili validaciona poruka        |
| BVA-009     | Cijena OD       | Min + 1                 | 1                     | Pretraga se izvršava sa cijenom >= 1                        |
| BVA-010     | Cijena OD       | Max - 1                 | 999998                | Pretraga se izvršava                                        |
| BVA-011     | Cijena OD       | Max                     | 999999                | Pretraga se izvršava                                        |
| BVA-012     | Cijena OD       | Max + 1                 | 1000000               | Validaciona poruka ili truncation na 999999                 |
| BVA-013     | Cijena DO vs OD | DO < OD                 | OD=100, DO=99         | Poruka: "Cijena DO mora biti >= Cijena OD"                  |
| BVA-014     | Cijena DO vs OD | DO = OD                 | OD=100, DO=100        | Rezultati gdje cijena = 100                                 |
| BVA-015     | Cijena DO vs OD | DO = OD + 1             | OD=100, DO=101        | Rezultati u rasponu 100-101                                 |
| BVA-016     | Broj rezultata  | Min - 1                 | 9 rezultata           | Default na 10 ili validaciona poruka                        |
| BVA-017     | Broj rezultata  | Min                     | 10 rezultata          | Prikazuje se 10 rezultata po stranici                       |
| BVA-018     | Broj rezultata  | Max                     | 100 rezultata         | Prikazuje se 100 rezultata po stranici                      |
| BVA-019     | Broj rezultata  | Max + 1                 | 101 rezultat          | Default na 100 ili validaciona poruka                       |
| BVA-020     | Broj stranice   | Min - 1                 | Stranica 0            | Error ili redirect na stranicu 1                            |
| BVA-021     | Broj stranice   | Min                     | Stranica 1            | Prva stranica rezultata                                     |
| BVA-022     | Broj stranice   | Last page               | Zadnja stranica       | Prikazuje posljednje rezultate                              |
| BVA-023     | Broj stranice   | Last + 1                | Stranica nakon zadnje | Poruka: "Nema više rezultata" ili redirect                  |

---

## Mapiranje testova iz našeg test suite-a:

| **Naš Test**                                          | **BVA Test ID** | **Granična Vrijednost**            |
| ----------------------------------------------------- | --------------- | ---------------------------------- |
| TC-002: Pretraga sa minimalnim brojem karaktera (2)   | BVA-002         | Search Term Min (2 karaktera)      |
| TC-003: Pretraga sa jednim karakterom                 | BVA-001         | Search Term Min - 1 (1 karakter)   |
| TC-008: Pretraga sa dugačkim terminom (100 karaktera) | BVA-005         | Search Term Max (100 karaktera)    |
| TC-017: Pretraga sa negativnom cijenom                | BVA-007         | Cijena OD Min - 1 (negativan broj) |
| TC-018: Pretraga sa cijenom od manjom od cijene do    | BVA-013         | Cijena DO < Cijena OD              |

---

## Zaključak:

Analiza granične vrijednosti identificirala je **23 testna slučaja** fokusirana na kritične granice sistema pretrage. Ovi testovi pokrivaju:

- ✅ Dužinu search term-a (min: 2, max: 100)
- ✅ Raspon cijena (0-999999)
- ✅ Relaciju između OD i DO cijene
- ✅ Paginaciju i broj rezultata
- ✅ Brojeve stranica

Testiranjem graničnih vrijednosti, maksimiziramo šanse da otkrijemo "off-by-one" greške i probleme sa validacijom koje često nastaju na granicama ulaznih domena.
