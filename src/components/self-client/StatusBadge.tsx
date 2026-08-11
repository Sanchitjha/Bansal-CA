function slugifyStatus(status: string) {
  return status.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${slugifyStatus(status)}`}>{status}</span>;
}
