'use client';

import { CrossBtn, FileUploadIcon } from '@/app/components/icons';
import {
  ADD_ATTACHMENT_METADATA,
  ADD_COMMENT,
  GET_SIGNED_URL,
} from '@/app/graphql/mutations/board.mutation';
import { GET_TASK } from '@/app/graphql/queries/board.query';
import { GET_ALL_TASK_COMMENTS } from '@/app/graphql/queries/comment.query';
import { COMMENT_ADDED } from '@/app/graphql/subscriptions/comment.subscriptions';
import { formatDate, priorityBackground } from '@/app/utils/helperFunc';
import { instance } from '@/app/utils/interceptors';
import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import ImageModal from './imageModal';
import { TaskActivity } from './taskActivity';

export const TaskDetailModal = ({ isOpen, onClose, task }) => {
  const { data, loading } = useQuery<any>(GET_TASK, {
    variables: { taskId: task.id },
  });
  const {
    data: commentData,
    loading: commentLoading,
    refetch: refetchComments,
  } = useQuery<any>(GET_ALL_TASK_COMMENTS, {
    variables: {
      taskId: task.id,
    },
  });

  const [getSignedUrl, { data: urlData }] = useMutation<any>(GET_SIGNED_URL);
  const [addComment] = useMutation<any>(ADD_COMMENT);
  const [addAttachmentMetadata] = useMutation(ADD_ATTACHMENT_METADATA, {
    refetchQueries: [
      {
        query: GET_TASK,
        variables: { taskId: task.id },
      },
    ],
  });
  const { data: subData } = useSubscription<any>(COMMENT_ADDED, {
    variables: {
      taskId: task.id,
    },
  });

  const commentsRef = useRef<HTMLDivElement | null>(null);
  const [comment, setComment] = useState('');
  const [commentState, setCommentState] = useState<any>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [file, setFile] = useState<any>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const taskDetail = data?.getTaskDetail ?? null;

  useEffect(() => {
    refetchComments();
  }, [isOpen, refetchComments]);

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

  useEffect(() => {
    if (commentData?.getAllTaskComments && !commentLoading) {
      setCommentState(commentData?.getAllTaskComments);
    }
  }, [commentData, commentLoading]);

  useEffect(() => {
    if (subData) {
      setCommentState((prev) => [...prev, subData?.commentAdded]);
    }
  }, [subData]);

  useEffect(() => {
    if (commentsRef?.current) {
      commentsRef.current.scrollTo({
        top: commentsRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [commentState, tabIndex]);

  useEffect(() => {
    if (urlData?.getSignedUrl) {
      uploadMetaData(urlData?.getSignedUrl);
    }
  }, [urlData]);

  const addTaskComment = async (e) => {
    e.preventDefault();
    await addComment({
      variables: {
        taskId: task.id,
        message: comment,
      },
    });
    setComment('');
  };

  const handleFileUpload = async (e) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/xml',
      'text/xml',
    ];

    if (e.target?.files[0]?.name) {
      const file = e.target?.files[0];

      if (file?.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `Unsupported file type, Supported type ${allowedTypes.join(', ')}`,
        );
        return;
      }

      setFile(file);
      const fileName = file?.name;
      const fileType = file?.type;
      const fileSize = file?.size;
      await getSignedUrl({
        variables: {
          fileName,
          fileType,
          fileSize,
        },
      });
    } else {
      toast.error('Please upload a file');
    }
  };

  const uploadMetaData = async (data) => {
    try {
      await instance.put(data.fileUrl, file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      });
    } catch (e) {
      console.log(e, 'error putting file to s3');
    } finally {
      await addAttachmentMetadata({
        variables: {
          taskId: task.id,
          fileName: data.fileName,
        },
      });
    }
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
        className="bg-[#121212] rounded-2xl shadow-xl max-w-6xl w-full min-h-[92vh] max-h-[92vh] overflow-hidden flex flex-col"
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
              <span>{taskDetail?.title}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-white transition"
          >
            <CrossBtn />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Section */}
          <section className="flex-1 overflow-hidden p-6 border-r border-gray-700 flex flex-col gap-6">
            {/* Description */}
            <article>
              <h3 className="text-gray-400 uppercase text-xs font-semibold mb-2 tracking-wide">
                Description
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap">
                {taskDetail?.description}
              </p>
            </article>

            {/* Attachments */}
            <article>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Attachments
                </h3>
                <span className="text-gray-500 text-xs font-semibold">
                  {taskDetail?.attachments?.length ?? ''} files
                </span>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                {taskDetail?.attachments.map(({ id, fileName, fileUrl }) => (
                  <div key={id} className="max-w-23">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileName}`}
                      alt={fileName}
                      width={20}
                      height={20}
                      className="h-20 w-20 object-fill"
                      onClick={() =>
                        setExpandedImage(
                          `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileName}`,
                        )
                      }
                    />
                    <p className="text-xs truncate">
                      {fileName?.split('_')?.[1]}
                    </p>
                    {/* <button
                      key={id}
                      className="flex items-center gap-2 bg-gray-800 rounded-lg text-gray-300 hover:bg-gray-700 transition max-w-xs truncate p-2"
                      aria-label={`Attachment: ${fileName?.split('_')?.[1]}`}
                      >
                      <FileIcon />
                      </button> */}
                  </div>
                ))}
                {expandedImage && (
                  <ImageModal
                    expandedImage={expandedImage}
                    closeImageModal={() => setExpandedImage(null)}
                  />
                )}
                <span className="mt-3 flex items-center gap-3">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition"
                  >
                    <FileUploadIcon />
                    Upload file
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      aria-label="Upload file"
                      onChange={handleFileUpload}
                    />
                  </label>
                </span>
              </div>
            </article>

            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList className="flex border-b border-gray-700">
                <Tab
                  className="cursor-pointer px-4 py-2 text-gray-400 font-semibold rounded-t-md hover:text-white focus:outline-none"
                  selectedClassName="bg-[#1a1a1a] text-white border border-b-0 border-gray-600"
                >
                  Comments
                </Tab>
                <Tab
                  className="cursor-pointer px-4 py-2 text-gray-400 font-semibold rounded-t-md hover:text-white focus:outline-none"
                  selectedClassName="bg-[#1a1a1a] text-white border border-b-0 border-gray-600"
                >
                  Activity
                </Tab>
              </TabList>
              <TabPanel className="bg-[#121212] p-6 rounded-b-md overflow-y-auto">
                <article className="flex flex-col gap-4">
                  {!commentLoading && (
                    <div>
                      <h3 className="text-gray-400 uppercase text-xs font-semibold tracking-wide mb-2">
                        Comments ({commentState?.length})
                      </h3>
                      <div
                        className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2"
                        ref={commentsRef}
                      >
                        {commentState.map((cmt) => (
                          <div
                            key={cmt.id}
                            className="bg-gray-800 rounded-lg p-3"
                            aria-label={`Comment by ${cmt.user.name}`}
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="font-semibold text-sm text-gray-300">
                                {cmt?.user?.name}
                              </span>
                              <time className="text-gray-400 text-xs">
                                {formatDate(cmt.createdAt, true)}
                              </time>
                            </div>
                            <p className="text-gray-300 text-sm">
                              {cmt.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form className="mt-2 flex flex-col gap-2">
                    <label
                      htmlFor="comment-input"
                      className="text-xs font-semibold text-gray-400 uppercase tracking-wide"
                    >
                      Add a comment
                    </label>
                    <textarea
                      id="comment-input"
                      rows={2}
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
                        disabled={!comment?.trim()}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-500 transition cursor:pointer"
                      >
                        Post comment
                      </button>
                    </div>
                  </form>
                </article>
              </TabPanel>
              <TabPanel className="bg-[#121212] p-6 rounded-b-md overflow-y-auto -mt-10">
                <TaskActivity activities={taskDetail?.activities ?? []} />
              </TabPanel>
            </Tabs>
            {/* Comments */}
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
                    {taskDetail?.status?.replaceAll('_', ' ')?.toUpperCase()}
                  </span>
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Assignee
                </dt>
                <dd className="text-gray-300 font-semibold">
                  {taskDetail?.assignee?.name}
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
                    {taskDetail?.priority}
                  </span>
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Due Date
                </dt>
                <dd className="text-gray-300 font-semibold">
                  {formatDate(taskDetail?.dueDate)}
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-gray-400 uppercase text-xs font-semibold tracking-wide">
                  Reporter
                </dt>
                <dd className="text-gray-300 font-semibold">
                  {taskDetail?.reporter?.name}
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
