import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AlertModal from '@/components/dashboard/modals/alertModal';
import { useAuth } from '@/context/authContext';
import useCustomers from '@/lib/api/hooks/useCustomers';
import CustomerForm from '@/components/dashboard/form/customerForm';
import { Roles } from '@/config/roles';

export default function EditCustomerComponent({
  title = '',
  href = 'customers',
}) {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { usuario } = useAuth();

  const { getCustomerById, updateCustomer, addComment, loading } =
    useCustomers();

  const [formData, setFormData] = useState({});
  const [newComment, setNewComment] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', url: '' });
  const [isLocked, setIsLocked] = useState(false);
  const [shouldShowDeliveryState, setShouldShowDeliveryState] = useState(false);

  useEffect(() => {
    if (id) {
      getCustomerById(Number(id))
        .then((res) => {
          setFormData(res.data || res);
        })
        .catch(() => {
          setAlert({
            type: 'warning',
            message: 'Cliente no encontrado.',
            url: `/CRM/dashboard/${href}`,
          });
          router.push(`/CRM/dashboard/${href}`);
        });
    }
  }, [id, router]);

  useEffect(() => {
    if (usuario.role === Roles.ASESOR) {
      setIsLocked(true);
    }

    if (Number(formData.stateId) === 19) {
      setIsLocked(false);
      setShouldShowDeliveryState(true);
    } else {
      setShouldShowDeliveryState(false);
    }
  }, [formData]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(Number(id), newComment.trim());
      const res = await getCustomerById(Number(id));
      setFormData(res.data || res);

      setNewComment('');
      setAlert({
        type: 'success',
        message: 'Comentario agregado correctamente.',
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al agregar comentario',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(Number(id), formData);
      setAlert({
        type: 'success',
        message: 'Cliente actualizado correctamente.',
        url: `/CRM/dashboard/${href}`,
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Error al actualizar cliente',
      });
    }
  };

  if (!formData)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Cargando cliente {title}...
      </p>
    );

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-8 mt-6 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Editar Cliente {title}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Actualice la información del cliente y registre observaciones.
      </p>

      <CustomerForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isLocked={isLocked}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        loading={loading}
        mode="edit"
        usuario={usuario}
        view={href}
        shouldShowDeliveryState={shouldShowDeliveryState}
      />

      <AlertModal
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
        url={alert.url}
      />
    </div>
  );
}
