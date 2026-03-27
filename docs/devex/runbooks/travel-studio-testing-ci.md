# Travel Studio Testing and CI Runbook

## Local Command Matrix

- Root checks:
  - `yarn test`
  - `yarn lint`
  - `yarn format:check`
  - `yarn build`
- Travel-studio focused:
  - `yarn workspace travel-studio test`
  - `yarn workspace travel-studio build`
- Smoke:
  - start demo (`:3000`) and travel-studio (`:3001`)
  - run `yarn smoke`

## CI Coverage

Primary CI workflow (`.github/workflows/ci.yml`) runs:

- tests
- lint
- format check
- build

## Notable Scope Details

- Smoke/e2e is not currently part of the default CI workflow.
- Travel-studio is an application workspace (not part of published package set).
- Package publishing/versioning concerns are separate from travel document envelope `version`.

## Fast Triage Sequence

1. Reproduce with `yarn workspace travel-studio test`.
2. Reproduce type/runtime compile failures with `yarn workspace travel-studio build`.
3. If API regressions are suspected, run route contract tests and inspect `x-request-id` + logs.
4. If editor flow regressions are suspected, run `yarn smoke` with both servers up.
