# 1. EKVIVALENTNOST PARTICIONIRANJA (Equivalence Partitioning)

## Funkcionalnost: Pretraga na OLX.ba

Ekvivalentnost particioniranja je tehnika testiranja koja dijeli ulazne podatke u klase ekvivalencije, gdje se očekuje da svi članovi klase budu obrađeni na isti način. Testirajući jedan predstavnik iz svake klase, možemo minimizirati broj testova uz održavanje adekvatne pokrivenosti.

---

## Tabela parametara, particija i ulaznih vrijednosti

| **Parametar**                    | **Particija** | **Tip particije** | **Opis particije**                                    | **Ulazne vrijednosti (primjeri)**                      |
| -------------------------------- | ------------- | ----------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| **Search Term (Pretraga pojam)** | P1            | Važeća            | Validna riječ (2-100 karaktera, alfanumerički)        | "iPhone", "laptop", "auto"                             |
|                                  | P2            | Važeća            | Validna riječ sa ćiriličkim karakterima               | "телефон", "аутомобил"                                 |
|                                  | P3            | Nevažeća          | 1 karakter (ispod minimuma)                           | "a", "b", "x"                                          |
|                                  | P4            | Nevažeća          | Prazan string                                         | "" (prazno)                                            |
|                                  | P5            | Nevažeća          | Preko 100 karaktera (preko maksimuma)                 | "a".repeat(101)                                        |
|                                  | P6            | Nevažeća          | Specijalni karakteri (potencijalni XSS)               | "&lt;script&gt;alert(1)&lt;/script&gt;"                |
|                                  | P7            | Nevažeća          | SQL injection pokušaj                                 | "' OR '1'='1", "'; DROP TABLE--"                       |
|                                  | P8            | Važeća            | Nepostojeći termin (validna sintaksa, nema rezultata) | "xyzqwertysdf12345"                                    |
| **Cijena OD**                    | P9            | Važeća            | Pozitivan broj (0-999999)                             | 100, 500, 1000                                         |
|                                  | P10           | Nevažeća          | Negativan broj                                        | -100, -50                                              |
|                                  | P11           | Nevažeća          | Nula                                                  | 0                                                      |
|                                  | P12           | Nevažeća          | Tekst umjesto broja                                   | "abc", "text"                                          |
|                                  | P13           | Nevažeća          | Prazan string                                         | ""                                                     |
| **Cijena DO**                    | P14           | Važeća            | Pozitivan broj veći od "Cijena OD"                    | 2000, 5000                                             |
|                                  | P15           | Nevažeća          | Broj manji od "Cijena OD"                             | 50 (kada je OD=100)                                    |
|                                  | P16           | Nevažeća          | Negativan broj                                        | -200                                                   |
|                                  | P17           | Nevažeća          | Tekst umjesto broja                                   | "xyz"                                                  |
| **Kategorija**                   | P18           | Važeća            | Validna kategorija iz dropdown-a                      | "Vozila", "Nekretnine", "Elektronika"                  |
|                                  | P19           | Nevažeća          | Nevažeća kategorija (ne postoji)                      | "NepostojecaKategorija123"                             |
|                                  | P20           | Važeća            | Bez odabrane kategorije (sve kategorije)              | null, undefined                                        |
| **Sortiranje**                   | P21           | Važeća            | Validna opcija sortiranja                             | "Po datumu", "Po cijeni rastuće", "Po cijeni padajuće" |
|                                  | P22           | Nevažeća          | Nevažeća opcija sortiranja                            | "InvalidSort"                                          |

---

## Objašnjenje particija i zašto su odabrane:

### **Search Term (Pretraga pojam):**

- **P1 (Važeća):** Normalan slučaj upotrebe - korisnici pretražuju proizvode/usluge sa validnim riječima.
- **P2 (Važeća):** Podrška za ćirilične karaktere je bitna za BIH tržište gdje se koriste oba pisma.
- **P3 (Nevažeća):** Testira validaciju minimalnog broja karaktera (2).
- **P4 (Nevažeća):** Prazna pretraga ne bi trebala biti dozvoljena ili bi trebala vratiti poruku.
- **P5 (Nevažeća):** Testira maksimalnu dužinu inputa kako bi se spriječio DOS napad.
- **P6 (Nevažeća):** Testira XSS zaštitu - kritično za sigurnost aplikacije.
- **P7 (Nevažeća):** Testira SQL injection zaštitu - kritično za sigurnost baze podataka.
- **P8 (Važeća):** Validna sintaksa ali nema rezultata - testira ponašanje sistema kada nema podudaranja.

### **Cijena OD/DO:**

- **P9, P14 (Važeće):** Normalan slučaj upotrebe - korisnici filtriraju po rasponu cijene.
- **P10, P16 (Nevažeće):** Negativne cijene nemaju smisla i trebaju biti odbijene.
- **P11 (Nevažeća):** Nula može biti granični slučaj koji treba testirati.
- **P12, P17 (Nevažeće):** Tekst umjesto broja testira validaciju tipa podataka.
- **P13 (Nevažeća):** Prazan string testira ponašanje kada nije unesen filter.
- **P15 (Nevažeća):** Logička greška - "DO" cijena ne može biti manja od "OD" cijene.

### **Kategorija:**

- **P18 (Važeća):** Normalno filtriranje po kategorijama.
- **P19 (Nevažeća):** Testira ponašanje sa nevažećim parametrom.
- **P20 (Važeća):** Korisnik može pretraživati sve kategorije bez filtera.

### **Sortiranje:**

- **P21 (Važeća):** Normalana funkcionalnost sortiranja rezultata.
- **P22 (Nevažeća):** Testira ponašanje sa nevažećim parametrom sortiranja.

---

## Testni slučajevi bazirani na particijama:

| **Test ID** | **Particije pokrivene** | **Opis testa**                                     |
| ----------- | ----------------------- | -------------------------------------------------- |
| TC-001      | P1                      | Pretraga sa validnim ključnim riječima ("iPhone")  |
| TC-002      | P1                      | Pretraga sa minimalnim brojem karaktera (2) - "ab" |
| TC-003      | P3                      | Pretraga sa jednim karakterom - "a"                |
| TC-004      | P8                      | Pretraga bez rezultata - "xyzqwertysdf12345"       |
| TC-005      | P6                      | Pretraga sa specijalnim karakterima (XSS pokušaj)  |
| TC-006      | P2                      | Pretraga sa ćiriličkim karakterima - "телефон"     |
| TC-007      | P4                      | Prazna pretraga                                    |
| TC-008      | P5                      | Pretraga sa dugačkim terminom (100 karaktera)      |
| TC-011      | P9, P14                 | Filtriranje po rasponu cijene (500-1000)           |
| TC-016      | P7                      | Pretraga sa SQL injection pokušajem                |
| TC-017      | P10                     | Pretraga sa negativnom cijenom                     |
| TC-018      | P15                     | Pretraga sa cijenom OD većom od cijene DO          |

---

## Zaključak:

Identifikovano je **22 particije ekvivalencije** za funkcionalnost pretrage na OLX.ba. Ove particije pokrivaju:

- ✅ Validne ulaze (normalna upotreba)
- ✅ Nevažeće ulaze (granični slučajevi)
- ✅ Sigurnosne testove (XSS, SQL injection)
- ✅ Validaciju tipova podataka
- ✅ Logičku validaciju (raspon cijene)

Testiranjem po jednog predstavnika iz svake particije, osiguravamo sveobuhvatnu pokrivenost bez redundantnih testova.
