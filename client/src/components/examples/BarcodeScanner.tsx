import BarcodeScanner from '../BarcodeScanner';

export default function BarcodeScannerExample() {
  return (
    <div className="p-4">
      <BarcodeScanner
        onScan={(barcode) => console.log('Scanned:', barcode)}
        onCancel={() => console.log('Cancelled')}
        title="Scan Scanner Barcode"
        description="Point camera at scanner barcode"
      />
    </div>
  );
}
