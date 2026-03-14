'use client';

import { ADD_COMMENT } from '@/app/graphql/mutations/board.mutation';
import { GET_TASK } from '@/app/graphql/queries/board.query';
import { COMMENT_ADDED } from '@/app/graphql/subscriptions/board.subscriptions';
import { formatDate, priorityBackground } from '@/app/utils/helperFunc';
import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import { useEffect, useRef, useState } from 'react';

// Example task data fallback
const obj = {
  attachments: [
    { id: 1, name: 'screenshot1.png', type: 'PNG' },
    { id: 2, name: 'error-log.png', type: 'PNG' },
  ],
  comments: [
    {
      id: 1,
      author: 'John',
      time: '2h ago',
      text: 'I think this is related to bcrypt.',
    },
    {
      id: 2,
      author: 'Sarah',
      time: 'Just now',
      text: 'I reproduced it locally.',
    },
  ],
};

export const TaskDetailModal = ({ isOpen, onClose, task }) => {
  const [comment, setComment] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { data, loading } = useQuery<any>(GET_TASK, {
    variables: { taskId: task.id },
  });
  const [addComment] = useMutation<any>(ADD_COMMENT);
  const { data: subData } = useSubscription(COMMENT_ADDED, {
    variables: {
      taskId: task.id,
    },
  });

  const taskDetail = data?.getTaskDetail ?? null;
  console.log(subData, 'subDAta');

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

  const addTaskComment = async (e) => {
    e.preventDefault();
    await addComment({
      variables: {
        taskId: task.id,
        message: comment,
      },
    });
    console.log(comment, 'comment');
    setComment('');
  };

  if (!isOpen) return null;

  if (loading) return <span className="text-xs">Loading...</span>;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      aria-describedby="task-modal-desc"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        className="bg-[#121212] rounded-2xl shadow-xl max-w-6xl w-full max-h-[86vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <header className="flex justify-between items-start p-6 border-b border-gray-700">
          <div>
            <div className="text-gray-400 uppercase text-xs tracking-widest mb-1 select-none">
              Task
            </div>
            <h2
              id="task-modal-title"
              className="text-white text-3xl font-semibold flex flex-wrap gap-2"
            >
              <span className="text-gray-400">{taskDetail?.project?.key}</span>
              <span>{taskDetail.title}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-white transition"
          >
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
          </button>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Section */}
          <section className="flex-1 overflow-y-auto p-6 border-r border-gray-700 flex flex-col gap-6">
            {/* Description */}
            <article>
              <h3 className="text-gray-400 uppercase text-xs font-semibold mb-2 tracking-wide">
                Description
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap">
                {taskDetail.description}
              </p>
            </article>

            {/* Attachments */}
            <article>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Attachments
                </h3>
                <span className="text-gray-500 text-xs font-semibold">
                  {obj.attachments.length} files
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {obj.attachments.map(({ id, name, type }) => (
                  <button
                    key={id}
                    className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 text-gray-300 hover:bg-gray-700 transition max-w-xs truncate"
                    aria-label={`Attachment: ${name}`}
                  >
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 3v6h6"
                      />
                    </svg>
                    <span className="truncate">{name}</span>
                    <span className="text-xs text-gray-500 font-semibold">
                      {type}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4m0 0l-5 5m5-5l5 5"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4"
                    />
                  </svg>
                  Upload file
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    aria-label="Upload file"
                    onChange={(e) => {
                      // handle file upload here
                    }}
                  />
                </label>
                <span className="text-xs text-gray-500">
                  Drag & drop is optional
                </span>
              </div>
            </article>

            {/* Comments */}
            <article className="flex flex-col gap-4">
              <h3 className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                Comments ({obj.comments.length})
              </h3>
              <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
                {obj.comments.map(({ id, author, time, text }) => (
                  <div
                    key={id}
                    className="bg-gray-800 rounded-lg p-3"
                    aria-label={`Comment by ${author}`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-semibold text-gray-300">
                        {author}
                      </span>
                      <time className="text-xs text-gray-500">{time}</time>
                    </div>
                    <p className="text-gray-300 text-sm">{text}</p>
                  </div>
                ))}
              </div>

              <form className="mt-2 flex flex-col gap-2">
                <label
                  htmlFor="comment-input"
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  Add a comment
                </label>
                <textarea
                  id="comment-input"
                  rows={4}
                  className="resize-y rounded-lg bg-gray-900 border border-gray-700 p-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Write a comment…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      setComment('');
                      onClose(e);
                    }}
                    className="rounded-md border border-gray-700 px-6 py-2 text-gray-400 hover:text-white hover:border-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addTaskComment}
                    className="rounded-md bg-cyan-600 px-4 py-2 text-white font-semibold hover:bg-cyan-700 transition"
                  >
                    Post comment
                  </button>
                </div>
              </form>
            </article>
          </section>

          {/* Right Section */}
          <aside className="w-80 bg-[#1a1a1a] p-6 overflow-y-auto flex flex-col gap-6">
            <dl className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Status
                </dt>
                <dd>
                  <span className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                    {taskDetail.status.replaceAll('_', ' ')?.toUpperCase()}
                  </span>
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Assignee
                </dt>
                <dd className="text-gray-300 font-semibold">
                  {taskDetail.assignee.name}
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Priority
                </dt>
                <dd>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white ${priorityBackground(taskDetail.priority).priorityColor}`}
                  >
                    {taskDetail.priority}
                  </span>
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Due Date
                </dt>
                <dd className="text-gray-300 font-semibold">
                  {formatDate(taskDetail.dueDate)}
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Reporter
                </dt>
                <dd className="text-gray-300 font-semibold">
                  {taskDetail.reporter.name}
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Created At
                </dt>
                <dd className="text-gray-300 font-semibold">
                  {formatDate(taskDetail?.createdAt)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
};
