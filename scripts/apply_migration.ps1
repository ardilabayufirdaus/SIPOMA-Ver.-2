<#
Apply packing tables migration using DATABASE_URL (PowerShell)

Usage examples:
# Option A: set env var then run
$env:DATABASE_URL = "postgres://user:password@db.host:5432/dbname"
.\scripts\apply_migration.ps1

# Option B: paste connection string when prompted
.\scripts\apply_migration.ps1

Notes:
- Requires psql in PATH (Postgres client). If you use the Supabase SQL Editor, prefer copying the SQL there instead.
- The script uses the migration file at ../migrations/2025-08-26_create_packing_tables.sql relative to this script.
#>

param(
    [string]$DatabaseUrl = $env:DATABASE_URL,
    [string]$MigrationFile = (Join-Path $PSScriptRoot '..\migrations\2025-08-26_create_packing_tables.sql')
)

if (-not $DatabaseUrl) {
    $DatabaseUrl = Read-Host "DATABASE_URL not found. Paste the DATABASE_URL (postgres://...)"
}

if (-not (Test-Path $MigrationFile)) {
    Write-Error "Migration file not found: $MigrationFile"
    exit 1
}

Write-Host "Using DATABASE_URL:" -NoNewline
# avoid printing full secret; show prefix
if ($DatabaseUrl.Length -gt 60) { Write-Host " $($DatabaseUrl.Substring(0,60))..." } else { Write-Host " $DatabaseUrl" }
Write-Host "Applying migration file: $MigrationFile"

try {
    # psql should be installed and in PATH. psql accepts a connection string as first argument.
    & psql "$DatabaseUrl" -f "$MigrationFile"
    if ($LASTEXITCODE -ne 0) {
        Write-Error "psql returned exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
    Write-Host "Migration applied successfully."
} catch {
    Write-Error "Failed to run psql. Ensure psql is installed and in PATH. Error: $_"
    exit 2
}
