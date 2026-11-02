# lumen-lens-frontend

Next.js 14 dashboard for Lumen Lens.

## Pages

| Route | Description |
|---|---|
| `/` | Upload WASM + pick language → generate SDK |
| `/diff` | Compare two WASM versions, view breaking changes |
| `/inspect` | Explore the parsed spec of any Soroban contract |

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to an HTTP API implementing `POST /generate`,
`POST /diff`, and `POST /inspect` with the request/response shapes in
[`src/types/api.ts`](src/types/api.ts). The Rust backend repository currently
provides a CLI; running that CLI alone does not start an HTTP server. These
frontend changes do not add an HTTP adapter. Uploads are sent to the configured
API when you choose Generate, Compare, or Inspect.

## Stack

- Next.js 14 App Router
- Tailwind CSS
- TanStack Query
- Radix UI primitives
- `react-syntax-highlighter` for code display

## Contract upload and results

- All three workflows validate `.wasm` filenames, the WebAssembly version 1
  header, and a 10 MiB size limit before encoding or submitting a file. This
  detects invalid uploads; the API must still parse and validate the Soroban
  contract specification and enforce its own limits.
- Inputs are locked during requests. Changing a contract or generation option
  clears the previous result so an SDK cannot be relabeled as another language.
- Download an entire SDK as one `.tar` archive, preserving nested paths and UTF-8
  source. Extract it with `tar -xf <contract>-<language>-sdk.tar`. Archive creation
  rejects unsafe paths and duplicate entries.
- Recent Generations records the latest 20 successful requests on this browser,
  including contract name, uploaded filename, language, file count, and time.
  Contract binaries and generated source are not saved in history. Use **Clear
  history** to delete these records. History updates across tabs; blocked browser
  storage does not prevent generation or download.
- API requests time out after 60 seconds. Failed requests do not enter history.

## Validation

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The regression suite uses Node's test runner and the TypeScript compiler already
in this project; no test framework dependency is required. Archive interoperability
checks use the system `tar` command (available on the Ubuntu CI runner). Tests
cover valid/invalid WASM headers, size rejection before reading, UTF-8 and nested
archive files, unsafe archive paths, bounded history, corrupt records, and storage
failures. CI runs the suite before type checking, linting, and building.

For a manual check with a compatible API:

1. Upload a valid Soroban WASM, select a language, and generate an SDK.
2. Download and extract the archive; compare its files with the source preview.
3. Reload the page and check history, then clear it. Generate a second SDK in
   another tab and verify both histories update.
4. Change the selected language or WASM after generation; the old result clears.
5. Try a renamed text file, an empty file, and a file larger than 10 MiB; each
   should show a validation error without sending a request.
6. Compare two versions and inspect a contract, then replace the input files;
   results should clear. Check that request failures show an error and permit retry.
