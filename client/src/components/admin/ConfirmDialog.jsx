import Modal from './Modal';

export default function ConfirmDialog({ open, title = 'Are you sure?', text, onCancel, onConfirm, confirmLabel = 'Delete', busy }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-outline btn-sm" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      {text && <p style={{ color: 'var(--text-soft)' }}>{text}</p>}
    </Modal>
  );
}