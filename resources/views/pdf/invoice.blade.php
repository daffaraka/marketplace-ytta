<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Struk Pesanan #{{ $order->id }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; padding: 30px; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #333; padding-bottom: 15px; }
        .header h1 { font-size: 22px; font-weight: 800; letter-spacing: 1px; }
        .header p { font-size: 11px; color: #666; margin-top: 4px; }
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .info-box { width: 48%; }
        .info-box h3 { font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 5px; }
        .info-box p { font-size: 12px; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f5f5f5; padding: 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #ddd; }
        td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
        .text-right { text-align: right; }
        .total-row { font-weight: bold; font-size: 14px; background: #f8f8f8; }
        .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px dashed #ccc; font-size: 10px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <h1>YTTA MARKETPLACE</h1>
        <p>Struk Pesanan Digital</p>
    </div>

    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
            <p style="font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 5px;">Info Pesanan</p>
            <p><strong>No. Pesanan:</strong> #{{ $order->id }}</p>
            <p><strong>Tanggal:</strong> {{ $order->created_at->format('d M Y, H:i') }}</p>
            <p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>
        </div>
        <div>
            <p style="font-size: 10px; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 5px;">Info Pelanggan</p>
            <p><strong>Nama:</strong> {{ $order->customer->name ?? '-' }}</p>
            <p><strong>Telegram:</strong> {{ $order->customer->telegram_chat_id ?? '-' }}</p>
            <p><strong>Telepon:</strong> {{ $order->customer->phone ?? '-' }}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Menu</th>
                <th class="text-right">Harga</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->product->name ?? 'Produk Dihapus' }}</td>
                <td class="text-right">Rp {{ number_format($item->product->price ?? 0, 0, ',', '.') }}</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="4" class="text-right">TOTAL</td>
                <td class="text-right">Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <p>Terima kasih telah berbelanja di YTTA Marketplace!</p>
        <p>Struk ini digenerate secara otomatis pada {{ now()->format('d M Y, H:i:s') }}</p>
    </div>
</body>
</html>
