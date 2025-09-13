# Personal Portfolio (ASP.NET Web Forms)

An ASP.NET Web Forms portfolio site with an admin panel, SQL Server-backed content for projects and certifications, live updates, and a clean public UI. The public contact form sends via the user's email client by default (no server SMTP required).

## Features
- Public site (index.aspx)
  - Sections: Hero, About, Education, Projects (dynamic), Certifications (dynamic), Contact
  - Smooth scrolling, animations, image modal, back-to-top, PWA manifest
  - Social links configured (GitHub, LinkedIn, Instagram, Facebook, X, Email)
  - Contact form opens the user’s email app (mailto)
- Admin portal (admin.aspx)
  - Session-based login (default dev credentials; change for production)
  - CRUD via WebMethods for Skills, Projects, Certifications
  - Light/Dark theme toggle
- Live page updates
  - BroadcastChannel/localStorage signaling (scripts/sync.js) so public page refreshes on admin changes
- SQL Server storage
  - Projects and Certifications are data-driven (Repeaters in index.aspx)

## Tech Stack
- ASP.NET Web Forms (Target Framework: .NET Framework 4.7.2)
- SQL Server (Express or full edition)
- HTML/CSS/JS (Font Awesome, local scripts/styles)
- IIS Express (dev) / IIS (prod)

## Repository Layout
```
web_practice/
├─ Personal_portfolio/
│  └─ Personal_portfolio/
│     ├─ index.aspx / index.aspx.cs / index.aspx.designer.cs  # Public site
│     ├─ admin.aspx / admin.aspx.cs                            # Admin portal
│     ├─ style1.css / admin.css                                # Styles
│     ├─ first1.js / admin.js                                  # Client JS
│     ├─ scripts/sync.js                                       # Live refresh
│     ├─ Web.config                                            # Site config
│     ├─ img/                                                  # Assets
│     └─ Personal_portfolio.sln                                # Solution
├─ index.html (static snapshot)
├─ sw.js / manifest.json (PWA)
└─ Web.config (root; may be unused depending on hosting)
```

## Prerequisites
- Windows + Visual Studio 2019/2022 (with .NET Framework 4.7.2 dev tools)
- SQL Server Express or SQL Server local/remote instance

## Getting Started (Local Dev)
1. Open `Personal_portfolio/Personal_portfolio/Personal_portfolio.sln` in Visual Studio.
2. Set `Personal_portfolio` (the Web Forms project) as the startup project.
3. Update `Web.config` connection strings as needed:
   - `PortfolioConnectionString` should point to your SQL Server instance and database.
4. Create the database/tables if not present:
   - Database: `PortfolioWebsite` (or your choice, update Web.config accordingly)
   - Tables expected by code:
     - `Projects` (ProjectID, ProjectTitle, ProjectDescription, ProjectImage, GitHubLink, IsActive, IsFeatured, DisplayOrder, CreatedDate)
     - `CertificationsAchievements` (CertID, CertTitle, CertDescription, CertImage, IssuingOrganization, IssueDate, CertType, IsActive, IsFeatured, DisplayOrder)
     - `TechnicalSkills` (currently not bound on homepage; used in admin)
   - The contact form no longer writes to DB; it opens the user’s mail client.
5. Press F5 to run with IIS Express.

## Admin Portal
- URL: `/admin.aspx`
- Default dev credentials (from Web.config > appSettings):
  - Username: `admin`
  - Password: `engineer`
- Change these values for production.

## Contact Form Behavior
- By default, the contact form does NOT post to the server. It opens the user's email client (mailto) with prefilled content. This avoids SMTP setup and browser warnings on non-HTTPS.
- Optional: server-side email sending
  - Supply SMTP settings in `Web.config` (appSettings):
    - `SmtpHost`, `SmtpPort`, `SmtpUser`, `SmtpPass`, `SmtpEnableSsl`, `SmtpFrom`, `ContactToEmail`
  - Then update the form/JS to post to `index.aspx/SendContactMessage` (already implemented) instead of using mailto.

## Configuration
Key `Web.config` entries (project-level `Personal_portfolio/Personal_portfolio/Web.config`):
- Connection strings:
  - `PortfolioConnectionString` → SQL Server DB used by the site
- App settings:
  - `AdminUsername`, `AdminPassword`, `SecretKey`
  - `EnableDebugMode` (true in dev)
  - SMTP (optional; for server-side email): `ContactToEmail`, `SmtpHost`, `SmtpPort`, `SmtpUser`, `SmtpPass`, `SmtpEnableSsl`, `SmtpFrom`
- Static content + default document configured for IIS

## Building & Running
- Visual Studio: Build Solution, then Run (IIS Express).
- IIS deployment:
  - Ensure .NET Framework 4.7.2 is available
  - Configure an App Pool (Integrated, .NET v4), point site/application to the project folder
  - Confirm `index.aspx` is in Default Documents list
  - Grant write access to `App_Data` if you use file-based logs

## PWA
- `manifest.json` and `sw.js` are included. Customize as needed. Service worker scopes and caching strategy are left minimal.

## Troubleshooting
- 500.19 / Handler/Module issues
  - This Web.config avoids most legacy modules; keep `validation validateIntegratedModeConfiguration="false"` during dev.
- Blank/dynamic sections
  - Ensure `Projects` and `CertificationsAchievements` have data and `IsActive=1`.
- SMTP error shown
  - If you enable the AJAX form path, configure SMTP as above; otherwise keep the default mailto flow.
- SQL errors
  - Verify connection string, DB reachable, and table/column names match the expected schema.

## Security Notes
- Do not keep default admin credentials in production.
- If enabling SMTP, use an app password and a verified From address (DMARC).
- Consider HTTPS for production to avoid mixed-content and security warnings.

## License
No license specified. Add your preferred license if publishing publicly.