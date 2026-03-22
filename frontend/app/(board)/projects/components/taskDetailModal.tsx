'use client';

import {
  ADD_ATTACHMENT_METADATA,
  ADD_COMMENT,
  GET_SIGNED_URL,
} from '@/app/graphql/mutations/board.mutation';
import { GET_TASK } from '@/app/graphql/queries/board.query';
import { GET_ALL_TASK_COMMENTS } from '@/app/graphql/queries/comment.query';
import { COMMENT_ADDED } from '@/app/graphql/subscriptions/comment.subscriptions';
import { formatDate } from '@/app/utils/helperFunc';
import { instance } from '@/app/utils/interceptors';
import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCloudUploadFill } from 'react-icons/bs';
import { FaPaperPlane, FaX } from 'react-icons/fa6';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import ImageModal from './imageModal';
import { TaskActivity } from './taskActivity';

export const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  priorityIcon,
  color,
}) => {
  const {
    data,
    loading,
    refetch: refetchTask,
  } = useQuery<any>(GET_TASK, {
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

  const modalRef = useRef<HTMLDivElement>(null);
  const [comment, setComment] = useState('');
  const [commentState, setCommentState] = useState<any>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [file, setFile] = useState<any>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const taskDetail = data?.getTaskDetail ?? null;

  useEffect(() => {
    refetchComments();
    refetchTask();
  }, [isOpen, refetchComments, refetchTask]);

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
  }, [commentState, tabIndex, isOpen, commentsRef?.current]);

  useEffect(() => {
    if (urlData?.getSignedUrl) {
      uploadMetaData(urlData?.getSignedUrl);
    }
  }, [urlData]);

  const addTaskComment = async (e) => {
    e.preventDefault();
    if (!comment?.trim()) return;
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

  if (loading) return <span className="text-xs"></span>;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm px-4"
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
        <header className="flex justify-between items-start p-4 border-b border-gray-700">
          <div>
            <h2
              id="task-modal-title"
              className="text-xl font-semibold flex flex-wrap gap-2 items-center"
            >
              {priorityIcon(taskDetail?.priority?.toLowerCase())}
              <span>{taskDetail?.project?.key}:</span>
              <span>{taskDetail?.title}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="transition"
          >
            <FaX />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Section */}
          <section className="flex-1 overflow-hidden p-6 border-r border-gray-700 flex flex-col gap-6">
            <article className="mb-4">
              <h3 className="uppercase text-sm font-semibold mb-2 tracking-wide">
                Description
              </h3>
              <div className="max-h-44 overflow-y-auto">
                <p className="whitespace-pre-wrap text-sm">
                  {taskDetail?.description}
                </p>
              </div>
            </article>

            <Tabs
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList className="flex border-b border-gray-700">
                <Tab
                  className="cursor-pointer px-4 py-2 font-semibold rounded-t-md focus:outline-none"
                  selectedClassName="bg-[#1a1a1a] border border-b-0 border-gray-600"
                >
                  Comments{' '}
                  <span className="text-sm inline-flex items-center gap-x-1 rounded-full bg-gray-200 ml-2 p-1 text-xs font-medium text-gray-900 min-w-[18px] h-[18px] text-center">
                    {commentState?.length}
                  </span>
                </Tab>
                <Tab
                  className="cursor-pointer px-4 py-2 font-semibold rounded-t-md focus:outline-none"
                  selectedClassName="bg-[#1a1a1a] border border-b-0 border-gray-600"
                >
                  Activity{' '}
                  <span className="text-sm inline-flex items-center gap-x-1 rounded-full bg-gray-200 ml-2 p-1 text-xs font-medium text-gray-900 min-w-[18px] h-[18px] text-center">
                    {taskDetail?.activities?.length}
                  </span>
                </Tab>
              </TabList>
              <TabPanel className="bg-[#121212] pt-6 rounded-b-md overflow-y-auto">
                <article className="flex flex-col gap-4">
                  {!commentLoading && (
                    <div
                      className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-[9rem] xl:max-h-[20rem]"
                      ref={commentsRef}
                    >
                      {commentState.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="bg-gray-800 rounded-lg p-3"
                          aria-label={`Comment by ${cmt.user.name}`}
                        >
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="font-semibold text-sm">
                              {cmt?.user?.name}
                            </span>
                            <time className="text-xs">
                              {formatDate(cmt.createdAt, true)}
                            </time>
                          </div>
                          <p className="text-sm">{cmt.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <form className="mt-2 flex flex-col gap-3 relative">
                    <textarea
                      id="comment-input"
                      rows={1}
                      className="resize-y rounded-lg bg-gray-900 border border-gray-700 p-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Write a comment…"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <FaPaperPlane
                      className="absolute right-5 top-5"
                      onClick={addTaskComment}
                    />
                  </form>
                </article>
              </TabPanel>
              <TabPanel className="bg-[#121212] mt-1 rounded-b-md -mt-10">
                <TaskActivity
                  activities={taskDetail?.activities ?? []}
                  tabIndex={tabIndex}
                />
              </TabPanel>
            </Tabs>
            {/* Comments */}
          </section>

          {/* Right Section */}
          <aside className="w-80 bg-[#1a1a1a] p-6 overflow-y-auto flex flex-col gap-6">
            <dl className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <dt className="uppercase text-xs font-semibold tracking-wide">
                  Status
                </dt>
                <dd>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full ${color} px-3 py-1 text-xs font-semibold`}
                  >
                    {taskDetail?.status?.replaceAll('_', ' ')?.toUpperCase()}
                  </span>
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="uppercase text-xs font-semibold tracking-wide">
                  Assignee
                </dt>
                <dd className="font-semibold">{taskDetail?.assignee?.name}</dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="uppercase text-xs font-semibold tracking-wide">
                  Due Date
                </dt>
                <dd className="font-semibold">
                  {formatDate(taskDetail?.dueDate)}
                </dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="uppercase text-xs font-semibold tracking-wide">
                  Reporter
                </dt>
                <dd className="font-semibold">{taskDetail?.reporter?.name}</dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="uppercase text-xs font-semibold tracking-wide">
                  Created At
                </dt>
                <dd className="font-semibold">
                  {formatDate(taskDetail?.createdAt)}
                </dd>
              </div>
            </dl>

            {/* Attachments */}
            <article className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="uppercase text-sm font-semibold tracking-wide">
                  Attachments{' '}
                  <span className="font-semibold">
                    ({taskDetail?.attachments?.length ?? ''})
                  </span>
                </h3>
                <div className="mb-4">
                  <span className="mt-3 flex items-center gap-3">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-semibold hover:bg-gray-700 transition"
                    >
                      <BsCloudUploadFill />
                      Upload
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
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                {taskDetail?.attachments.map(({ id, fileName, fileUrl }) => (
                  <div key={id} className="max-w-20">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileName}`}
                      alt={fileName}
                      width={19}
                      height={19}
                      className="h-19 w-19 object-fill"
                      onClick={() => setExpandedImage(`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileName}`)}
                    />
                    <p className="text-xs truncate">
                      {fileName?.split('_')?.[1]}
                    </p>
                  </div>
                ))}
                {expandedImage && (
                  <ImageModal
                    expandedImage={expandedImage}
                    closeImageModal={() => setExpandedImage(null)}
                  />
                )}
              </div>
            </article>
          </aside>
        </div>
      </div>
    </div>
  );
};
