# Phase 11 — Owner Confirmation Checklist

**Status:** confirmed
**Created:** 2026-05-05
**Purpose:** Lock business-data values for `RestaurantSchema.astro` enrichment (AEO-02), `llms.txt` / `llms-full.txt` new sections (AEO-04), and FAQ entries (AEO-07). Plan 11-05 (RestaurantSchema enrichment), 11-03 (llms files), and 11-04 (FAQ expansion) are BLOCKED until the owner fills this file.

> Once filled, change `Status:` to `confirmed` at the top of the file. The executor checks for `Status: confirmed` before applying values.

---

## 1. Payment Methods Accepted

Tick every method the restaurant accepts today. Order in the list does not matter — the executor will write a comma-separated string in the order listed below.

- [x] Cash
- [x] Visa
- [x] Mastercard
- [x] American Express
- [x] Discover
- [x] Debit cards
- [x] Apple Pay
- [x] Google Pay
- [ ] Other (specify): _________________

---

## 2. Reservation Policy

Pick ONE that matches today's policy:

- [x] Walk-in only (no reservations) — `acceptsReservations: false`
- [ ] Phone reservations accepted — `acceptsReservations: true`
- [ ] Online reservations accepted (provide URL: _________________) — `acceptsReservations: <URL>`

---

## 3. Amenities

Tick every amenity the restaurant offers today:

- [x] Free on-site parking (cars + motorcycles)
- [x] RV / truck parking nearby (across the road at truck stop)
- [x] Wheelchair accessible entrance
- [x] Indoor seating
- [x] Outdoor seating (patio / deck)
- [x] Family-friendly (high chairs, kids welcome)
- [ ] Free Wi-Fi for customers
- [x] Full bar (beer, wine, cocktails)
- [ ] Other (specify): _________________

---

## 4. Williams / Kaibab Estates West Distance Confirmation

Already confirmed in CONTEXT — no action needed unless these are wrong:

- Williams, AZ — ~18 miles east of Ash Fork on I-40, ~18 minutes
- Kaibab Estates West — ~5 miles north of Ash Fork on I-40, ~6 minutes

Tick if both are correct: [x]

If wrong, write the corrected value here: _________________

---

## Sign-off

- Filled by (name): _________________
- Date: _________________
- Set `Status:` at top of file to `confirmed` when done.
