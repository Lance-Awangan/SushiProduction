# Product Catalog

## Overview

This document defines all products currently supported by the Sushi Production application.

Version: v0.2.5

---

## Product Data Structure

Each product contains:

| Field | Description |
|---------|---------|
| name | Product display name |
| price | Selling price (JPY) |
| shariPer | Shari quantity per pack (貫) |
| makiG | Maki rice amount per pack (g) |

---

# Nigiri / Assorted Sushi Sets

| Product | Price (¥) | Shari Per Pack (貫) | Maki Rice (g) |
|----------|----------:|----------:|----------:|
| 真 | 7,990 | 40 | 0 |
| 美 | 4,990 | 33 | 160 |
| 善 | 5,990 | 36 | 160 |
| 海峡 | 3,990 | 24 | 0 |
| さざ波 | 2,800 | 24 | 0 |
| 松 | 1,590 | 10 | 0 |
| 竹 | 1,390 | 10 | 0 |
| 梅 | 1,290 | 6 | 80 |

---

# Ranger Series

| Product | Price (¥) | Shari Per Pack (貫) | Maki Rice (g) |
|----------|----------:|----------:|----------:|
| 赤レンジアー | 1,590 | 6 | 80 |
| 紅白レンジアー | 1,290 | 9 | 0 |
| 虹レンジアー | 1,290 | 8 | 40 |
| 橙レンジアー | 1,290 | 6 | 80 |
| 茶助レンジアー | 1,290 | 3 | 0 |
| 青レンジアー | 1,290 | 3 | 0 |

---

# Single Item Sushi

| Product | Price (¥) | Shari Per Pack (貫) | Maki Rice (g) |
|----------|----------:|----------:|----------:|
| マグロ | 699 | 6 | 0 |
| タイ | 680 | 6 | 0 |
| サモン | 580 | 6 | 0 |
| ぶり | 699 | 6 | 0 |
| エビ | 580 | 6 | 0 |
| あじ | 599 | 6 | 0 |

---

# Rolls / Donburi

| Product | Price (¥) | Shari Per Pack (貫) | Maki Rice (g) |
|----------|----------:|----------:|----------:|
| 鉄火巻き | 599 | 0 | 80 |
| ネギトロ巻き | 499 | 0 | 80 |
| 海鮮巻き | 599 | 0 | 230 |
| 海鮮丼 | 990 | 0 | 200 |
| 昆布巻き | 499 | 0 | 140 |
| サモン巻き | 450 | 0 | 120 |
| トロタク巻き | 499 | 0 | 120 |

---

# Future Improvements

Future versions should support:

- Product image
- Product category
- Product color tag
- Product active/inactive status
- Product display order

---

# Flutter Domain Model (Draft)

```dart
class Product {
  final String id;
  final String name;
  final int price;
  final double shariPer;
  final double makiG;
  final bool isActive;
}
```