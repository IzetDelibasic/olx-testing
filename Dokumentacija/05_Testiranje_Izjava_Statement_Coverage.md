# 5. TESTIRANJE IZJAVA (Statement Coverage) I POKRIVENOST

## Funkcionalnost: Pretraga na OLX.ba

Testiranje izjava (statement coverage) je tehnika white-box testiranja koja osigurava da svaka izvršiva linija koda bude izvršena barem jednom tokom testiranja. Cilj je postići 100% pokrivenost izjava kako bi se osiguralo da nema neiskorištenog koda.

---

## Pseudo Kod za Funkcionalnost Pretrage

```pseudocode
FUNCTION executeSearch(searchTerm, category, priceFrom, priceTo):
    // 1. Inicijalizacija
    results = []
    errorMessage = null

    // 2. Validacija search term-a
    IF searchTerm IS NULL OR searchTerm IS EMPTY THEN
        RETURN showAllListings()                          // Statement S1
    END IF

    // 3. Trim i clean search term
    searchTerm = TRIM(searchTerm)                         // Statement S2

    // 4. Provjera dužine
    IF LENGTH(searchTerm) < 2 THEN
        errorMessage = "Minimalno 2 karaktera potrebna"   // Statement S3
        RETURN errorMessage                                // Statement S4
    END IF

    // 5. Provjera maksimalne dužine
    IF LENGTH(searchTerm) > 100 THEN
        searchTerm = SUBSTRING(searchTerm, 0, 100)        // Statement S5
    END IF

    // 6. XSS validacija
    IF containsScriptTags(searchTerm) THEN
        errorMessage = "Nevalidni karakteri u pretrazi"   // Statement S6
        RETURN errorMessage                                // Statement S7
    END IF

    // 7. SQL Injection validacija
    IF containsSQLInjection(searchTerm) THEN
        searchTerm = sanitize(searchTerm)                 // Statement S8
    END IF

    // 8. Podrška za ćirilicu
    IF containsCyrillic(searchTerm) THEN
        searchTerm = convertCyrillicToLatin(searchTerm)  // Statement S9
    END IF

    // 9. Validacija cijene OD
    IF priceFrom IS NOT NULL THEN
        IF priceFrom < 0 THEN
            errorMessage = "Cijena ne može biti negativna" // Statement S10
            RETURN errorMessage                             // Statement S11
        END IF
        IF priceFrom > 999999 THEN
            priceFrom = 999999                              // Statement S12
        END IF
    END IF

    // 10. Validacija cijene DO
    IF priceTo IS NOT NULL THEN
        IF priceTo < 0 THEN
            errorMessage = "Cijena ne može biti negativna" // Statement S13
            RETURN errorMessage                             // Statement S14
        END IF
        IF priceTo < priceFrom THEN
            errorMessage = "Cijena DO mora biti >= OD"     // Statement S15
            RETURN errorMessage                             // Statement S16
        END IF
    END IF

    // 11. Izvršavanje pretrage u bazi
    query = buildSearchQuery(searchTerm, category, priceFrom, priceTo)  // Statement S17
    results = DATABASE.execute(query)                                    // Statement S18

    // 12. Provjera rezultata
    IF results IS EMPTY THEN
        RETURN "Nema rezultata za vašu pretragu"          // Statement S19
    END IF

    // 13. Sortiranje rezultata
    results = SORT(results, BY date DESC)                 // Statement S20

    // 14. Vraćanje rezultata
    RETURN results                                        // Statement S21

END FUNCTION


FUNCTION showAllListings():
    results = DATABASE.getAllListings()                   // Statement S22
    results = SORT(results, BY date DESC)                 // Statement S23
    RETURN results                                        // Statement S24
END FUNCTION
```

---

## Kontrolni Dijagram Toka (Control Flow Diagram)

```
                    [START]
                       ↓
         ┌─────────────────────────┐
         │ S2: Trim search term    │
         └────────────┬────────────┘
                      ↓
         ┌────────────────────────┐
    ┌────│ searchTerm NULL/EMPTY? │────┐
    │ DA └────────────────────────┘ NE │
    ↓                                   ↓
┌────────┐              ┌──────────────────────────┐
│S1:Show │              │ LENGTH(searchTerm) < 2?  │
│All     │              └──┬───────────────────┬───┘
└────────┘              DA │                   │ NE
    ↓                      ↓                   ↓
 [RETURN]        ┌──────────────┐    ┌──────────────────┐
                 │ S3: Error    │    │ LENGTH > 100?    │
                 │ S4: Return   │    └───┬──────────┬───┘
                 └──────────────┘     DA │          │ NE
                        ↓                ↓          ↓
                    [RETURN]    ┌────────────┐     │
                                │S5:Truncate │     │
                                └──────┬─────┘     │
                                       ↓           ↓
                         ┌─────────────────────────────┐
                         │ containsScriptTags()?       │
                         └──┬──────────────────────┬───┘
                         DA │                      │ NE
                            ↓                      ↓
                   ┌──────────────┐    ┌─────────────────────┐
                   │ S6: Error    │    │ containsSQLInj()?   │
                   │ S7: Return   │    └──┬──────────────┬───┘
                   └──────────────┘    DA │              │ NE
                          ↓                ↓              ↓
                      [RETURN]    ┌────────────┐         │
                                  │S8:Sanitize │         │
                                  └──────┬─────┘         │
                                         ↓               ↓
                           ┌───────────────────────────────┐
                           │ containsCyrillic()?           │
                           └──┬────────────────────────┬───┘
                           DA │                        │ NE
                              ↓                        ↓
                     ┌────────────────┐                │
                     │S9: Convert     │                │
                     └────────┬───────┘                │
                              ↓                        ↓
                   ┌─────────────────────────────────────┐
                   │ priceFrom NOT NULL?                 │
                   └──┬──────────────────────────────┬───┘
                   DA │                              │ NE
                      ↓                              ↓
        ┌───────────────────┐                        │
        │ priceFrom < 0?    │                        │
        └──┬────────────┬───┘                        │
        DA │            │ NE                         │
           ↓            ↓                            │
    ┌──────────┐  ┌──────────────┐                  │
    │S10: Err  │  │priceFrom>max?│                  │
    │S11: Ret  │  └──┬───────┬───┘                  │
    └──────────┘  DA │       │ NE                   │
         ↓           ↓       ↓                      │
     [RETURN]  ┌─────────┐  │                       │
               │S12:Cap  │  │                       │
               └────┬────┘  │                       │
                    ↓       ↓                       ↓
         ┌────────────────────────────────────────────┐
         │ priceTo NOT NULL?                          │
         └──┬─────────────────────────────────────┬───┘
         DA │                                     │ NE
            ↓                                     ↓
  ┌──────────────────┐                           │
  │ priceTo < 0?     │                           │
  └──┬───────────┬───┘                           │
  DA │           │ NE                             │
     ↓           ↓                                │
┌─────────┐ ┌────────────────┐                   │
│S13: Err │ │ priceTo<From?  │                   │
│S14: Ret │ └──┬───────────┬─┘                   │
└─────────┘ DA │           │ NE                  │
    ↓          ↓           ↓                     │
[RETURN] ┌─────────┐       │                     │
         │S15: Err │       │                     │
         │S16: Ret │       │                     │
         └─────────┘       │                     │
             ↓             ↓                     ↓
         [RETURN]    ┌──────────────────────────────┐
                     │ S17: Build query             │
                     │ S18: Execute query           │
                     └───────────┬──────────────────┘
                                 ↓
                     ┌──────────────────────┐
                     │ results EMPTY?       │
                     └──┬───────────────┬───┘
                     DA │               │ NE
                        ↓               ↓
                 ┌──────────────┐  ┌────────────┐
                 │S19: No Res.  │  │S20: Sort   │
                 └──────┬───────┘  └──────┬─────┘
                        ↓                 ↓
                    [RETURN]       ┌────────────┐
                                   │S21: Return │
                                   └──────┬─────┘
                                          ↓
                                      [RETURN]
```

---

## Testni Slučajevi za Pokrivenost Izjava

Cilj: **Pokriti sve izjave (S1-S24) barem jednom**

| **Test ID** | **Opis**            | **Ulazni Podaci**                                                          | **Izjave Pokrivene**       | **Očekivani Rezultat**                 |
| ----------- | ------------------- | -------------------------------------------------------------------------- | -------------------------- | -------------------------------------- |
| **ST-001**  | Prazna pretraga     | searchTerm = "", category = null, priceFrom = null, priceTo = null         | S1, S22, S23, S24          | Prikaži sve oglase                     |
| **ST-002**  | Validna pretraga    | searchTerm = "iPhone", category = null, priceFrom = null, priceTo = null   | S2, S17, S18, S20, S21     | Prikaži rezultate za iPhone            |
| **ST-003**  | 1 karakter          | searchTerm = "a", category = null, priceFrom = null, priceTo = null        | S2, S3, S4                 | Error: "Minimalno 2 karaktera"         |
| **ST-004**  | 2 karaktera (min)   | searchTerm = "ab", category = null, priceFrom = null, priceTo = null       | S2, S17, S18, S20, S21     | Prikaži rezultate                      |
| **ST-005**  | 101 karakter (>max) | searchTerm = "a" \* 101, category = null, priceFrom = null, priceTo = null | S2, S5, S17, S18           | Truncate na 100, prikaži rezultate     |
| **ST-006**  | XSS pokušaj         | searchTerm = "&lt;script&gt;alert(1)&lt;/script&gt;", ...                  | S2, S6, S7                 | Error: "Nevalidni karakteri"           |
| **ST-007**  | SQL injection       | searchTerm = "' OR '1'='1", ...                                            | S2, S8, S17, S18           | Sanitize i prikaži rezultate           |
| **ST-008**  | Ćirilični karakteri | searchTerm = "телефон", ...                                                | S2, S9, S17, S18, S20, S21 | Konvertuj i prikaži rezultate          |
| **ST-009**  | Negativna cijena OD | searchTerm = "laptop", priceFrom = -100, priceTo = null                    | S2, S10, S11               | Error: "Cijena ne može biti negativna" |
| **ST-010**  | Cijena OD > max     | searchTerm = "laptop", priceFrom = 1000000, priceTo = null                 | S2, S12, S17, S18          | Cap na 999999, prikaži rezultate       |
| **ST-011**  | Negativna cijena DO | searchTerm = "laptop", priceFrom = 500, priceTo = -100                     | S2, S13, S14               | Error: "Cijena ne može biti negativna" |
| **ST-012**  | Cijena DO < OD      | searchTerm = "laptop", priceFrom = 1000, priceTo = 500                     | S2, S15, S16               | Error: "Cijena DO mora biti >= OD"     |
| **ST-013**  | Validne cijene      | searchTerm = "iPhone", priceFrom = 500, priceTo = 1000                     | S2, S17, S18, S20, S21     | Prikaži rezultate u rasponu            |
| **ST-014**  | Nema rezultata      | searchTerm = "xyzqwerty12345", ...                                         | S2, S17, S18, S19          | "Nema rezultata"                       |

---

## Mapa Pokrivenosti Izjava

| **Izjava** | **Opis**               | **Testovi**                                                    | **Pokrivenost** |
| ---------- | ---------------------- | -------------------------------------------------------------- | --------------- |
| S1         | showAllListings()      | ST-001                                                         | ✅              |
| S2         | Trim searchTerm        | ST-002 do ST-014                                               | ✅              |
| S3         | Error: Min 2 karaktera | ST-003                                                         | ✅              |
| S4         | Return error           | ST-003                                                         | ✅              |
| S5         | Truncate na 100        | ST-005                                                         | ✅              |
| S6         | Error: XSS             | ST-006                                                         | ✅              |
| S7         | Return error           | ST-006                                                         | ✅              |
| S8         | Sanitize SQL           | ST-007                                                         | ✅              |
| S9         | Convert Cyrillic       | ST-008                                                         | ✅              |
| S10        | Error: Neg. cijena OD  | ST-009                                                         | ✅              |
| S11        | Return error           | ST-009                                                         | ✅              |
| S12        | Cap cijena OD          | ST-010                                                         | ✅              |
| S13        | Error: Neg. cijena DO  | ST-011                                                         | ✅              |
| S14        | Return error           | ST-011                                                         | ✅              |
| S15        | Error: DO < OD         | ST-012                                                         | ✅              |
| S16        | Return error           | ST-012                                                         | ✅              |
| S17        | Build query            | ST-002, ST-004, ST-005, ST-007, ST-008, ST-010, ST-013, ST-014 | ✅              |
| S18        | Execute query          | ST-002, ST-004, ST-005, ST-007, ST-008, ST-010, ST-013, ST-014 | ✅              |
| S19        | No results message     | ST-014                                                         | ✅              |
| S20        | Sort results           | ST-002, ST-004, ST-008, ST-013                                 | ✅              |
| S21        | Return results         | ST-002, ST-004, ST-008, ST-013                                 | ✅              |
| S22        | Get all listings       | ST-001                                                         | ✅              |
| S23        | Sort all listings      | ST-001                                                         | ✅              |
| S24        | Return all             | ST-001                                                         | ✅              |

**Pokrivenost Izjava: 24/24 = 100%**

---

## Mapiranje na Automation Testove

| **Automation Test** | **Statement Test** | **Izjave Pokrivene**       |
| ------------------- | ------------------ | -------------------------- |
| TC-001              | ST-002             | S2, S17, S18, S20, S21     |
| TC-002              | ST-004             | S2, S17, S18, S20, S21     |
| TC-003              | ST-003             | S2, S3, S4                 |
| TC-004              | ST-014             | S2, S17, S18, S19          |
| TC-005              | ST-006             | S2, S6, S7                 |
| TC-006              | ST-008             | S2, S9, S17, S18, S20, S21 |
| TC-007              | ST-001             | S1, S22, S23, S24          |
| TC-008              | ST-005             | S2, S5, S17, S18           |
| TC-016              | ST-007             | S2, S8, S17, S18           |
| TC-017              | ST-009 ili ST-011  | S2, S10, S11 ili S13, S14  |
| TC-018              | ST-012             | S2, S15, S16               |

---

## Zaključak:

Analizirano je **24 izjave** u pseudo kodu funkcionalnosti pretrage. Kreirano je **14 testnih slučajeva** koji postižu **100% pokrivenost izjava**. Ova pokrivenost osigurava:

- ✅ Svaka linija koda je izvršena barem jednom
- ✅ Svi error handling putevi su testirani
- ✅ Sve validacione provjere su pokrivene
- ✅ Svi normalni i alternativni tokovi su testirani

Statement coverage je osnovna metrika kvaliteta koda i prvi korak ka sveobuhvatnom testiranju logike aplikacije.
