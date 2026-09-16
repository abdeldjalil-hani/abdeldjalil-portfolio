import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from '../../components/admin/Toast';
import Modal from '../../components/admin/Modal';
import { formatDate } from '../../utils/helpers';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function MessagesManager() {
  const toast = useToast();
  const [rows, setRows] = useState(null);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = useCallback((p = 1) => {
    const params = new URLSearchParams();
    params.set('page', String(p));
    if (filter === 'unread') params.set('read', '0');
    if (filter === 'read') params.set('read', '1');
    adminApi.messages(`?${params.toString()}`)
      .then((d) => {
        setRows(d.data);
        setMeta(d.meta);
        setPage(d.meta.page);
      })
      .catch((e) => toast.error(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, toast]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const toggleRead = async (row) => {
    const next = !row.isRead;
    try {
      const action = next ? adminApi.msgRead : adminApi.msgUnread;
      await action(row.id);
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, isRead: next } : r)));
      if (viewing?.id === row.id) setViewing((v) => ({ ...v, isRead: next }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await adminApi.deleteMessage(viewing.id);
      setViewing(null);
      load();
      toast.success('Message deleted.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="toolbar">
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'unread', 'read'].map((k) => (
            <button
              key={k}
              className={`btn btn-sm${filter === k ? ' btn-primary' : ' btn-outline'}`}
              onClick={() => setFilter(k)}
            >
              {k === 'all' ? 'All' : k === 'unread' ? 'Unread' : 'Read'}
            </button>
          ))}
        </div>
      </div>

      {!rows && <div style={{ color: 'var(--text-faint)', padding: '30px 0' }}>Loading…</div>}
      {rows && (
        <>
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th style={{ width: 90 }}>Status</th>
                  <th style={{ width: 120 }}>Received</th>
                  <th style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr><td colSpan={6} style={{ color: 'var(--text-faint)' }}>No messages.</td></tr>
                )}
                {rows.map((r) => (
                  <tr key={r.id} style={{ opacity: r.isRead ? 0.6 : 1, fontWeight: r.isRead ? 400 : 600 }}>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td style={{ maxWidth: 280 }}>{r.subject || '—'}</td>
                    <td>
                      <span className={`badge ${r.isRead ? 'green' : 'orange'}`}>
                        {r.isRead ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td>{formatDate(r.createdAt)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="icon-btn" title="View" onClick={() => setViewing(r)}>↗</button>
                      <button className="icon-btn" title={r.isRead ? 'Mark unread' : 'Mark read'} onClick={() => toggleRead(r)}>
                        {r.isRead ? '↩' : '✓'}
                      </button>
                      <button className="icon-btn danger" title="Delete" onClick={() => setViewing({ ...r, confirmDelete: true })}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={meta?.page} pages={meta?.pages} total={meta?.total} onChange={load} />
        </>
      )}

      <Modal
        open={!!viewing && !viewing.confirmDelete}
        title={viewing?.subject || 'Message'}
        onClose={() => setViewing(null)}
        footer={(
          <>
            <button className="btn" onClick={() => setViewing(null)}>Close</button>
            <button className="btn btn-primary" onClick={() => toggleRead(viewing)}>
              {viewing?.isRead ? 'Mark unread' : 'Mark read'}
            </button>
          </>
        )}
      >
        <p>
          <strong>{viewing?.name}</strong> &lt;{viewing?.email}&gt;
          <br />
          <span style={{ color: 'var(--text-faint)' }}>{formatDate(viewing?.createdAt)}</span>
        </p>
        <div style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{viewing?.message}</div>
      </Modal>

      <ConfirmDialog
        open={!!viewing?.confirmDelete}
        text={`Delete the message from "${viewing?.name}"? This cannot be undone.`}
        onCancel={() => setViewing(null)}
        onConfirm={confirmDelete}
        busy={busy}
      />
    </div>
  );
}