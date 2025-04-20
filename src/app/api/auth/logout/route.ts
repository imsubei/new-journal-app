import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

// 登出API路由处理函数
export async function POST(request: NextRequest) {
  try {
    // 创建一个过期的cookie来清除现有的auth_token
    const cookie = serialize('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // 立即过期
      path: '/',
    });

    // 返回成功响应
    const response = NextResponse.json(
      { success: true, message: '已成功登出' },
      { status: 200 }
    );
    
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    console.error('登出错误:', error);
    return NextResponse.json(
      { error: '登出过程中发生错误' },
      { status: 500 }
    );
  }
}
