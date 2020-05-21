import CloudBase from './index'
// import { cloudBaseConfig } from '../test/config'

// const app = new CloudBase(cloudBaseConfig)
const app = new CloudBase({})

async function test() {
    // const hosting = await app.hosting.getInfo()
    // const { Bucket, Regoin } = hosting[0]
    // const res = await app.storage.uploadFilesCustom({
    //     files: [
    //         {
    //             localPath: 'test/storage/test_data/data.txt',
    //             cloudPath: 'test/storage/test_data/data.txt'
    //         },
    //         {
    //             localPath: 'test/storage/test_data/download.txt',
    //             cloudPath: 'test/storage/test_data/download.txt'
    //         }
    //     ],
    //     region: Regoin,
    //     bucket: Bucket
    // })

    const res = await app.hosting.uploadFiles({
        localPath: '/Users/wuyiqing/Desktop/cloudbase-demo/functions/node-sdk',
        cloudPath: '',
        onProgress: console.log
    })

    console.log(res)
}

test().catch(console.log)
