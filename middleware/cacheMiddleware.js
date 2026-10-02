const cache = new Map();
const TTL_MS = 60 * 1000;

function cacheMiddleware(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;

  if (cache.has(key)) {
    const cachedEntry = cache.get(key);
    const isExpired = Date.now() - cachedEntry.createdAt > TTL_MS;

    if (!isExpired) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedEntry.data);
    }

    cache.delete(key);
  }

  res.setHeader('X-Cache', 'MISS');

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, {
        data: body,
        createdAt: Date.now()
      });
    }
    return originalJson(body);
  };

  next();
}

function invalidateCache() {
  cache.clear();
}

module.exports = {
  cacheMiddleware,
  invalidateCache
};
