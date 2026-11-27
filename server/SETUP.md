# Google sign-in: one-time setup

**Status: on since 2026-11-03.** Sheet "Algebra Notebook Progress" (abergmann@sch.org's Drive), Apps Script project "Algebra Notebook Server" (standalone, opens the Sheet by SHEET_ID; deployment "Sign-in and progress", Execute as Me, Anyone), Google Cloud project "AlgebraNotebook" (consent screen Internal, web client "Algebra Notebook website", origin https://aaronbbergmann.github.io). To change the server: edit the script, save, Deploy > Manage deployments > Edit > New version > Deploy (the /exec address stays the same).

**The deployment the website uses** is the one whose Deployment ID starts with **AKfycbzgC-1EJrwb2k** (the address in `auth.js`); in Manage deployments it is listed as "Untitled". When you publish a change, select that one, click the pencil, choose New version, Deploy. The project also has other active deployments ("Assignments and Attempts", and an "Untitled" starting AKfycbx7) that nothing uses; they can be archived.

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

## 4. Google Classroom sync (the Sync button on Class progress)
The Apps Script runs as abergmann@sch.org, so it sees that account's Classroom classes.
1. Open the Apps Script project **Algebra Notebook Server**. Replace `Code.gs` with `server/Code.gs` from this repo.
2. Services (+, left side) > **Google Classroom API** > Add (identifier `Classroom`).
3. Project Settings (gear) > check **Show "appsscript.json" manifest file in editor**. Back in the Editor, open `appsscript.json` and replace it with `server/appsscript.json` from this repo (keep your own `timeZone` line if it differs). This adds the **classroom.profile.emails** permission: without it Classroom leaves out students' email addresses, and the sync stops with a message instead of changing the list.
4. Choose **setup** in the toolbar > **Run**, and approve the new permissions (Classroom classes, rosters, and students' email addresses).
5. Deploy > Manage deployments > edit (pencil) > Version: **New version** > Deploy. The /exec address stays the same, so `auth.js` doesn't change.
6. On the Class progress page, click **Sync**, choose the classes, then **Sync**.

If the classes list says it can't reach Google Classroom, step 2 or 4 is missing. If the sch.org Google Workspace admin has turned off Classroom API access for third-party apps, the admin needs to allow it (Admin console > Apps > Google Workspace > Classroom > Data access).

## 5. Assignments and Attempts (Question Bank migration, step 5)
`/a/?id=…` plays an assignment, and every finished problem of an assignment or of practice (`/q/?id=…`) is logged. Until the server is updated, the rows wait on each student's device (nothing is lost), and preset assignments (`/a/?id=P-2.4A`, `P-RevT1`, …) work without it.
1. Open the Apps Script project **Algebra Notebook Server**. Replace `Code.gs` with `server/Code.gs` from this repo, and save.
2. Deploy > Manage deployments > edit (pencil) > Version: **New version** > Deploy. The /exec address stays the same.
3. Nothing else: the **Assignments** and **Attempts** tabs are made in the Progress Sheet the first time they are used. Attempts gets one row per finished problem (time, student, class, assignment, question, version, seed, mode, tier, correct, tries). Assignments is filled by the builder (step 6); a row typed by hand (Id, Title, Abbreviation, Owner, Classes, Due as JSON, Items as JSON like `[{"q":"2.4A-vertex-point"}]`) opens at `/a/?id=<Id>`.
