# issue-assist: Lightweight IT Operations & Incident Management Dashboard

> **[🌐 View Live Deployment](https://issue-assist.sejabur.dev)**

## Executive Summary
issue-assist is an enterprise-inspired IT operations platform designed for small and mid-sized organizations that require rapid incident coordination without the complexity of traditional ITSM suites. The platform emphasizes operational visibility, lightweight deployment, and high-velocity incident response through a serverless architecture and role-based collaboration model.

## The Problem & Why This Product?
**The Problem:** Enterprise ITSM platforms such as ServiceNow are designed for large organizations and often require substantial configuration, administrative overhead, and licensing costs that may exceed the needs of smaller IT teams. When urgent incidents occur, rapid-response network operations centers (NOCs) frequently revert to static spreadsheets because legacy tools are too slow. This reliance on spreadsheets leads to missed deadlines, communication silos, and dangerous data collisions.

**Why This Product?:** Modern IT operations increasingly rely on expensive enterprise platforms optimized for large organizations. Smaller teams often require the same operational visibility but cannot justify the deployment complexity or licensing costs. issue-assist explores how lightweight system design and serverless infrastructure can deliver core ITSM capabilities without enterprise overhead.

## Target Audience
This platform is specifically designed for:
- Small to mid-sized IT teams requiring immediate incident visibility.
- Rapid-response Network Operations Centers (NOCs) managing critical service outages.
- Technical Program Managers (TPMs) looking for a streamlined tool to coordinate triage efforts.

## Product Scope
### In Scope
- Incident tracking
- Operator coordination
- Audit visibility
- Bulk issue management

### Out of Scope
- Enterprise CMDB
- Asset Management
- ITIL workflow automation
- Change Management

## Product & Architectural Decisions
- **Zero-Infrastructure Deployment:** *Decision:* Package the application as a static, dependency-light frontend. *Rationale:* Eliminates deployment friction for small teams without dedicated DevOps engineers.
- **Serverless Edge Data Layer:** *Decision:* Utilize a Cloudflare Worker proxying to a NoSQL JSON document store rather than building a traditional SQL backend. *Rationale:* Drastically reduces infrastructure costs and maintenance while guaranteeing real-time global availability.
- **Optimistic State History Engine:** *Decision:* Implement an in-memory history stack for bulk actions. *Rationale:* In high-stress triage environments, operators will inevitably make mistakes. An instant "Undo" button is far more valuable than a confirmation modal that slows down workflows.

## Design Objectives
- Minimize deployment complexity through a serverless architecture.
- Reduce operator friction during incident triage.
- Provide immediate visual awareness of critical incidents.
- Support safe bulk operations through optimistic rollback mechanisms.

## Key Features
- **High-Velocity Issue Triage:** A lightning-fast interface for routing and updating IT incidents without the page-reload latency of traditional ticketing systems.
- **Urgent Incident Pings:** A permanently visible sidebar dedicated to critical alerts, ensuring severe outages are never buried in a standard queue.
- **Bulk Operations & Atomic Rollbacks:** Select multiple incidents to bulk-update statuses or delete records. A custom state-history engine allows immediate undo/redo of mass mutations.
- **Role-Based Task Routing (RBAC):** Strict separation of privileges isolating Administrative configuration panels from standard Operator triage views to prevent unauthorized system changes.
- **Session Audit Trails:** Comprehensive logging of all operational modifications, providing clear accountability during rapid incident response.
- **Dark & Light Mode:** Seamless, persistent theme toggling utilizing localStorage and Tailwind CSS dark mode variants.

## System Architecture
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

**Architecture Principles**
- Stateless edge layer
- Optimistic client synchronization
- Infrastructure simplicity
- Secure credential isolation
- Minimal operational overhead

* **Optimistic State Engine (Frontend):** An advanced Vanilla JavaScript client-side state machine processes mutations locally for zero-latency UI updates while reconciling with the global state in the background.
* **Serverless Edge API:** Real-time data synchronization is powered by a custom Cloudflare Worker acting as a secure proxy to a JSONBin.io NoSQL datastore, completely bypassing CORS restrictions.

## Technical Stack
**Frontend**
- Vanilla JavaScript (ES6+)
- HTML5
- TailwindCSS (Utility-first framework via CDN)

**Infrastructure**
- Cloudflare Workers (CORS & Proxy handling)
- JSONBin.io (NoSQL Document Store)

**Deployment**
- Cloudflare Pages (or GitHub Pages / Vercel)

## Future Roadmap
- Implementation of a real-time WebSocket connection for instant delta-pushes instead of interval polling.
- Integration with third-party alerting systems (e.g., Slack, PagerDuty webhooks).
- Expanded RBAC configurations allowing for custom user roles and permissions.
- AI-assisted incident prioritization using historical issue patterns.

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

## Design Philosophy
* **Tactile Over Theoretical:** The UI was designed to feel like a rapid-response control center rather than a bureaucratic form. Every interaction is optimized to reduce click fatigue.
* **Graceful Degradation:** The application is built to handle network latency gracefully. By utilizing an optimistic state engine, the UI never blocks the user while waiting for the serverless proxy to respond.
* **Security by Isolation:** By strictly decoupling the frontend presentation layer from the persistent datastore using a serverless edge firewall, we achieved a secure architecture without needing a heavyweight monolithic backend.

## Notice of Liability
This application is provided "AS IS" and was developed to serve as a high-performance prototype and portfolio showcase. While the codebase implements standard security measures, it is not actively maintained. Organizations utilizing this open-source software must conduct their own security audits before deploying it in environments handling sensitive data. The author is not liable for any direct or indirect damages, data loss, or breaches resulting from the use of this software.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
