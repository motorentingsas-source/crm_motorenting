import {
  normalizeDateForInput,
  formatPesosRealtime,
  pesosToNumber,
} from '@/lib/api/utils/utils';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function CashReceipts({
  addReceipt,
  errors,
  receipts,
  setReceipts,
}) {
  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Recibos de caja</h2>
        <p
          onClick={addReceipt}
          className="
            flex items-center gap-2
            text-blue-700 hover:bg-blue-700 hover:text-white border
            border-blue-700  
            font-medium
            px-4 py-2
            rounded-xl
            shadow-md hover:shadow-lg
            transition-all duration-300
            active:scale-95 cursor-pointer
          "
        >
          <PlusIcon className="w-5 h-5" />
          Agregar recibo
        </p>
      </div>

      {receipts.map((r, i) => (
        <div
          key={i}
          className="border border-gray-200 p-4 rounded mb-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            value={r.receiptNumber}
            placeholder="Número de recibo"
            onChange={(e) => {
              const copy = [...receipts];
              copy[i].receiptNumber = e.target.value;
              setReceipts(copy);
            }}
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
              errors[`receipt-${i}-receiptNumber`]
                ? 'border-red-500'
                : 'border-gray-200'
            }`}
          />

          <input
            value={normalizeDateForInput(r.date)}
            type="date"
            onChange={(e) => {
              const copy = [...receipts];
              copy[i].date = e.target.value;
              setReceipts(copy);
            }}
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
              errors[`receipt-${i}-date`] ? 'border-red-500' : 'border-gray-200'
            }`}
          />

          <input
            placeholder="Valor"
            value={formatPesosRealtime(r.amount)}
            onChange={(e) => {
              const copy = [...receipts];
              copy[i].amount = pesosToNumber(e.target.value);
              setReceipts(copy);
            }}
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
              errors[`receipt-${i}-amount`]
                ? 'border-red-500'
                : 'border-gray-200'
            }`}
          />
        </div>
      ))}
    </section>
  );
}
