import { useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from './Toast';

/** Upload widget: uploads a local file to the server and returns its URL via onChange. */
export default function UploadField({ value, onChange, subdir, label = 'Upload image', accept = 'image/*', onCleared }) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setBusy(true);
    try {
      const res = await adminApi.upload(subdir, file);
      onChange(res.url);
      toast.success('File uploaded.');
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const clear = () => {
    onChange('');
    if (onCleared) onCleared();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="btn btn-outline btn-sm upload-btn">
          {busy ? 'Uploading…' : label}
          <input type="file" accept={accept} onChange={handleFile} disabled={busy} />
        </span>
        {value && (
          <button type="button" className="btn btn-outline btn-sm" onClick={clear}>
            Remove
          </button>
        )}
      </div>
      {value && (
        <div className="upload-preview">
          {/\.(png|jpe?g|gif|webp|svg)$/i.test(value) ? (
            <img src={value} alt="Upload preview" />
          ) : (
            <a href={value} target="_blank" rel="noreferrer noopener" style={{ fontSize: 13, wordBreak: 'break-all' }}>
              {value}
            </a>
          )}
        </div>
      )}
    </div>
  );
}