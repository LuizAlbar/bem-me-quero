export function AdminFeedback({
  error,
  message,
}: {
  error: string | null
  message?: string | null
}) {
  return (
    <>
      {error && (
        <p role="alert" className="rounded-xl bg-blush/50 p-3 text-sm text-danger">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="rounded-xl bg-surface p-3 text-sm text-brand">
          {message}
        </p>
      )}
    </>
  )
}
