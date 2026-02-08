type RateLimitStore = Map<string, { count: number; lastRequest: number }>;

const rateLimitMap: RateLimitStore = new Map();

interface RateLimitOptions {
    interval: number; // Window size in milliseconds
    uniqueTokenPerInterval: number; // Max number of unique tokens (IPs) to store
}

export function rateLimit(options: RateLimitOptions) {
    return {
        check: (limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const now = Date.now();
                const windowStart = now - options.interval;

                const tokenData = rateLimitMap.get(token) || { count: 0, lastRequest: now };

                // Reset if outside window
                if (tokenData.lastRequest < windowStart) {
                    tokenData.count = 0;
                    tokenData.lastRequest = now;
                }

                tokenData.count += 1;
                rateLimitMap.set(token, tokenData);

                const currentUsage = tokenData.count;

                if (currentUsage > limit) {
                    reject();
                } else {
                    resolve();
                }

                // Cleanup old entries to prevent memory leak (basic LRU-ish behavior would be better but this is simple)
                if (rateLimitMap.size > options.uniqueTokenPerInterval) {
                    // clear 10% of map to make space, naive approach but sufficient for low traffic
                    let i = 0;
                    for (const key of rateLimitMap.keys()) {
                        rateLimitMap.delete(key);
                        i++;
                        if (i > options.uniqueTokenPerInterval * 0.1) break;
                    }
                }
            }),
    };
}
