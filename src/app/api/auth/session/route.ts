import { NextRequest, NextResponse } from 'next/server';
import { executeQueryFirst } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// 会话API路由处理函数
export async function GET(request: NextRequest) {
  try {
    // 获取cookie中的token
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    // 验证token
    try {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'fallback_secret_key_for_development'
      ) as { userId: string, email: string };
      
      // 获取用户信息
      const user = await executeQueryFirst(
        'SELECT id, email, name FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (!user) {
        return NextResponse.json(
          { user: null },
          { status: 200 }
        );
      }

      // 返回用户信息
      return NextResponse.json(
        { 
          user: { 
            id: user.id, 
            email: user.email, 
            name: user.name 
          } 
        },
        { status: 200 }
      );
    } catch (error) {
      // Token无效或过期
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('获取会话错误:', error);
    return NextResponse.json(
      { error: '获取会话信息时发生错误' },
      { status: 500 }
    );
  }
}
