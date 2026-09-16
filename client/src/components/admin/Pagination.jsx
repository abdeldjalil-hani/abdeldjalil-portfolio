export default function Pagination({ page, pages, total, onChange }) {
  if (pages <= 1) return null;
  const items = [];
  for (let i = 1; i <= pages && i <= 8; i++) items.push(i);

  return (
    <div className="pager">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>‹</button>
      {items.map((p) => (
        <button
          key={p}
          className={p === page ? 'active' : ''}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button disabled={page >= pages} onClick={() => onChange(page + 1)}>›</button>
      <span className="info">{total} total</span>
    </div>
  );
}