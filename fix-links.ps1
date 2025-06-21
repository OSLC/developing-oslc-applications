# Function to fix markdown links in a file
function Fix-MarkdownLinks {
    param (
        [string]$filePath
    )
    
    Write-Host "Processing $filePath"
    $content = Get-Content $filePath -Raw
    
    # Match Markdown links that don't already have .md extension
    $pattern = '\[([^\]]+)\]\(([^)\"]+)(?<!\.md)(?<!\.html)(?<!\.pdf)(?<!/)(?!http)(?!www)(?!#)\)'
    
    $newContent = $content -replace $pattern, {
        $linkText = $_.Groups[1].Value
        $linkPath = $_.Groups[2].Value
        
        # Skip links with fragments or queries
        if ($linkPath -match '#' -or $linkPath -match '\?') {
            return "[$linkText]($linkPath)"
        }
        
        # Skip absolute URLs
        if ($linkPath -match '^(http|https|ftp|mailto):') {
            return "[$linkText]($linkPath)"
        }
        
        # Handle relative paths
        $basePath = Split-Path $filePath -Parent
        $targetPath = Join-Path $basePath $linkPath
        
        # Check if target with .md exists
        $targetPathWithMd = "$targetPath.md"
        if (Test-Path $targetPathWithMd) {
            return "[$linkText]($linkPath.md)"
        } else {
            # No change if target doesn't exist
            return "[$linkText]($linkPath)"
        }
    }
    
    # Only write the file if changes were made
    if ($newContent -ne $content) {
        Set-Content $filePath $newContent
        Write-Host "Updated links in $filePath"
        return $true
    } else {
        Write-Host "No changes needed in $filePath"
        return $false
    }
}

# Get all Markdown files in docs-new directory and subdirectories
$mdFiles = Get-ChildItem -Path ".\docs-new" -Filter *.md -Recurse

# Track changes
$changedFiles = @()

# Process each file
foreach ($file in $mdFiles) {
    $changed = Fix-MarkdownLinks -filePath $file.FullName
    if ($changed) {
        $changedFiles += $file.FullName
    }
}

Write-Host "Done processing files"
if ($changedFiles.Count -gt 0) {
    Write-Host "Changed files:"
    $changedFiles | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "No files were changed"
}
