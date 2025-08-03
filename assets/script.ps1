# Get current working folder
$folder = Get-Location
$thumbsPath = Join-Path $folder "thumbs"

# Create "thumbs" folder if not exists
if (!(Test-Path $thumbsPath)) {
    New-Item -ItemType Directory -Path $thumbsPath | Out-Null
}

# Path to CSV file
$csvPath = Join-Path $folder "index.csv"
Remove-Item $csvPath -ErrorAction SilentlyContinue
New-Item -ItemType File -Path $csvPath -Force | Out-Null


# List of supported image extensions
$allowedExtensions = @(".jpg", ".jpeg", ".png", ".bmp", ".gif", ".tiff")

# Get image files (not in subfolders for now)
$images = Get-ChildItem -File | Where-Object { $allowedExtensions -contains $_.Extension.ToLower() }

foreach ($img in $images) {
    $thumbName = [System.IO.Path]::GetFileNameWithoutExtension($img.Name) + ".jpg"
    $thumbRelPath = "thumbs\$thumbName"
    $thumbFullPath = Join-Path $folder $thumbRelPath

    # Run ffmpeg: crop square, resize to 256x256, better quality, avoid warnings
    ffmpeg -y -i "$($img.FullName)" -vf "crop='min(in_w\,in_h)':'min(in_w\,in_h)',scale=256:256" -q:v 2 -pix_fmt yuvj420p "$thumbFullPath"

    # Append to CSV file
    $line = '"' + $thumbRelPath + '","' + $img.Name + '"'
    $line | Out-File -Append $csvPath
}
