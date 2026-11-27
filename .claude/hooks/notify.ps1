# Windows notification + sound for Claude Code hooks.
param(
  [string]$Title = "Claude Code",
  [string]$Message = "Claude needs your attention"
)
# Drain hook JSON from stdin so the pipe closes cleanly
try { [Console]::In.ReadToEnd() | Out-Null } catch {}
try {
  Add-Type -AssemblyName System.Windows.Forms
  Add-Type -AssemblyName System.Drawing
  [System.Media.SystemSounds]::Asterisk.Play()
  $n = New-Object System.Windows.Forms.NotifyIcon
  $n.Icon = [System.Drawing.SystemIcons]::Information
  $n.BalloonTipTitle = $Title
  $n.BalloonTipText = $Message
  $n.Visible = $true
  $n.ShowBalloonTip(4000)
  Start-Sleep -Seconds 4
  $n.Dispose()
} catch {}
exit 0
