import { useEffect } from "react";

function Toast({ mensaje, visible, onClose }) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1100 }}>
      <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header bg-warning text-dark">
          <strong className="me-auto">Gas El Volcán</strong>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar notificación" />
        </div>
        <div className="toast-body">
          {mensaje}
        </div>
      </div>
    </div>
  );
}

export default Toast;