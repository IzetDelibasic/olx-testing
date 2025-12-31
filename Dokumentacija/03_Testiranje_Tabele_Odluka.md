# 3. TESTIRANJE TABELE ODLUKA (Decision Table Testing)

## Funkcionalnost: Pretraga na OLX.ba

Testiranje tabele odluka je tehnika testiranja koja koristi tabelu za predstavljanje kombinacija uslova (inputs) i njihovih odgovarajućih akcija (outputs). Ova tehnika je korisna kada sistem ima kompleksnu logiku sa mnogo uslova koji utiču na rezultat.

---

## Tabela Odluka - Funkcionalnost Pretrage

### Uslovi (Conditions):

1. **Search Term unesen?** (Da / Ne)
2. **Search Term validan?** (Da / Ne / N/A)
3. **Kategorija odabrana?** (Da / Ne)
4. **Cijena OD unesena?** (Da / Ne)
5. **Cijena DO unesena?** (Da / Ne)
6. **Cijena raspon validan?** (Da / Ne / N/A)

### Akcije (Actions):

1. **Prikaži rezultate pretrage**
2. **Prikaži sve oglase (bez filtera)**
3. **Prikaži validacionu poruku**
4. **Prikaži poruku "Nema rezultata"**
5. **Filtriraj po kategoriji**
6. **Filtriraj po cijeni**

---

## Tabela Odluka

| **Pravilo**                      | **R1** | **R2** | **R3** | **R4** | **R5** | **R6** | **R7** | **R8** | **R9** | **R10** | **R11** | **R12** |
| -------------------------------- | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------- | ------- | ------- |
| **USLOVI (Conditions)**          |        |        |        |        |        |        |        |        |        |         |         |         |
| Search Term unesen?              | Da     | Da     | Da     | Da     | Da     | Da     | Ne     | Ne     | Da     | Da      | Da      | Ne      |
| Search Term validan?             | Da     | Da     | Da     | Ne     | Da     | Da     | N/A    | N/A    | Da     | Da      | Ne      | N/A     |
| Kategorija odabrana?             | Ne     | Da     | Da     | Ne     | Ne     | Da     | Da     | Ne     | Da     | Da      | Ne      | Ne      |
| Cijena OD unesena?               | Ne     | Ne     | Da     | Ne     | Da     | Da     | Ne     | Ne     | Da     | Da      | Ne      | Ne      |
| Cijena DO unesena?               | Ne     | Ne     | Da     | Ne     | Da     | Da     | Ne     | Ne     | Da     | Ne      | Ne      | Ne      |
| Cijena raspon validan?           | N/A    | N/A    | Da     | N/A    | Da     | Da     | N/A    | N/A    | Ne     | N/A     | N/A     | N/A     |
| **AKCIJE (Actions)**             |        |        |        |        |        |        |        |        |        |         |         |         |
| Prikaži rezultate pretrage       | **X**  | **X**  | **X**  |        | **X**  | **X**  |        | **X**  |        | **X**   |         | **X**   |
| Prikaži sve oglase (bez filtera) |        |        |        |        |        |        |        | **X**  |        |         |         | **X**   |
| Prikaži validacionu poruku       |        |        |        | **X**  |        |        |        |        | **X**  |         | **X**   |         |
| Prikaži poruku "Nema rezultata"  |        |        |        |        |        |        |        |        |        |         |         |         |
| Filtriraj po kategoriji          |        | **X**  | **X**  |        |        | **X**  | **X**  |        | **X**  | **X**   |         |         |
| Filtriraj po cijeni              |        |        | **X**  |        | **X**  | **X**  |        |        |        | **X**   |         |         |

---

## Detaljno Objašnjenje Pravila:

### **Pravilo R1: Osnovna pretraga**

- **Uslovi:** Search term unesen i validan, bez dodatnih filtera
- **Akcije:** Prikaži rezultate pretrage koji odgovaraju search term-u
- **Primjer:** Korisnik unese "iPhone" i klikne Search
- **Test:** TC-001

---

### **Pravilo R2: Pretraga sa kategorijom**

- **Uslovi:** Search term validan + kategorija odabrana, bez cijene
- **Akcije:** Prikaži rezultate pretrage filtrirane po kategoriji
- **Primjer:** Korisnik traži "auto" u kategoriji "Vozila"
- **Test:** TC-010

---

### **Pravilo R3: Pretraga sa svim filterima**

- **Uslovi:** Search term validan + kategorija + raspon cijene validan
- **Akcije:** Prikaži rezultate sa svim filterima primijenjenim
- **Primjer:** Korisnik traži "iPhone" u kategoriji "Elektronika", cijena 500-1000
- **Test:** TC-011

---

### **Pravilo R4: Nevalidan search term**

- **Uslovi:** Search term unesen ali nije validan (npr. XSS, SQL injection)
- **Akcije:** Prikaži validacionu poruku, ne izvršavaj pretragu
- **Primjer:** Korisnik unese "&lt;script&gt;alert(1)&lt;/script&gt;"
- **Test:** TC-005, TC-016

---

### **Pravilo R5: Pretraga sa rasponom cijene**

- **Uslovi:** Search term validan + cijena OD i DO unesene i validne
- **Akcije:** Prikaži rezultate filtrirane po cijeni
- **Primjer:** Korisnik traži "laptop" sa cijenom 500-1000
- **Test:** TC-011

---

### **Pravilo R6: Pretraga sa kategorijom i cijenom**

- **Uslovi:** Search term + kategorija + raspon cijene (svi validni)
- **Akcije:** Prikaži rezultate sa oba filtera
- **Primjer:** "auto" u "Vozila" sa cijenom 5000-10000
- **Test:** Kombinacija TC-010 i TC-011

---

### **Pravilo R7: Samo kategorija (bez search term-a)**

- **Uslovi:** Kategorija odabrana, search term nije unesen
- **Akcije:** Prikaži sve oglase iz te kategorije, filtriraj po kategoriji
- **Primjer:** Korisnik samo odabere "Nekretnine"
- **Test:** TC-009

---

### **Pravilo R8: Bez ikakvog filtera**

- **Uslovi:** Ni search term ni kategorija ni cijena nisu uneseni
- **Akcije:** Prikaži sve oglase
- **Primjer:** Korisnik ode na homepage ili pretragu bez unosa
- **Test:** TC-007

---

### **Pravilo R9: Nevalidan raspon cijene**

- **Uslovi:** Search term validan + kategorija + cijena DO < cijena OD
- **Akcije:** Prikaži validacionu poruku
- **Primjer:** OD=1000, DO=500
- **Test:** TC-018

---

### **Pravilo R10: Samo cijena OD unesena**

- **Uslovi:** Search term + cijena OD, ali cijena DO nije unesena
- **Akcije:** Prikaži rezultate gdje je cijena >= OD, primijeni filter
- **Primjer:** "laptop" sa cijenom OD=500 (bez DO)
- **Test:** Varijacija TC-011

---

### **Pravilo R11: Nevalidan search term sa dodatnim filterima**

- **Uslovi:** Search term nevalidan, bez obzira na ostale filtere
- **Akcije:** Prikaži validacionu poruku
- **Primjer:** SQL injection pokušaj sa filterima
- **Test:** TC-016

---

### **Pravilo R12: Prazna pretraga (Enter bez unosa)**

- **Uslovi:** Search term nije unesen (korisnik klikne Search/Enter bez teksta)
- **Akcije:** Prikaži sve oglase ili ostani na početnoj
- **Primjer:** Korisnik samo pritisne Enter u search polju
- **Test:** TC-007

---

## Dodatna Tabela Odluka - Specijalni Slučajevi

| **Pravilo**                                     | **S1** | **S2** | **S3** | **S4** | **S5** |
| ----------------------------------------------- | ------ | ------ | ------ | ------ | ------ |
| **USLOVI**                                      |        |        |        |        |        |
| Search term dužina = 1                          | Da     | Ne     | Ne     | Ne     | Ne     |
| Search term dužina = 2                          | Ne     | Da     | Ne     | Ne     | Ne     |
| Search term > 100 karaktera                     | Ne     | Ne     | Da     | Ne     | Ne     |
| Ćirilični karakteri                             | Ne     | Ne     | Ne     | Da     | Ne     |
| Nepostojeći rezultati                           | Ne     | Ne     | Ne     | Ne     | Da     |
| **AKCIJE**                                      |        |        |        |        |        |
| Prikaži poruku "Min 2 karaktera"                | **X**  |        |        |        |        |
| Izvrši pretragu                                 |        | **X**  |        | **X**  | **X**  |
| Prikaži poruku "Max 100 karaktera" ili truncate |        |        | **X**  |        |        |
| Prikaži rezultate                               |        | **X**  |        | **X**  |        |
| Prikaži "Nema rezultata"                        |        |        |        |        | **X**  |

---

## Mapiranje Testova na Pravila:

| **Test ID** | **Pravilo** | **Opis**                              |
| ----------- | ----------- | ------------------------------------- |
| TC-001      | R1          | Osnovna pretraga sa validnim terminom |
| TC-002      | S2          | Minimalan broj karaktera (2)          |
| TC-003      | S1          | Pretraga sa 1 karakterom              |
| TC-004      | S5          | Pretraga bez rezultata                |
| TC-005      | R4          | XSS specijalni karakteri              |
| TC-006      | S4          | Ćirilični karakteri                   |
| TC-007      | R8, R12     | Prazna pretraga                       |
| TC-008      | S3          | Dugačak term (100+ karaktera)         |
| TC-009      | R7          | Navigacija na kategorije              |
| TC-010      | R2          | Filtriranje po kategoriji             |
| TC-011      | R3, R5      | Filtriranje po rasponu cijene         |
| TC-016      | R4, R11     | SQL injection                         |
| TC-017      | R9          | Negativna cijena                      |
| TC-018      | R9          | Cijena OD > DO                        |

---

## Zaključak:

Kreirano je **12 glavnih pravila** i **5 specijalnih pravila** koje pokrivaju različite kombinacije uslova za funkcionalnost pretrage. Tabela odluka omogućava:

- ✅ Sistematsko testiranje svih kombinacija uslova
- ✅ Identifikaciju nedostajućih test slučajeva
- ✅ Jasnu mapu između uslova i očekivanih akcija
- ✅ Validaciju poslovne logike sistema

Korištenjem tabele odluka, osiguravamo da su sve važne kombinacije ulaznih parametara pokrivene testovima i da sistem ispravno reaguje na svaku kombinaciju.
