# Dependency Policy for DrishiQ

## 1. Allowed Versions
- **React**: Always use `^18.x`
- **Next.js**: Always use the latest stable `14.x` (pinned in package.json)
- **TypeScript**: Use `^5.x`
- **Other core packages**: Pin to the latest compatible version

## 2. Peer Dependency Conflicts
- Always resolve peer dependency warnings before merging PRs or deploying
- If a package requires a peer version that conflicts with another, prefer the version required by the main framework (e.g., Next.js or React)
- If no compatible version exists, open an issue and document the conflict in this file

## 3. Upgrade Approval
- Minor/patch upgrades: Allowed by any contributor
- Major upgrades: Require review and approval by project lead
- All upgrades must pass CI and manual smoke test

## 4. Review Schedule
- Dependencies must be reviewed at least quarterly
- Remove unused or deprecated packages during review

## 5. Lockfile
- Always commit `package-lock.json` after changes
- Run a clean install after major changes

---

**Last updated:** {{DATE}} 