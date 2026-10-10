param([string]$Base = 'http://localhost:3001')
$ErrorActionPreference = 'Stop'
$headers = @{ Origin = $Base }
$email = 'test-' + [guid]::NewGuid().ToString('N') + '@example.test'
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
function PostJson([string]$path, [object]$body) {
  Write-Host "POST $path"
  $bytes = [System.Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json -Depth 8))
  try { Invoke-RestMethod -Method Post -Uri "$Base$path" -Headers $headers -WebSession $session -ContentType 'application/json; charset=utf-8' -Body $bytes }
  catch { Write-Output "Failed: $path"; if ($_.Exception.Response) { $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream()); Write-Output $reader.ReadToEnd() }; throw }
}
function GetData { Write-Host 'GET /api/data'; Invoke-RestMethod -Method Get -Uri "$Base/api/data" -WebSession $session }
function Assert([bool]$condition, [string]$message) { if (-not $condition) { throw $message } }

$register = PostJson '/api/auth/register' @{ name = 'تست استاکلی'; email = $email; password = 'test-password-123' }
Assert ($register.user.email -eq $email) 'Registration failed'
$product = (PostJson '/api/products' @{ name = 'کالای آزمایشی'; price = 120000; stock = 5; lowStockThreshold = 2; color = '#74C9F8' }).product
Assert ((GetData).products[0].stock -eq 5) 'Product was not stored'
$order = (PostJson '/api/orders' @{ customerName = 'مشتری آزمایشی'; customerPhone = '09123456789'; items = @(@{ productId = $product.id; qty = 2 }) }).order
Assert ((GetData).products[0].stock -eq 3) 'Order did not decrement stock'
$null = Invoke-RestMethod -Method Patch -Uri "$Base/api/orders/$($order.id)" -Headers $headers -WebSession $session -ContentType 'application/json' -Body '{"status":"paid"}'
Assert ((GetData).products[0].stock -eq 3) 'Paid status changed stock'
$null = Invoke-RestMethod -Method Patch -Uri "$Base/api/orders/$($order.id)" -Headers $headers -WebSession $session -ContentType 'application/json' -Body '{"status":"cancelled"}'
Assert ((GetData).products[0].stock -eq 5) 'Cancellation did not restore stock'
$failed = $false
try { $null = PostJson '/api/orders' @{ customerName = 'مشتری آزمایشی'; customerPhone = '09123456789'; items = @(@{ productId = $product.id; qty = 99 }) } }
catch { $failed = $true }
Assert $failed 'Insufficient stock order was accepted'
Assert ((GetData).products[0].stock -eq 5) 'Failed order changed stock'
$null = PostJson '/api/auth/logout' @{}
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$login = PostJson '/api/auth/login' @{ email = $email; password = 'test-password-123' }
Assert ($login.user.email -eq $email) 'Login failed'
Assert ((GetData).orders.Count -eq 1) 'Login did not restore account data'
$null = PostJson '/api/auth/logout' @{}
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$second = PostJson '/api/auth/register' @{ name = 'فروشندهٔ دوم'; email = ('second-' + [guid]::NewGuid().ToString('N') + '@example.test'); password = 'test-password-123' }
Assert ((GetData).products.Count -eq 0) 'Another user can see products'
Assert ((GetData).orders.Count -eq 0) 'Another user can see orders'
$import = PostJson '/api/import' @{ products = @(@{ id = 'old-product'; name = 'Old product'; price = 90000; stock = 4; lowStockThreshold = 1; color = '#9DBBE8' }); orders = @(@{ id = 'old-order'; customerName = 'Old customer'; customerPhone = '09123456789'; status = 'pending_payment'; createdAt = (Get-Date).ToUniversalTime().ToString('o'); items = @(@{ productId = 'old-product'; qty = 1; unitPrice = 90000 }) }) }
Assert ($import.products -eq 1 -and $import.orders -eq 1) 'Legacy import failed'
Assert ((GetData).products[0].stock -eq 4) 'Legacy import changed stock'
Write-Output 'PASS: register, login, product, order, stock, cancellation, insufficient stock, user isolation, legacy import'
