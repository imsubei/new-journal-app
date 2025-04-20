// 修复的数据库连接代码
import { D1Database } from '@cloudflare/workers-types';

// 声明全局变量类型
declare global {
  var DB: D1Database | null;
}

// 初始化数据库连接
export async function initDb() {
  // 在开发环境中，我们可以使用模拟数据库
  if (process.env.NODE_ENV === 'development') {
    // 如果数据库已经初始化，直接返回
    if (global.DB) {
      return global.DB;
    }
    
    // 这里可以添加本地开发环境的数据库模拟
    console.log('使用开发环境数据库模拟');
    // 在这里可以实现一个内存数据库或者连接到本地SQLite
    
    // 为了演示，我们返回一个模拟的数据库对象
    global.DB = {
      prepare: (query: string) => {
        return {
          bind: (...params: any[]) => {
            return {
              run: async () => ({ success: true, results: [] }),
              all: async () => [],
              first: async () => null
            };
          }
        };
      }
    } as unknown as D1Database;
    
    return global.DB;
  }
  
  // 在生产环境中，我们应该使用Cloudflare绑定的D1数据库
  // 这部分代码会在Cloudflare Workers环境中运行
  if (typeof global.DB !== 'undefined' && global.DB !== null) {
    return global.DB;
  }
  
  throw new Error('数据库连接不可用，请确保在Cloudflare环境中运行或正确配置了环境变量');
}

// 执行查询并返回结果
export async function executeQuery(query: string, params: any[] = []) {
  const db = await initDb();
  return db.prepare(query).bind(...params).run();
}

// 执行查询并返回所有结果
export async function executeQueryAll(query: string, params: any[] = []) {
  const db = await initDb();
  return db.prepare(query).bind(...params).all();
}

// 执行查询并返回第一个结果
export async function executeQueryFirst(query: string, params: any[] = []) {
  const db = await initDb();
  return db.prepare(query).bind(...params).first();
}
