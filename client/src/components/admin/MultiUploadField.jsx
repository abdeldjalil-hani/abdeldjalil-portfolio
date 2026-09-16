import { useState } from 'react';
import { adminApi } from '../../api/client';
import { useToast } from './Toast';

/**
 * Multi-image upload widget.
 *
 * Props:
 *  - value: string[]       – array of image URLs
 *  - onChange: (urls) => void
 *  - subdir: string         – upload subfolder
 *  - max: number            – max number of images (default 10)
 */
export default function MultiUploadField({ value = [], onChange, subdir, max = 10 }) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const addFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (value.length >= max) {
      toast.error(`Maximum ${max} images allowed.`);
      e.target.value = '';
      return;
    }
    setBusy(true);
    try {
      const res = await adminApi.upload(subdir, file);
      onChange([...value, res.url]);
      toast.success('File uploaded.');
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const removeAt = (idx) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      {value.length > 0 && (
        <div className="multi-upload-grid">
          {value.map((url, i) => (
            <div key={i} className="multi-upload-thumb">
              <img src={url} alt={`Upload ${i + 1}`} />
              <div className="multi-upload-actions">
                <button type="button" className="mu-btn" onClick={() => move(i, i - 1)} disabled={i === 0} title="Move left">&#8249;</button>
                <button type="button" className="mu-btn" onClick={() => move(i, i + 1)} disabled={i === value.length - 1} title="Move right">&#8250;</button>
                <button type="button" className="mu-btn danger" onClick={() => removeAt(i)} title="Remove">&#10005;</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {value.length < max && (
        <span className="btn btn-outline btn-sm upload-btn">
          {busy ? 'Uploading…' : `Add image (${value.length}/${max})`}
          <input type="file" accept="image/*" onChange={addFile} disabled={busy} />
        </span>
      )}
    </div>
  );
}
