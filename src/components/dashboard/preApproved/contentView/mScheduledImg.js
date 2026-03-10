'use client';

import { useMemo, useState } from 'react';
import {
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import useMotoForDelivery from '@/lib/api/hooks/useMotoForDelivery';
import AlertModal from '../../modals/alertModal';

export default function MScheduledImg({ data, onSuccess, onClose }) {
  const { createEvidenceMotorcyclesScheduled, updateDeliveryStatus } =
    useMotoForDelivery();

  const [images, setImages] = useState([null, null]);
  const [files, setFiles] = useState([null, null]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '', url: '' });
  const [errors, setErrors] = useState({
    image1: '',
    image2: '',
    date: '',
  });
  const [plateInput, setPlateInput] = useState('');
  const [plateValid, setPlateValid] = useState(false);

  const latestSchedule = useMemo(() => {
    if (!data?.deliverySchedules?.length) return null;
    return data.deliverySchedules[0];
  }, [data]);

  const realPlate = data?.registration?.[0]?.plate || '';

  const plateMatch = useMemo(() => {
    if (!realPlate) return false;
    return plateInput.trim().toUpperCase() === realPlate.toUpperCase();
  }, [plateInput, realPlate]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImages = [...images];
    const newFiles = [...files];

    newImages[index] = URL.createObjectURL(file);
    newFiles[index] = file;

    setImages(newImages);
    setFiles(newFiles);

    setErrors((prev) => ({
      ...prev,
      [`image${index + 1}`]: '',
    }));
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newFiles = [...files];

    newImages[index] = null;
    newFiles[index] = null;

    setImages(newImages);
    setFiles(newFiles);
  };

  const validate = () => {
    const newErrors = {
      image1: files[0] ? '' : 'La imagen 1 es obligatoria.',
      image2: files[1] ? '' : 'La imagen 2 es obligatoria.',
      date: deliveryDate ? '' : 'La fecha de entrega es obligatoria.',
    };

    setErrors(newErrors);
    return !newErrors.image1 && !newErrors.image2 && !newErrors.date;
  };

  const handleSave = async () => {
    if (!latestSchedule) {
      alert('Este cliente no tiene agendamiento activo.');
      return;
    }

    if (!validate()) return;

    try {
      setLoading(true);

      await createEvidenceMotorcyclesScheduled(latestSchedule.id, {
        deliveredAt: new Date(deliveryDate).toISOString(),
        photoOne: files[0],
        photoTwo: files[1],
      });

      await updateDeliveryStatus(data.id, 'ENTREGADO');

      setImages([null, null]);
      setFiles([null, null]);
      setDeliveryDate('');

      if (onSuccess) onSuccess();
      setAlert({
        type: 'success',
        message: 'Se añadio la evidencia correctamente.',
      });
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'error',
        message: err.message || 'Error al guardar la evidencia',
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !latestSchedule || loading || !plateMatch;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Evidencia de Entrega
        </h2>
        <p className="text-sm text-gray-500">
          Adjunte las fotografías y confirme la fecha de entrega.
        </p>

        {!latestSchedule && (
          <p className="text-sm text-red-500 mt-2">
            Este cliente no tiene una entrega agendada.
          </p>
        )}
      </div>

      <div className="space-y-2 max-w-sm">
        <label className="text-sm font-semibold text-gray-700">
          Validar placa de la moto
        </label>

        <input
          type="text"
          placeholder="Ingrese la placa"
          value={plateInput}
          onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
          disabled={loading}
          className={`w-full border rounded-xl p-3 text-sm bg-white
    focus:ring-2 outline-none transition
    ${
      plateInput.length === 0
        ? 'border-gray-300 focus:ring-orange-500'
        : plateMatch
          ? 'border-green-400 focus:ring-green-500'
          : 'border-red-400 focus:ring-red-500'
    }`}
        />

        {plateInput.length > 0 && (
          <p
            className={`text-xs font-medium ${
              plateMatch ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {plateMatch
              ? '✔ La placa coincide con la motocicleta.'
              : '✖ La placa no coincide con la motocicleta.'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {images.map((img, index) => (
          <div key={index} className="space-y-2">
            <div
              className={`relative border-2 border-dashed rounded-2xl 
              h-56 flex items-center justify-center bg-gray-50 overflow-hidden
              ${errors[`image${index + 1}`] ? 'border-red-400' : 'border-gray-300'}`}
            >
              {!img ? (
                <label className="flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-orange-500 transition">
                  <PlusIcon className="w-10 h-10 mb-2" />
                  <span className="text-sm font-medium">
                    Agregar imagen {index + 1}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, index)}
                    disabled={isDisabled}
                  />
                </label>
              ) : (
                <>
                  <img
                    src={img}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    disabled={isDisabled}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </button>
                </>
              )}
            </div>

            {errors[`image${index + 1}`] && (
              <p className="text-xs text-red-500">
                {errors[`image${index + 1}`]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2 max-w-sm">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <CalendarIcon className="w-4 h-4 text-orange-500" />
          Fecha de entrega
        </label>
        <input
          type="date"
          value={deliveryDate}
          onChange={(e) => {
            setDeliveryDate(e.target.value);
            setErrors((prev) => ({ ...prev, date: '' }));
          }}
          disabled={isDisabled}
          className={`w-full border rounded-xl p-3 text-sm bg-white
          focus:ring-2 focus:ring-orange-500 outline-none transition
          ${errors.date ? 'border-red-400' : 'border-gray-300'}`}
        />
        {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
      </div>

      <div>
        <button
          onClick={handleSave}
          disabled={isDisabled}
          className="inline-flex items-center justify-center gap-2
          px-6 py-2.5 text-sm font-semibold rounded-xl
          bg-orange-500 text-white hover:bg-orange-600
          transition shadow-md cursor-pointer disabled:opacity-60"
        >
          <CheckCircleIcon className="w-5 h-5" />
          {loading ? 'Guardando...' : 'Guardar Entrega'}
        </button>
      </div>

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' }, onClose(true))}
        url={alert.url}
      />
    </div>
  );
}
