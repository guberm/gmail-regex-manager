Add-Type -AssemblyName System.Drawing
$sizes = 16,48,128
foreach ($s in $sizes) {
  $bmp = New-Object System.Drawing.Bitmap($s,$s)
  $gfx = [System.Drawing.Graphics]::FromImage($bmp)
  $gfx.Clear([System.Drawing.Color]::FromArgb(66,133,244))
  $fontSize = [float]($s/2)
  $font = New-Object System.Drawing.Font('Arial',$fontSize,[System.Drawing.FontStyle]::Bold)
  $brush = [System.Drawing.Brushes]::White
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = 'Center'
  $sf.LineAlignment = 'Center'
  $rect = New-Object System.Drawing.RectangleF(0,0,$s,$s)
  $gfx.DrawString('.*',$font,$brush,$rect,$sf)
  $outFile = Join-Path $PSScriptRoot ("icon${s}.png")
  $bmp.Save($outFile,[System.Drawing.Imaging.ImageFormat]::Png)
  $gfx.Dispose(); $bmp.Dispose()
  Write-Host "Created $outFile"
}
