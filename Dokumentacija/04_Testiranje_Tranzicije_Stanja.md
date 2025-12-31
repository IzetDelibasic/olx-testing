# 4. TESTIRANJE TRANZICIJE STANJA (State Transition Testing)

## Funkcionalnost: Pretraga na OLX.ba

Testiranje tranzicije stanja je tehnika koja modelira sistem kao skup stanja i prelaza između tih stanja. Ova tehnika je korisna kada ponašanje sistema zavisi od prethodnih događaja ili kada sistem ima različite modove rada.

---

## Dijagram Tranzicije Stanja

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         POČETNO STANJE (S0)                               │
│                         (Homepage OLX.ba)                                 │
└───────────────┬──────────────────────────────────────┬───────────────────┘
                │                                      │
                │ [1] Unos validnog search term-a      │ [2] Unos nevalidnog term-a
                │     + Click Search/Enter             │     + Click Search/Enter
                ↓                                      ↓
┌───────────────────────────────┐      ┌──────────────────────────────────┐
│   PRETRAGA U TOKU (S1)        │      │  VALIDACIONA GREŠKA (S4)         │
│   (Loading indicator)         │      │  (Error message prikazan)        │
└───────────┬───────────────────┘      └────────┬─────────────────────────┘
            │                                   │
            │ [3] Rezultati pronađeni           │ [8] Klik na Search ponovno
            │                                   │     (ispravan unos)
            ↓                                   │
┌───────────────────────────────┐              │
│  REZULTATI PRIKAZANI (S2)     │←─────────────┘
│  (Lista oglasa)               │
└───┬───────────┬───────────┬───┘
    │           │           │
    │[4]        │[5]        │[6]
    │Primjena   │Klik na    │Prazna pretraga
    │filtera    │oglas      │[9] Resetuj
    │           │           │
    ↓           ↓           ↓
┌───────────────┐ ┌─────────────────┐  ┌──────────────────┐
│ FILTRIRANI    │ │  DETALJI OGLASA │  │  POČETNO STANJE  │
│ REZULTATI(S2')│ │      (S3)       │  │      (S0)        │
└───────────────┘ └────┬────────────┘  └──────────────────┘
    │                   │
    │[5] Klik na oglas  │[7] Back / Povratak
    │                   │
    └──────────────────►│
                        ↓
                ┌───────────────┐
                │ REZULTATI (S2)│
                │  (nazad)      │
                └───────────────┘

         ┌─────────────────────┐
         │  NEMA REZULTATA(S5) │
         │  (Empty state)      │
         └─────────────────────┘
                 ↑
                 │ [10] Pretraga vraća 0 rezultata
                 │
         ┌───────┴───────────┐
         │  PRETRAGA U TOKU  │
         │      (S1)         │
         └───────────────────┘
```

---

## Stanja (States)

| **Stanje**               | **ID** | **Opis**                                                          |
| ------------------------ | ------ | ----------------------------------------------------------------- |
| **Početno stanje**       | S0     | Početna stranica OLX.ba, search polje je prazno, nema rezultata   |
| **Pretraga u toku**      | S1     | Korisnik je pokrenuo pretragu, sistem procesira zahtjev (loading) |
| **Rezultati prikazani**  | S2     | Rezultati pretrage su prikazani, lista oglasa je vidljiva         |
| **Filtrirani rezultati** | S2'    | Rezultati sa primijenjenim filterima (cijena, kategorija)         |
| **Detalji oglasa**       | S3     | Pojedinačan oglas je otvoren, prikazani su svi detalji            |
| **Validaciona greška**   | S4     | Prikazana je greška (nevalidan unos, XSS, SQL injection)          |
| **Nema rezultata**       | S5     | Pretraga je izvršena ali nema odgovarajućih oglasa                |

---

## Događaji/Tranzicije (Events/Transitions)

| **Tranzicija**        | **ID** | **Iz Stanja** | **Događaj**                               | **U Stanje** | **Akcija**                          |
| --------------------- | ------ | ------------- | ----------------------------------------- | ------------ | ----------------------------------- |
| Validan search        | [1]    | S0            | Unos validnog search term-a + Enter/Click | S1 → S2      | Izvrši pretragu, prikaži rezultate  |
| Nevalidan search      | [2]    | S0            | Unos nevalidnog term-a + Enter/Click      | S4           | Prikaži validacionu poruku          |
| Rezultati pronađeni   | [3]    | S1            | Pretraga završena uspješno                | S2           | Prikaži listu oglasa                |
| Primjena filtera      | [4]    | S2            | Klik na filter (cijena/kategorija)        | S2'          | Refresh rezultata sa filterima      |
| Klik na oglas         | [5]    | S2 ili S2'    | Klik na oglas iz liste                    | S3           | Prikaži detalje oglasa              |
| Prazna pretraga       | [6]    | S2            | Clear search / Resetuj                    | S0           | Vrati se na početnu                 |
| Povratak na rezultate | [7]    | S3            | Back dugme / Povratak                     | S2           | Vrati se na listu, očuvaj parametre |
| Popravi unos          | [8]    | S4            | Ispravi unos + Search ponovno             | S1 → S2      | Izvrši pretragu sa validnim unosom  |
| Resetuj filter        | [9]    | S2'           | Klik na "Ukloni filter"                   | S2           | Prikaži sve rezultate bez filtera   |
| Nema rezultata        | [10]   | S1            | Pretraga vraća 0 rezultata                | S5           | Prikaži "Nema rezultata" poruku     |
| Nova pretraga         | [11]   | S5            | Unos novog search term-a                  | S1 → S2/S5   | Pokušaj novu pretragu               |

---

## Tabela Tranzicije Stanja

| **Trenutno Stanje** | **Događaj**                   | **Sljedeće Stanje** | **Očekivana Akcija**                    |
| ------------------- | ----------------------------- | ------------------- | --------------------------------------- |
| S0 (Početno)        | Unos "iPhone" + Enter         | S1 → S2             | Prikaži rezultate za iPhone             |
| S0 (Početno)        | Unos "&lt;script&gt;" + Enter | S4                  | Prikaži error poruku (XSS)              |
| S0 (Početno)        | Enter bez unosa               | S0 ili S2           | Ostani na početnoj ili prikaži sve      |
| S1 (Loading)        | Rezultati pronađeni           | S2                  | Prikaži rezultate                       |
| S1 (Loading)        | Nema rezultata                | S5                  | Prikaži "Nema rezultata"                |
| S2 (Rezultati)      | Klik na kategoriju filter     | S2'                 | Filtriraj po kategoriji                 |
| S2 (Rezultati)      | Klik na oglas                 | S3                  | Otvori detalje oglasa                   |
| S2 (Rezultati)      | Clear search                  | S0                  | Vrati se na početnu                     |
| S2' (Filtrirani)    | Ukloni filter                 | S2                  | Prikaži sve rezultate                   |
| S2' (Filtrirani)    | Klik na oglas                 | S3                  | Otvori detalje oglasa                   |
| S3 (Detalji)        | Back dugme                    | S2                  | Vrati se na rezultate (očuvaj pretragu) |
| S3 (Detalji)        | Nova pretraga u headeru       | S1 → S2             | Nova pretraga                           |
| S4 (Greška)         | Ispravi unos + Search         | S1 → S2             | Izvrši validnu pretragu                 |
| S5 (Nema rezultata) | Nova pretraga                 | S1 → S2/S5          | Pokušaj novi term                       |

---

## Testni Slučajevi Bazirani na Tranzicijama

### **Test Path 1: Uspješna pretraga**

**Put:** S0 → S1 → S2 → S3 → S2

- **Koraci:**
  1. Početna stranica (S0)
  2. Unesi "iPhone" i klikni Search (S0 → S1)
  3. Čekaj da se rezultati učitaju (S1 → S2)
  4. Klikni na prvi oglas (S2 → S3)
  5. Klikni Back (S3 → S2)
- **Test:** TC-001, TC-014, TC-015

---

### **Test Path 2: Pretraga sa filterima**

**Put:** S0 → S1 → S2 → S2' → S3 → S2'

- **Koraci:**
  1. Početna stranica (S0)
  2. Unesi "auto" i klikni Search (S0 → S1 → S2)
  3. Primijeni filter "Vozila" (S2 → S2')
  4. Primijeni filter cijene 5000-10000 (S2' → S2')
  5. Klikni na oglas (S2' → S3)
  6. Vrati se nazad (S3 → S2')
- **Test:** TC-010, TC-011

---

### **Test Path 3: Nevalidan unos**

**Put:** S0 → S4 → S0 → S1 → S2

- **Koraci:**
  1. Početna stranica (S0)
  2. Unesi "&lt;script&gt;alert(1)&lt;/script&gt;" (S0 → S4)
  3. Sistem prikazuje error
  4. Unesi validan term "laptop" (S4 → S1 → S2)
- **Test:** TC-005

---

### **Test Path 4: Nema rezultata**

**Put:** S0 → S1 → S5 → S1 → S2

- **Koraci:**
  1. Početna stranica (S0)
  2. Unesi "xyzqwertysdf12345" (S0 → S1 → S5)
  3. Prikaži "Nema rezultata"
  4. Unesi "iPhone" (S5 → S1 → S2)
- **Test:** TC-004

---

### **Test Path 5: Prazna pretraga**

**Put:** S0 → S0 ili S0 → S2

- **Koraci:**
  1. Početna stranica (S0)
  2. Pritisni Enter bez unosa (S0 → S0 ili S0 → S2)
- **Test:** TC-007

---

### **Test Path 6: Minimalan broj karaktera**

**Put:** S0 → S4 ili S1 → S0 → S1 → S2

- **Koraci:**
  1. Početna stranica (S0)
  2. Unesi "a" (1 karakter) (S0 → S4 ili ostaje S0)
  3. Unesi "ab" (2 karaktera) (S0 → S1 → S2)
- **Test:** TC-003, TC-002

---

### **Test Path 7: SQL Injection pokušaj**

**Put:** S0 → S4 → S0

- **Koraci:**
  1. Početna stranica (S0)
  2. Unesi "' OR '1'='1" (S0 → S4)
  3. Sistem prikazuje error ili sigurno obrađuje unos
- **Test:** TC-016

---

### **Test Path 8: Raspon cijene - invalidna kombinacija**

**Put:** S0 → S1 → S2 → S4 → S2'

- **Koraci:**
  1. Pretraga "laptop" (S0 → S1 → S2)
  2. Postavi cijenu OD=1000, DO=500 (S2 → S4)
  3. Prikaži error
  4. Ispravi OD=500, DO=1000 (S4 → S2')
- **Test:** TC-017, TC-018

---

## Pokrivanje Tranzicija

| **Tranzicija ID** | **Opis Tranzicije**             | **Testovi**            |
| ----------------- | ------------------------------- | ---------------------- |
| [1]               | S0 → S1 → S2 (validan search)   | TC-001, TC-002, TC-006 |
| [2]               | S0 → S4 (nevalidan search)      | TC-005, TC-016         |
| [3]               | S1 → S2 (rezultati pronađeni)   | TC-001, TC-010, TC-011 |
| [4]               | S2 → S2' (primjena filtera)     | TC-010, TC-011         |
| [5]               | S2/S2' → S3 (klik na oglas)     | TC-014                 |
| [6]               | S2 → S0 (prazna pretraga/reset) | TC-007                 |
| [7]               | S3 → S2 (povratak na rezultate) | TC-015                 |
| [8]               | S4 → S1 → S2 (popravljen unos)  | TC-005 (nakon error-a) |
| [9]               | S2' → S2 (resetuj filter)       | -                      |
| [10]              | S1 → S5 (nema rezultata)        | TC-004                 |
| [11]              | S5 → S1 (nova pretraga)         | TC-004                 |

---

## Zaključak:

Identifikovano je **7 stanja** i **11 tranzicija** za funkcionalnost pretrage na OLX.ba. State transition testing omogućava:

- ✅ Modeliranje različitih stanja sistema
- ✅ Testiranje svih mogućih prelaza između stanja
- ✅ Identifikaciju nevalidnih tranzicija (npr. direktan skok S0 → S3)
- ✅ Osiguranje da sistem ispravno čuva kontekst (npr. povratak sa S3 na S2 čuva pretragu)

Testiranjem kritičnih puteva kroz dijagram stanja, osiguravamo da sistem ispravno reaguje na sve moguće sekvence događaja.
