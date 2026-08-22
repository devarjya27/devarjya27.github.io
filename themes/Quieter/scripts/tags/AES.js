/**
 * AES
 * 使用方法：
 * {% AES 密码 %}
 * 内容
 * {% endAES %}
 */

'use strict'

var CryptoJS = require("crypto-js");

const parseArgs = args => {
    return args.join(' ').split(',')
}

const AESFn = (args, content) => {
    const [password = "", label = 'The content here requires a password to view~'] = parseArgs(args)
    content = hexo.render.renderSync({ text: content, engine: 'markdown' }) + '<script>init();</script>';
    if (password == "") {
        return content;
    } else {
        const pubkey = CryptoJS.AES.encrypt(content, password).toString();
        const result = `<script>new AESContainer('${label}', '${pubkey}').render();</script>`;
        return result;
    }
}

hexo.extend.tag.register('AES', AESFn, { ends: true })
