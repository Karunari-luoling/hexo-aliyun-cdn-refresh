const logger = require('hexo-log').default();
const AliyunCdnService = require('./lib/api');
var fs = require('hexo-fs');
var path = require('path');

function start(hexo) {
    const config = hexo.config;
    const pluginConfig = config['hacr'] ?? config.theme_config['hacr'];
    if (!pluginConfig?.enable)
        return;
    if (pluginConfig['auto_push']) {
        hexo.on('deployAfter', async () => {
            await runHacr(hexo, pluginConfig);
        });
    }
    else {
        hexo.extend.console.register('hacr', '刷新阿里云CDN', {}, async () => {
            await runHacr(hexo, pluginConfig);
        });
    }
}

async function runHacr(hexo, pluginConfig) {
    const config = pluginConfig;
    const accessKeyId = config.Access.accessKeyId
    const accessKeySecret = config.Access.accessKeySecret
    const site = config.site
    const type = config.RefreshOpts.type
    const area = undefined
    let method = config.RefreshOpts.method
    method = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();

    if(!accessKeyId || !accessKeySecret) {
        logger.warn('<AccessKey> <AccessKeySecret> 参数不能为空');
        return;
    }
    if(!site) {
        logger.warn('<site> 参数不能为空');
        return;
    }

    logger.info('开始刷新阿里云CDN');
    const access = { accessKeyId: accessKeyId, accessKeySecret: accessKeySecret };
    const cdnService = new AliyunCdnService(access);
    
    const actions = {
        push: opts => cdnService.push(opts),
        refresh: opts => cdnService.refresh(opts),
        both: async opts => {
            await cdnService.refresh(opts);
            await cdnService.push(opts);
        }
    };
    
    if (method === 'File') {
        const filePath = path.join(process.cwd(), '/source/_data/refresh-list.json');
        if (fs.existsSync(filePath)) {
            const data = require(filePath);
            for (const item of data) {
                let opts = { objectPath: item, objectType: method, area: area };
                if (actions[type]) {
                    await actions[type](opts);
                }
            }
        } else {
            return logger.warn('没有找到refresh-list.json，请在对应位置创建文件');
        }
    }
    
    if (method === 'Directory') {
        let opts = { objectPath: site, objectType: method, area: area };
        if (actions[type]) {
            await actions[type](opts);
        }
    }
}

try {
    start(hexo);
}
catch (e) {
    logger.error(e);
}