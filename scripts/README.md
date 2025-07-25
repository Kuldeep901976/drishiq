# DrishiQ Custom Scripts

## auto-port-manager.js
- Automatically finds an available port for the dev server
- Kills conflicting Node processes
- Starts the dev server on the first available port

## smart-dependency-manager.js
- Checks, updates, and optimizes dependencies
- Only updates or adds if needed
- Removes problematic dependencies
- Checks for security issues and conflicts

## dependency-cleanup.js
- Full dependency cleanup (removes node_modules, cleans cache, reinstalls)
- Creates backup before changes

## clean-cache.js
- Cleans Next.js and webpack cache

## peer-dep-checker.js
- Checks for peer dependency conflicts and prints a clear report

---

**Usage:**
- Run any script with `node scripts/<scriptname>.js` or via npm scripts in `package.json`. 