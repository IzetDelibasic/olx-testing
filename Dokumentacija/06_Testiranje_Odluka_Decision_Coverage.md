# 6. TESTIRANJE ODLUKA (Decision Coverage) I POKRIVENOST

## Funkcionalnost: Pretraga na OLX.ba

Testiranje odluka (decision coverage ili branch coverage) je tehnika white-box testiranja koja osigurava da svaka odluka u kodu bude evaluirana i na TRUE i na FALSE. Za razliku od statement coverage koja testira pojedinačne linije koda, decision coverage fokusira na logičke uslove i branch point-ove.

---

## Pseudo Kod sa Označenim Odlukama

```pseudocode
FUNCTION executeSearch(searchTerm, category, priceFrom, priceTo):
    results = []
    errorMessage = null

    // DECISION D1: Da li je search term prazan?
    IF searchTerm IS NULL OR searchTerm IS EMPTY THEN     // D1
        // D1 = TRUE
        RETURN showAllListings()
    END IF
    // D1 = FALSE - nastavlja se

    searchTerm = TRIM(searchTerm)

    // DECISION D2: Da li je search term prekratak?
    IF LENGTH(searchTerm) < 2 THEN                        // D2
        // D2 = TRUE
        errorMessage = "Minimalno 2 karaktera potrebna"
        RETURN errorMessage
    END IF
    // D2 = FALSE - nastavlja se

    // DECISION D3: Da li je search term predugačak?
    IF LENGTH(searchTerm) > 100 THEN                      // D3
        // D3 = TRUE
        searchTerm = SUBSTRING(searchTerm, 0, 100)
    END IF
    // D3 = FALSE - nastavlja se

    // DECISION D4: Da li search term sadrži XSS?
    IF containsScriptTags(searchTerm) THEN                // D4
        // D4 = TRUE
        errorMessage = "Nevalidni karakteri u pretrazi"
        RETURN errorMessage
    END IF
    // D4 = FALSE - nastavlja se

    // DECISION D5: Da li search term sadrži SQL injection?
    IF containsSQLInjection(searchTerm) THEN              // D5
        // D5 = TRUE
        searchTerm = sanitize(searchTerm)
    END IF
    // D5 = FALSE - nastavlja se

    // DECISION D6: Da li search term sadrži ćirilične karaktere?
    IF containsCyrillic(searchTerm) THEN                  // D6
        // D6 = TRUE
        searchTerm = convertCyrillicToLatin(searchTerm)
    END IF
    // D6 = FALSE - nastavlja se

    // DECISION D7: Da li je priceFrom unesen?
    IF priceFrom IS NOT NULL THEN                         // D7
        // D7 = TRUE

        // DECISION D8: Da li je priceFrom negativan?
        IF priceFrom < 0 THEN                             // D8
            // D8 = TRUE
            errorMessage = "Cijena ne može biti negativna"
            RETURN errorMessage
        END IF
        // D8 = FALSE

        // DECISION D9: Da li je priceFrom preko limita?
        IF priceFrom > 999999 THEN                        // D9
            // D9 = TRUE
            priceFrom = 999999
        END IF
        // D9 = FALSE
    END IF
    // D7 = FALSE - preskače se cijeli blok

    // DECISION D10: Da li je priceTo unesen?
    IF priceTo IS NOT NULL THEN                           // D10
        // D10 = TRUE

        // DECISION D11: Da li je priceTo negativan?
        IF priceTo < 0 THEN                               // D11
            // D11 = TRUE
            errorMessage = "Cijena ne može biti negativna"
            RETURN errorMessage
        END IF
        // D11 = FALSE

        // DECISION D12: Da li je priceTo manji od priceFrom?
        IF priceTo < priceFrom THEN                       // D12
            // D12 = TRUE
            errorMessage = "Cijena DO mora biti >= OD"
            RETURN errorMessage
        END IF
        // D12 = FALSE
    END IF
    // D10 = FALSE - preskače se cijeli blok

    query = buildSearchQuery(searchTerm, category, priceFrom, priceTo)
    results = DATABASE.execute(query)

    // DECISION D13: Da li su rezultati prazni?
    IF results IS EMPTY THEN                              // D13
        // D13 = TRUE
        RETURN "Nema rezultata za vašu pretragu"
    END IF
    // D13 = FALSE - nastavlja se

    results = SORT(results, BY date DESC)
    RETURN results

END FUNCTION
```

---

## Tabela Odluka (Decisions)

| **Odluka ID** | **Odluka**                       | **TRUE Slučaj**         | **FALSE Slučaj**       |
| ------------- | -------------------------------- | ----------------------- | ---------------------- |
| D1            | searchTerm IS NULL OR EMPTY      | Prikaži sve oglase      | Nastavi sa validacijom |
| D2            | LENGTH(searchTerm) < 2           | Error: Min 2 karaktera  | Nastavi sa validacijom |
| D3            | LENGTH(searchTerm) > 100         | Truncate na 100         | Nastavi sa validacijom |
| D4            | containsScriptTags(searchTerm)   | Error: XSS              | Nastavi sa validacijom |
| D5            | containsSQLInjection(searchTerm) | Sanitize term           | Nastavi sa validacijom |
| D6            | containsCyrillic(searchTerm)     | Convert to Latin        | Nastavi sa validacijom |
| D7            | priceFrom IS NOT NULL            | Validiraj priceFrom     | Preskoči validaciju    |
| D8            | priceFrom < 0                    | Error: Negativna cijena | Nastavi                |
| D9            | priceFrom > 999999               | Cap na 999999           | Nastavi                |
| D10           | priceTo IS NOT NULL              | Validiraj priceTo       | Preskoči validaciju    |
| D11           | priceTo < 0                      | Error: Negativna cijena | Nastavi                |
| D12           | priceTo < priceFrom              | Error: DO < OD          | Nastavi                |
| D13           | results IS EMPTY                 | "Nema rezultata"        | Return results         |

**Ukupno odluka: 13**
**Za 100% decision coverage: 13 × 2 = 26 testova (svaka odluka TRUE i FALSE)**

---

## Testni Slučajevi za Pokrivenost Odluka

| **Test ID** | **Opis**                 | **Ulazni Podaci**                                      | **Odluke Pokrivene (TRUE)**  | **Odluke Pokrivene (FALSE)**                                                                         |
| ----------- | ------------------------ | ------------------------------------------------------ | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| **DC-001**  | Prazna pretraga          | searchTerm = ""                                        | D1=TRUE                      | -                                                                                                    |
| **DC-002**  | Validna osnovna pretraga | searchTerm = "iPhone"                                  | D13=FALSE                    | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE, D5=FALSE, D6=FALSE, D7=FALSE, D10=FALSE                      |
| **DC-003**  | 1 karakter               | searchTerm = "a"                                       | D2=TRUE                      | D1=FALSE                                                                                             |
| **DC-004**  | 2 karaktera (granična)   | searchTerm = "ab"                                      | D13=FALSE                    | D1=FALSE, D2=FALSE                                                                                   |
| **DC-005**  | 101 karakter             | searchTerm = "a"\*101                                  | D3=TRUE                      | D1=FALSE, D2=FALSE                                                                                   |
| **DC-006**  | XSS pokušaj              | searchTerm = "&lt;script&gt;"                          | D4=TRUE                      | D1=FALSE, D2=FALSE, D3=FALSE                                                                         |
| **DC-007**  | SQL injection            | searchTerm = "' OR '1'='1"                             | D5=TRUE, D13=FALSE           | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE                                                               |
| **DC-008**  | Ćirilični karakteri      | searchTerm = "телефон"                                 | D6=TRUE, D13=FALSE           | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE, D5=FALSE                                                     |
| **DC-009**  | Negativna cijena OD      | searchTerm = "laptop", priceFrom = -100                | D7=TRUE, D8=TRUE             | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE, D5=FALSE, D6=FALSE                                           |
| **DC-010**  | Cijena OD > max          | searchTerm = "laptop", priceFrom = 1000000             | D7=TRUE, D9=TRUE             | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE, D5=FALSE, D6=FALSE, D8=FALSE                                 |
| **DC-011**  | Negativna cijena DO      | searchTerm = "laptop", priceFrom = 500, priceTo = -100 | D7=TRUE, D10=TRUE, D11=TRUE  | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE, D5=FALSE, D6=FALSE, D8=FALSE, D9=FALSE                       |
| **DC-012**  | Cijena DO < OD           | searchTerm = "laptop", priceFrom = 1000, priceTo = 500 | D7=TRUE, D10=TRUE, D12=TRUE  | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE, D5=FALSE, D6=FALSE, D8=FALSE, D9=FALSE, D11=FALSE            |
| **DC-013**  | Validne cijene           | searchTerm = "iPhone", priceFrom = 500, priceTo = 1000 | D7=TRUE, D10=TRUE, D13=FALSE | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE, D5=FALSE, D6=FALSE, D8=FALSE, D9=FALSE, D11=FALSE, D12=FALSE |
| **DC-014**  | Nema rezultata           | searchTerm = "xyzqwerty12345"                          | D13=TRUE                     | D1=FALSE, D2=FALSE, D3=FALSE, D4=FALSE, D5=FALSE, D6=FALSE, D7=FALSE, D10=FALSE                      |

---

## Mapa Pokrivenosti Odluka (Decision Coverage Matrix)

| **Odluka** | **TRUE Pokrivenost**                   | **FALSE Pokrivenost**                                                                                  | **100% Pokrivenost** |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------- |
| D1         | DC-001                                 | DC-002, DC-003, DC-004, DC-005, DC-006, DC-007, DC-008, DC-009, DC-010, DC-011, DC-012, DC-013, DC-014 | ✅                   |
| D2         | DC-003                                 | DC-002, DC-004, DC-005, DC-006, DC-007, DC-008, DC-009, DC-010, DC-011, DC-012, DC-013, DC-014         | ✅                   |
| D3         | DC-005                                 | DC-002, DC-003, DC-004, DC-006, DC-007, DC-008, DC-009, DC-010, DC-011, DC-012, DC-013, DC-014         | ✅                   |
| D4         | DC-006                                 | DC-002, DC-003, DC-004, DC-005, DC-007, DC-008, DC-009, DC-010, DC-011, DC-012, DC-013, DC-014         | ✅                   |
| D5         | DC-007                                 | DC-002, DC-003, DC-004, DC-005, DC-006, DC-008, DC-009, DC-010, DC-011, DC-012, DC-013, DC-014         | ✅                   |
| D6         | DC-008                                 | DC-002, DC-003, DC-004, DC-005, DC-006, DC-007, DC-009, DC-010, DC-011, DC-012, DC-013, DC-014         | ✅                   |
| D7         | DC-009, DC-010, DC-011, DC-012, DC-013 | DC-002, DC-003, DC-004, DC-005, DC-006, DC-007, DC-008, DC-014                                         | ✅                   |
| D8         | DC-009                                 | DC-010, DC-011, DC-012, DC-013                                                                         | ✅                   |
| D9         | DC-010                                 | DC-009, DC-011, DC-012, DC-013                                                                         | ✅                   |
| D10        | DC-011, DC-012, DC-013                 | DC-002, DC-003, DC-004, DC-005, DC-006, DC-007, DC-008, DC-009, DC-010, DC-014                         | ✅                   |
| D11        | DC-011                                 | DC-012, DC-013                                                                                         | ✅                   |
| D12        | DC-012                                 | DC-013                                                                                                 | ✅                   |
| D13        | DC-014                                 | DC-002, DC-004, DC-007, DC-008, DC-013                                                                 | ✅                   |

**Decision Coverage: 13/13 odluka × 2 (TRUE/FALSE) = 26/26 = 100%**

---

## Kontrolni Dijagram Toka sa Branch Point-ovima

```
                [START]
                   ↓
            ┌──────────┐
         ┌──│ D1: NULL?│──┐
      TRUE│  └──────────┘  │FALSE
          ↓                ↓
     [Show All]       ┌────────┐
          ↓        ┌──│D2:<2?  │──┐
      [RETURN]  TRUE│  └────────┘  │FALSE
                   ↓               ↓
              [Error]         ┌────────┐
                   ↓       ┌──│D3:>100?│──┐
               [RETURN] TRUE│  └────────┘  │FALSE
                           ↓               ↓
                      [Truncate]      ┌────────┐
                           ↓       ┌──│D4:XSS? │──┐
                           └──────►│  └────────┘  │FALSE
                                TRUE│              ↓
                                   ↓          ┌────────┐
                              [Error]      ┌──│D5:SQL? │──┐
                                   ↓    TRUE│  └────────┘  │FALSE
                               [RETURN]    ↓               ↓
                                     [Sanitize]       ┌────────┐
                                           ↓       ┌──│D6:CYR? │──┐
                                           └──────►│  └────────┘  │FALSE
                                                TRUE│              ↓
                                                   ↓          ┌────────┐
                                             [Convert]    ┌──│D7:From?│──┐
                                                   ↓   TRUE│  └────────┘  │FALSE
                                                   └──────►│              ↓
                                                  ┌────────▼──┐           │
                                               ┌──│D8:<0?     │──┐        │
                                            TRUE│  └───────────┘  │FALSE  │
                                                ↓                 ↓       │
                                           [Error]        ┌────────┐     │
                                                ↓      ┌──│D9:>max?│──┐  │
                                            [RETURN]TRUE│  └────────┘  │  │
                                                       ↓             FALSE│
                                                   [Cap]                ↓ │
                                                       ↓                └─┤
                                                       └──────────────────┤
                                                                          ↓
                                                                  ┌────────────┐
                                                               ┌──│D10:To?     │──┐
                                                            TRUE│  └────────────┘  │FALSE
                                                                ↓                  ↓
                                                       ┌────────────┐              │
                                                    ┌──│D11:<0?     │──┐           │
                                                 TRUE│  └────────────┘  │FALSE     │
                                                    ↓                   ↓          │
                                               [Error]         ┌────────────┐     │
                                                    ↓       ┌──│D12:<From?  │──┐  │
                                                [RETURN] TRUE│  └────────────┘  │  │
                                                            ↓                FALSE│
                                                       [Error]                  ↓ │
                                                            ↓                   └─┤
                                                        [RETURN]                  │
                                                                                  ↓
                                                                      [Execute Query]
                                                                                  ↓
                                                                          ┌────────────┐
                                                                       ┌──│D13:Empty?  │──┐
                                                                    TRUE│  └────────────┘  │FALSE
                                                                        ↓                  ↓
                                                                   ["No Res"]         [Sort]
                                                                        ↓                  ↓
                                                                    [RETURN]          [Return]
                                                                                           ↓
                                                                                       [RETURN]
```

---

## Mapiranje na Automation Testove

| **Automation Test** | **Decision Coverage Test** | **Odluke TRUE** | **Odluke FALSE**                              |
| ------------------- | -------------------------- | --------------- | --------------------------------------------- |
| TC-001              | DC-002                     | -               | D1, D2, D3, D4, D5, D6, D7, D10, D13          |
| TC-002              | DC-004                     | -               | D1, D2                                        |
| TC-003              | DC-003                     | D2              | D1                                            |
| TC-004              | DC-014                     | D13             | D1, D2, D3, D4, D5, D6, D7, D10               |
| TC-005              | DC-006                     | D4              | D1, D2, D3                                    |
| TC-006              | DC-008                     | D6              | D1, D2, D3, D4, D5                            |
| TC-007              | DC-001                     | D1              | -                                             |
| TC-008              | DC-005                     | D3              | D1, D2                                        |
| TC-011              | DC-013                     | D7, D10         | D1, D2, D3, D4, D5, D6, D8, D9, D11, D12, D13 |
| TC-016              | DC-007                     | D5              | D1, D2, D3, D4                                |
| TC-017              | DC-009                     | D7, D8          | D1, D2, D3, D4, D5, D6                        |
| TC-018              | DC-012                     | D7, D10, D12    | D1, D2, D3, D4, D5, D6, D8, D9, D11           |

---

## Zaključak:

Identifikovano je **13 odluka (branch points)** u pseudo kodu funkcionalnosti pretrage. Kreirano je **14 testnih slučajeva** koji postižu **100% decision coverage (26/26 branch-ova)**. Decision coverage obezbeđuje:

- ✅ Svaka odluka evaluirana na TRUE
- ✅ Svaka odluka evaluirana na FALSE
- ✅ Svi mogući putevi kroz kod testirani
- ✅ Kompletnija pokrivenost od statement coverage

**Decision coverage > Statement coverage** jer testira i TRUE i FALSE grane, dok statement coverage samo osigurava da je linija izvršena.

**Poređenje:**

- Statement Coverage (100%): 24/24 izjava pokriveno
- Decision Coverage (100%): 26/26 branch-ova pokriveno

Decision coverage otkriva više defkata jer testira sve logičke puteve kroz aplikaciju.
