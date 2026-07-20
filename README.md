# issue-assist: Lightweight IT Operations & Incident Management Dashboard

> **[🌐 View Live Deployment](https://issue-assist.sejabur.dev)**

## Introduction
issue-assist is a purpose-built operations dashboard designed for lightweight IT incident management. Engineered as a fast, zero-latency alternative to bloated enterprise ITSM (IT Service Management) solutions, it delivers real-time situational awareness, role-based task routing, and bulk incident management straight out of the box.

## Problem Statement
Enterprise ITSM tools often require weeks of configuration, feature excessive bloat, and impose high licensing costs. When urgent incidents occur, small IT teams and rapid-response operations centers often revert to static spreadsheets because legacy tools are too slow. This reliance on spreadsheets leads to missed deadlines, communication silos, and dangerous data collisions. issue-assist solves this by providing a highly tactile, lightning-fast interface for coordinating urgent issues across teams without the overhead of heavy enterprise infrastructure.

## Target Audience
This platform is specifically designed for:
- Small to mid-sized IT teams requiring immediate incident visibility.
- Rapid-response Network Operations Centers (NOCs) managing critical service outages.
- Technical Program Managers (TPMs) looking for a streamlined tool to coordinate cross-functional triage efforts.

## Core Functionalities
* **High-Velocity Issue Triage:** A lightning-fast interface for routing and updating IT incidents without the page-reload latency of traditional ticketing systems.
* **Urgent Incident Pings:** A permanently visible sidebar dedicated to critical alerts, ensuring severe outages are never buried in a standard queue.
* **Bulk Operations & Atomic Rollbacks:** Select multiple incidents to bulk-update statuses or delete records. A custom state-history engine allows immediate undo/redo of mass mutations.
* **Role-Based Task Routing (RBAC):** Strict separation of privileges isolating Administrative configuration panels from standard Operator triage views to prevent unauthorized system changes.
* **Session Audit Trails:** Comprehensive logging of all operational modifications, providing clear accountability during rapid incident response.
* **Dark & Light Mode:** Seamless, persistent theme toggling utilizing localStorage and Tailwind CSS dark mode variants.

## Architecture
issue-assist utilizes a decoupled, serverless edge architecture to provide real-time synchronization without the need for a traditional backend.

```mermaid
graph LR
    subgraph "Client Side (Browser)"
        UI[issue-assist UI<br/>Tailwind CSS & HTML]
        State[(In-Memory State<br/>Undo/Redo Stack)]
        UI <-->|DOM Mutations| State
    end
    
    subgraph "Serverless Edge"
        CF[Cloudflare Worker<br/>Secure Proxy & CORS Handler]
    end
    
    subgraph "Cloud Datastore"
        DB[(JSONBin.io<br/>NoSQL Database)]
    end
    
    State <-->|Polling / Sync| CF
    CF <-->|REST API| DB

    style UI fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
    style State fill:#334155,stroke:#475569,stroke-width:2px,color:#fff
    style CF fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style DB fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
```

* **Optimistic State Engine (Frontend):** An advanced Vanilla JavaScript client-side state machine processes mutations locally for zero-latency UI updates while reconciling with the global state in the background.
* **Serverless Edge API:** Real-time data synchronization is powered by a custom Cloudflare Worker acting as a secure proxy to a JSONBin.io NoSQL datastore, completely bypassing CORS restrictions.

## Local Setup and Installation
issue-assist is designed for instant deployment and immediate operational use.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sejabur/issue-assist.git
   cd issue-assist
   ```
2. **Serve locally:**
   Use any standard HTTP server to run the application (e.g., Node.js `serve`):
   ```bash
   npx serve .
   ```
3. **Open in Browser:** Navigate to `http://localhost:3000/` or `http://localhost:3000/index.html`

**API Configuration:** If deploying your own instance, create a free JSONBin.io datastore, deploy a Cloudflare Worker using the provided `cloudflare_worker.js` script, and update the `CLOUDFLARE_WORKER_URL` inside `index.html`.

## Security Overview
To protect data integrity, the application implements a multi-layered security approach:
* **Edge-Level Firewall:** The Cloudflare Worker strictly validates the HTTP `Origin` header, blocking unauthorized cross-origin requests from external domains.
* **Credential Isolation:** The `JSONBIN_MASTER_KEY` is securely stored as an environment variable within the Cloudflare Worker, never exposed to the client-side JavaScript.
* **Frontend Access Control:** Administrative privileges (such as managing operators or deleting records) are gated by session-based authentication logic, dynamically hiding sensitive DOM nodes from unauthorized Operators.

## Notice of Liability
This application is provided "AS IS" and was developed to serve as IT incident management dashboard. While the codebase implements standard security measures, it is not actively maintained. Organizations utilizing this open-source software must conduct their own security audits before deploying it in environments handling sensitive data. The author is not liable for any direct or indirect damages, data loss, or breaches resulting from the use of this software.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
