# Google sign-in: one-time setup

**Status: on since 2026-11-03.** Sheet "Algebra Notebook Progress" (abergmann@sch.org's Drive), Apps Script project "Algebra Notebook Server" (standalone, opens the Sheet by SHEET_ID; deployment "Sign-in and progress", Execute as Me, Anyone), Google Cloud project "AlgebraNotebook" (consent screen Internal, web client "Algebra Notebook website", origin https://aaronbbergmann.github.io). To change the server: edit the script, save, Deploy > Manage deployments > Edit > New version > Deploy (the /exec address stays the same).

Sign-in stays off (the site works exactly as before) when either value in `auth.js` is empty.

## 1. Progress Sheet and server
1. In Google Drive (signed in as abergmann@sch.org) create a new Google Sheet named **Algebra Notebook Progress**.
2. Extensions > Apps Script. Replace everything in `Code.gs` with the contents of `server/Code.gs` from this repo.
3. Choose the function **setup** in the toolbar and click **Run**. Approve the permissions it asks for (the Sheet, and contacting Google to check sign-ins).
4. Deploy > New deployment > type **Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy, then copy the **Web app URL** (ends in `/exec`).

## 2. Google sign-in client
1. Go to console.cloud.google.com, create a project (e.g. "Algebra Notebook").
2. APIs & Services > OAuth consent screen: User type **Internal** (only sch.org accounts), app name "Algebra Notebook", your email as support contact.
3. APIs & Services > Credentials > Create credentials > OAuth client ID > **Web application**.
   Authorized JavaScript origins: `https://aaronbbergmann.github.io` (no redirect URIs needed). Create, then copy the **Client ID**.

## 3. Switch it on
- `server/Code.gs` (in the Apps Script editor): set `CLIENT_ID` to the Client ID, save, then Deploy > Manage deployments > edit > Version: New version > Deploy (the URL stays the same).
- `auth.js`: set `CLIENT_ID` and `API_URL` (the /exec URL), commit, push.

## How it works
- Every page except the Playgrounds (Play Solve, Play Graph, Play Data) shows a sign-in screen until the student signs in with an @sch.org account. The server checks every sign-in with Google and rejects other domains.
- A sign-in lasts 90 days on that device. Progress is merged in from the account once per browser session and saved a couple of seconds after every change, so it follows the student to any device. Signing out clears that browser's progress (shared computers).
- Progress already earned on a device before sign-in is kept and added to the first account that signs in there.
- The Sheet's **Students** tab shows one column per activity (average of its exercises; each cell's note lists the exercises). The teacher page `teacher/` (link "Class progress" bottom-left, teachers only) shows the same with sorting, search, details per student and a CSV download. Teachers are listed in `TEACHERS` in `Code.gs`.
- New pages copied from the main index.html keep working: the script tag finds auth.js from any folder. A click guard in the app (Demo mode) exempts `#anGate` and `#anChip`.
