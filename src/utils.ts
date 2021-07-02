import http from 'http';

/**
 * Schedule function
 * @param fn Function to execute
 * @param t Time in ms (default 24h)
 */
export const cron = async (fn: () => void, t = 86400000) => {
  await fn();
  setTimeout(async () => {
    await fn();
    cron(fn, t);
  }, t);
};

export const sleep = (t: number) => new Promise(resolve => setTimeout(resolve, t));

export const getBody = <T>(req: http.IncomingMessage): Promise<T> => new Promise((resolve, reject) => {
  const chunks: Buffer[] = [];

  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('error', reject);
  req.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
});
