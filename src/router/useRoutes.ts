import type Application from 'koa';
import type Router from 'koa-router';
export default async function useRoutes(this: Application) {
  const res = await import(`./index`);
  Object.keys(res).forEach((item) => {
    this.use(((res as any)[item] as Router).routes());
    this.use(((res as any)[item] as Router).allowedMethods());
  });
}
