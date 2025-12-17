import { PlusIcon } from '@heroicons/react/24/outline';
import { FINANCIALS_LIST } from '@/lib/api/listData/financials';
import {
  normalizeDateForInput,
  formatEnumText,
  formatPesosRealtime,
  pesosToNumber,
} from '@/lib/api/utils/utils';

export default function Payments({
  addPayment,
  errors,
  payments,
  setPayments,
}) {
  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Datos de pagos</h2>
        <p
          onClick={addPayment}
          className="
            flex items-center gap-2
            text-orange-700 hover:bg-orange-700 hover:text-white border
            border-orange-700  
            font-medium
            px-4 py-2
            rounded-xl
            shadow-md hover:shadow-lg
            transition-all duration-300
            active:scale-95 cursor-pointer
          "
        >
          <PlusIcon className="w-5 h-5" />
          Agregar pago
        </p>
      </div>

      {payments.map((p, i) => (
        <div
          key={i}
          className="border border-gray-200 p-4 rounded mb-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <select
            value={p.financialEntity}
            onChange={(e) => {
              const copy = [...payments];
              copy[i].financialEntity = e.target.value;
              setPayments(copy);
            }}
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
              errors[`payment-${i}-financialEntity`]
                ? 'border-red-500'
                : 'border-gray-200'
            }`}
          >
            <option value="">Financiera</option>
            {FINANCIALS_LIST.map((f) => (
              <option key={f} value={f}>
                {formatEnumText(f, 'uppercase')}
              </option>
            ))}
          </select>

          <input
            placeholder="Total pago"
            value={formatPesosRealtime(p.totalPayment)}
            onChange={(e) => {
              const copy = [...payments];
              copy[i].totalPayment = pesosToNumber(e.target.value);
              setPayments(copy);
            }}
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
              errors[`payment-${i}-totalPayment`]
                ? 'border-red-500'
                : 'border-gray-200'
            }`}
          />

          <input
            placeholder="Aval"
            value={formatPesosRealtime(p.aval)}
            onChange={(e) => {
              const copy = [...payments];
              copy[i].aval = pesosToNumber(e.target.value);
              setPayments(copy);
            }}
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
              errors[`payment-${i}-aval`] ? 'border-red-500' : 'border-gray-200'
            }`}
          />

          <input
            type="date"
            value={normalizeDateForInput(p.approvalDate)}
            onChange={(e) => {
              const copy = [...payments];
              copy[i].approvalDate = e.target.value;
              setPayments(copy);
            }}
            className={`w-full border rounded-xl px-4 py-2 text-sm shadow-sm ${
              errors[`payment-${i}-approvalDate`]
                ? 'border-red-500'
                : 'border-gray-200'
            }`}
          />
        </div>
      ))}
    </section>
  );
}
