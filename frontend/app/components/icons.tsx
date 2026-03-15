export function UserIcon({ className }: Readonly<{ className: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M20 20.2c0-3.8-3.6-6.9-8-6.9s-8 3.1-8 6.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MailIcon({ className }: Readonly<{ className: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 7.5h15v10h-15v-10Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m5.4 8.1 6.6 5.2 6.6-5.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({ className }: Readonly<{ className: string }>) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 11V8.7a4.5 4.5 0 0 1 9 0V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.5 11h11v8.5h-11V11Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 14.3v2.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v6h6" />
    </svg>
  );
}

export function CrossBtn() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
