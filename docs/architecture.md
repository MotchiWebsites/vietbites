# Architecture & Implementation Notes

This document explains intentional design decisions and project-specific quirks
that are not obvious from the code alone.

---

## Notion Menu Rendering (Important)

Menu items are rendered dynamically from a Notion database with the following rules:

### Field-Based Rendering Logic

-   **Only fields explicitly mapped in `/lib/notion/menu.ts` are rendered**
-   Unknown or extra fields in Notion are ignored by design

### Category Handling

-   Categories are determined by a normalized select field
-   Category order is controlled in code, not Notion
-   Items without a valid category are excluded from rendering

### Price Display Rules

-   Prices are rendered only if a numeric value exists
-   Items with multiple sizes are rendered as grouped rows
-   Empty or zero values are intentionally hidden

### Availability Flags

-   Items marked unavailable remain in Notion but are not rendered
-   Seasonal items are controlled via explicit flags, not dates

This design avoids content editors accidentally breaking layout or pricing.

---

## Contact & Wholesale Form Architecture

The contact page serves **multiple purposes**:

-   General contact
-   Wholesale (B2B) applications
-   Catering inquiries
-   Collaborations
-   Technical issues

### Reason Selection

-   The **Reason field always exists**
-   URL parameters (`/contact?reason=wholesale`) pre-select the reason
-   The reason controls:
    -   Form heading text
    -   Required fields
    -   Which metadata is sent to email
-   The URL paramters accepted are only the ones from the catering page (not all the possible options are allowed as URL parameters)

### Wholesale-Specific Fields

Wholesale applications conditionally render:

-   Business / Institution name (required)
-   Business type
-   Website / Instagram
-   Location
-   Estimated volume

These fields are **not top-level form fields** — they are sent under `meta`.

---

## Email Payload Structure

All form submissions send:

-   `name`
-   `email`
-   `subject`
-   `message`
-   `meta` (structured key/value data)

### Why `meta` exists

-   Keeps the API stable even if form fields change
-   Allows wholesale and non-wholesale forms to share one endpoint
-   Makes admin emails readable and sortable

---

## Anti-Spam & Safety Measures

The contact form includes:

-   Honeypot field (`company`)
-   Minimum submission time check
-   Rate limiting (in-memory)
-   Subject & message length caps
-   Email validation

These are intentional and should not be removed lightly.

---

## Tooltip & Layout Notes

-   Tooltips are absolute-positioned and width-clamped
-   `max-w-[90vw]` is required to prevent mobile overflow
-   Tooltips do not affect document flow by design

---

## Accessibility Notes

-   Labels are always bound to real form controls
-   Radix Select is used for keyboard-safe dropdowns
-   Character counters do not overlap input content

---

## When Making Changes

If you modify:

-   Notion schemas
-   Contact form fields
-   Email templates

➡ Update this document to reflect the change.
