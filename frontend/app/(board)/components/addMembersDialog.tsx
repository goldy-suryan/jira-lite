'use client';

import { useEffect, useRef, useState } from 'react';

export const InviteMembersModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [members, setMembers] = useState<any>([]);
  const modalRef = useRef<any>(null);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function addMember() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    if (members.some((mem) => mem.email == trimmedEmail && role == mem.role))
      return;
    setMembers((prev) => [...prev, { email: email.trim(), role }]);
    setEmail('');
    setRole('Member');
  }

  function removeMember(index) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-[#121212] rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <header className="p-6 border-b border-gray-700">
          <h2
            id="invite-modal-title"
            className="text-white text-2xl font-semibold select-none"
          >
            Invite Members
          </h2>
        </header>

        <section className="p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <label
              htmlFor="email-input"
              className="block text-gray-400 uppercase text-xs font-semibold tracking-wide mb-1"
            >
              Email
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg bg-zinc-800 border border-gray-700 p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="role-select"
              className="block text-gray-400 uppercase text-xs font-semibold tracking-wide mb-1"
            >
              Role (optional)
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 border border-gray-700 p-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option>Member</option>
              <option>Admin</option>
              <option>Viewer</option>
            </select>
          </div>

          <button
            type="button"
            onClick={addMember}
            className="self-start rounded-md bg-blue-600 px-5 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            Add Member
          </button>

          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-lg p-2 bg-zinc-800">
            {members.length === 0 ? (
              <p className="text-gray-500 text-center select-none">
                No members added
              </p>
            ) : (
              <ul className="divide-y divide-gray-700">
                {members.map(({ email, role }, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center py-2 text-gray-300 text-sm"
                  >
                    <span className="truncate max-w-[60%]">{email}</span>
                    <span className="text-gray-400 italic">{role}</span>
                    <button
                      onClick={() => removeMember(i)}
                      aria-label={`Remove ${email}`}
                      className="ml-4 text-red-500 hover:text-red-600 transition"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <footer className="flex justify-end gap-4 p-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-700 px-6 py-2 text-gray-400 hover:text-white hover:border-gray-500 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => alert(`Invited ${members.length} member(s)`)}
            disabled={members.length === 0}
            className={`rounded-md px-6 py-2 font-semibold transition ${
              members.length === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Send Invite
          </button>
        </footer>
      </div>
    </div>
  );
};
