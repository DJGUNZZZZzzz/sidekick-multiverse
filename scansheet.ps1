Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("C:\Users\djgoo\OneDrive\Desktop\AI PROJECTS FOLDER\sidekick-multiverse\mage.png")

function GetBounds($startX, $startY, $w, $h) {
    $minY = 9999; $maxY = 0
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $p = $img.GetPixel($startX + $x, $startY + $y)
            if ($p.A -gt 20 -and ($p.R -gt 20 -or $p.G -gt 20 -or $p.B -gt 20)) {
                if (($startY + $y) -lt $minY) { $minY = $startY + $y }
                if (($startY + $y) -gt $maxY) { $maxY = $startY + $y }
            }
        }
    }
    return @($minY, $maxY)
}

Write-Host "--- USER SPECIFIC MEASUREMENTS ---"

# Row 1 (Idle) - Column 1
$idle = GetBounds 0 0 80 120
Write-Host "Idle Row 1/Frame 1: Top=$($idle[0]), Bottom=$($idle[1])"

# Row 4 (Jump) - Column 1 (Feet anchor) - Assuming Row 4 is around Y=320
$jumpStart = GetBounds 0 320 80 160
Write-Host "Jump Row 4/Frame 1: Top=$($jumpStart[0]), Bottom=$($jumpStart[1])"

# Row 4 (Jump) - Column 5 (Head Peak)
$jumpPeak = GetBounds 320 320 80 160
Write-Host "Jump Row 4/Frame 5: Top=$($jumpPeak[0]), Bottom=$($jumpPeak[1])"

$masterHeight = $jumpStart[1] - $jumpPeak[0]
Write-Host "Calculated Master Height: $masterHeight"

$img.Dispose()
