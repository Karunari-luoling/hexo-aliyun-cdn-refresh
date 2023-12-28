const Cdn20180510 = require("@alicloud/cdn20180510").default;
const $Cdn20180510 = require("@alicloud/cdn20180510");
const $OpenApi = require("@alicloud/openapi-client");
const logger = require('hexo-log').default();

class AliyunCdnService {
  constructor(access) {
    this.client = this.createClient(access.accessKeyId, access.accessKeySecret);
  }

  createClient(accessKeyId, accessKeySecret) {
    const config = new $OpenApi.Config({});
    config.accessKeyId = accessKeyId;
    config.accessKeySecret = accessKeySecret;
    config.endpoint = "cdn.aliyuncs.com";
    return new Cdn20180510(config);
  }

  async refresh(opts) {
    const refreshObjectCachesRequest = new $Cdn20180510.RefreshObjectCachesRequest(
      opts
    );
    const ret = await this.client.refreshObjectCaches(
      refreshObjectCachesRequest
    );
    logger.info("刷新成功 refreshTaskId:", ret.body.refreshTaskId, opts.objectPath);
  }

  async push(opts) {
    let pushObjectCacheRequest = new $Cdn20180510.PushObjectCacheRequest(opts);
    const ret = await this.client.pushObjectCache(pushObjectCacheRequest);
    logger.info("预热成功:", ret.body.pushTaskId, opts.objectPath);
  }
}

module.exports = AliyunCdnService;