/**
 * 单个视频 API 路由
 * GET - 获取视频详情
 * PATCH - 更新视频信息
 * DELETE - 删除视频
 */

import { NextRequest, NextResponse } from 'next/server';
import { getVideo, updateVideo, deleteVideo, updateVideoStatus } from '@/lib/db/videos';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const video = await getVideo(id);

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 检查视频是否存在
    const existingVideo = await getVideo(id);
    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // 如果只更新状态，使用专门的函数
    if (body.status && Object.keys(body).length === 1) {
      const video = await updateVideoStatus(id, body.status);
      return NextResponse.json(video);
    }

    // 如果同时更新状态和其他字段
    if (body.status) {
      const { status, videoUrl, thumbnailUrl, lumaData, ...otherData } = body;
      const video = await updateVideoStatus(id, status, {
        videoUrl,
        thumbnailUrl,
        lumaData,
      });
      
      // 如果还有其他字段需要更新
      if (Object.keys(otherData).length > 0) {
        return await updateVideo(id, otherData);
      }
      
      return NextResponse.json(video);
    }

    // 更新其他字段
    const video = await updateVideo(id, body);
    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 检查视频是否存在
    const existingVideo = await getVideo(id);
    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    await deleteVideo(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}




