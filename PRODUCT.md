# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 18, Vite, Express.js (v4 REST API), Node.js (>=18), MongoDB (Mongoose ODM v8), Vanilla CSS Design System.

## Users

- **Passengers**: Travellers searching for trains across 12+ junction stations, booking tickets across 5 class quotas (1A, 2A, 3A, SL, CC), managing E-Tickets, checking live PNR status, and initiating cancellations.
- **Railway Administrators**: Station managers and system administrators managing 30 Superfast & Vande Bharat train schedules, viewing real-time booking statistics, revenue analytics, and transaction ledgers.

## Product Purpose

RailExpress is a production-grade full-stack Railway Ticket Booking System (RTBS) designed to provide instant train availability, concurrency-safe seat allocation, simulated multi-gateway payment processing, live PNR tracking, and real-time administrator controls.

## Positioning

A zero-friction, ultra-fast railway reservation system combining real-time MongoDB Atlas cloud synchronization with a 100% functional offline hybrid in-memory fallback.

## Operating Context

- Mobile and desktop browser environments used by travellers at home, on the go, or at railway stations.
- Executive control room dashboards used by railway admins for real-time monitoring and schedule updates across 30 train routes.

## Capabilities and Constraints

- **Train Search & Schedules**: Regex-based station search, 30 bidirectional trains across 12 major Indian railway junctions.
- **Booking & Seat Allocation**: Atomic concurrency-safe seat reservation across 1A, 2A, 3A, SL, and CC classes with berth choices.
- **PNR & E-Tickets**: Live 10-digit PNR lookup, passenger coach allocation, print-ready E-Tickets with QR code verification, and instant ticket cancellation with automated seat restocking.
- **Admin Control Center**: Real-time auto-sync dashboard metrics, financial reports, JSON ledger export, and train schedule CRUD operations.
- **Design System Constraint**: Modern Flat Minimalist UI with clean high-contrast borders, dense typography, and a distraction-free travel interface.

## Brand Commitments

- Name: **RailExpress** (Railway Ticket Booking System)
- Aesthetic: Modern Flat Minimalist with crisp typography, high contrast, clean borders, and clear hierarchy.

## Evidence on Hand

- Fully functional codebase with 40/40 passing automated test suite (`backend/test/api.test.js`).
- Seeded database seeder (`backend/seed/seed.js`) containing 30 Superfast & Vande Bharat Express trains.
- Operational Render deployment configuration (`render.yaml`).

## Product Principles

1. **Clarity First**: Dense, high-contrast typography and clear visual hierarchy for instant readability during high-speed travel booking.
2. **Speed & Reliability**: Zero-downtime performance with automatic cloud/offline fallback capabilities.
3. **Operational Precision**: Accurate seat accounting, atomic booking transactions, and privacy-protected PNR lookups.
4. **Distraction-Free Focus**: High-efficiency UX tailored equally for quick mobile passenger bookings and dense admin management.

## Accessibility & Inclusion

- Accessible WCAG AA color contrast ratios for high outdoor visibility on mobile devices.
- Keyboard navigable modal dialogues, ARIA landmark navigation roles, and clean screen-reader labels.
