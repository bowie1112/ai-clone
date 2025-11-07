/**
 * 视频数据库操作函数
 * 提供 CRUD 操作和业务逻辑
 */

import { prisma } from '@/lib/prisma';
import type { Video, VideoStatus, Prisma } from '@prisma/client';

/**
 * 创建新的视频记录
 */
export async function createVideo(data: {
  userId?: string;
  prompt: string;
  title?: string;
  description?: string;
  style?: string;
  duration?: number;
  quality?: string;
  aspectRatio?: string;
  locale?: string;
  lumaId?: string;
}) {
  return await prisma.video.create({
    data: {
      ...data,
      status: 'PENDING',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
}

/**
 * 获取视频详情
 */
export async function getVideo(id: string) {
  return await prisma.video.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
}

/**
 * 通过 Luma ID 获取视频
 */
export async function getVideoByLumaId(lumaId: string) {
  return await prisma.video.findUnique({
    where: { lumaId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
}

/**
 * 获取用户的视频列表
 */
export async function getUserVideos(
  userId: string,
  options?: {
    skip?: number;
    take?: number;
    status?: VideoStatus;
    orderBy?: Prisma.VideoOrderByWithRelationInput;
  }
) {
  const { skip = 0, take = 20, status, orderBy = { createdAt: 'desc' } } = options || {};

  const where: Prisma.VideoWhereInput = {
    userId,
    ...(status && { status }),
  };

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.video.count({ where }),
  ]);

  return {
    videos,
    total,
    hasMore: skip + take < total,
  };
}

/**
 * 获取所有视频列表（用于管理）
 */
export async function getAllVideos(options?: {
  skip?: number;
  take?: number;
  status?: VideoStatus;
  orderBy?: Prisma.VideoOrderByWithRelationInput;
}) {
  const { skip = 0, take = 20, status, orderBy = { createdAt: 'desc' } } = options || {};

  const where: Prisma.VideoWhereInput = {
    ...(status && { status }),
  };

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.video.count({ where }),
  ]);

  return {
    videos,
    total,
    hasMore: skip + take < total,
  };
}

/**
 * 更新视频状态
 */
export async function updateVideoStatus(
  id: string,
  status: VideoStatus,
  data?: {
    videoUrl?: string;
    thumbnailUrl?: string;
    lumaData?: any;
    completedAt?: Date;
  }
) {
  return await prisma.video.update({
    where: { id },
    data: {
      status,
      ...data,
      ...(status === 'COMPLETED' && !data?.completedAt && { completedAt: new Date() }),
    },
  });
}

/**
 * 更新视频信息
 */
export async function updateVideo(
  id: string,
  data: Prisma.VideoUpdateInput
) {
  return await prisma.video.update({
    where: { id },
    data,
  });
}

/**
 * 删除视频
 */
export async function deleteVideo(id: string) {
  return await prisma.video.delete({
    where: { id },
  });
}

/**
 * 获取用户统计信息
 */
export async function getUserStats(userId: string) {
  const [
    totalVideos,
    completedVideos,
    processingVideos,
    failedVideos,
  ] = await Promise.all([
    prisma.video.count({ where: { userId } }),
    prisma.video.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.video.count({ where: { userId, status: 'PROCESSING' } }),
    prisma.video.count({ where: { userId, status: 'FAILED' } }),
  ]);

  return {
    totalVideos,
    completedVideos,
    processingVideos,
    failedVideos,
  };
}

/**
 * 批量更新视频状态（用于清理任务）
 */
export async function cleanupStaleVideos(olderThanHours: number = 24) {
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - olderThanHours);

  return await prisma.video.updateMany({
    where: {
      status: 'PROCESSING',
      updatedAt: {
        lt: cutoffDate,
      },
    },
    data: {
      status: 'FAILED',
    },
  });
}









