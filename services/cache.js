const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

// client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

console.log(process.env.REDIS_URL)
const client = redis.createClient(process.env.REDIS_URL);

mongoose.Query.prototype.cache = function (options = { time: 3000 }) {
    this.useCache = true;
    this.time = options.time;
    this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);
    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return await exec.apply(this, arguments);
    }
    const key = JSON.stringify({
        ...this.getQuery()
    });
    // const cacheValue = await client.get(this.hashKey, key);
    // const cacheValue = client.get(key);
    // if (cacheValue) {
    //     const doc = JSON.parse(cacheValue);
    //     console.log("Response from Redis");
    //     return Array.isArray(doc)
    //         ? doc.map(d => new this.model(d))
    //         : new this.model(doc);
    // }
    const result = await exec.apply(this, arguments);
    console.log(this.time);
    // client.setex(key, this.time, JSON.stringify(result))
    // client.hset(this.hashKey, key, JSON.stringify(result));
    // client.expire(this.hashKey, this.time);
    console.log("Response from MongoDB");
    console.log(result)
    return result;
};

module.exports = {
    clearKey(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};