export type AsyncTask = () => Promise<any>

/**
 * 异步任务并发控制器，以一定的并发数执行所有任务
 * 不具备队列性质，异步任务随机执行
 * 单个任务异常，错误会返回，单不会退出执行
 * 所有任务执行
 */
export class AsyncTaskParallelController {
    // 任务最大并发数
    maxParallel: number
    // 异步任务队列
    tasks: AsyncTask[]
    // 检查间隔时间，单位 ms
    checkInterval: number
    // 所有任务数量
    totalTasks: number

    constructor(maxParallel: number, checkInterval = 20) {
        this.tasks = []
        this.maxParallel = Number(maxParallel) || 20
        this.checkInterval = checkInterval
    }

    loadTasks(tasks: AsyncTask[]) {
        this.tasks.push(...tasks)
        this.totalTasks = this.tasks.length
    }

    push(task: AsyncTask) {
        this.tasks.push(task)
        this.totalTasks = this.tasks.length
    }

    // 开始执行任务
    async run(): Promise<any[]> {
        // 存储任务执行结果
        const results = []
        // 记录已经运行的任务
        const taskHasRun = []
        // 记录任务是否执行完成
        const taskDone = []
        // 当前正在运行的任务数量
        let runningTask = 0

        return new Promise(resolve => {
            // 使用定时器，不阻塞线程
            const timer = setInterval(() => {
                // 全部任务运行完成
                const taskDoneLength = taskDone.filter(item => item).length
                if (runningTask === 0 && taskDoneLength === this.totalTasks) {
                    clearInterval(timer)
                    resolve(results)
                }

                // 当前运行任务数超过最大并发，不再执行新的任务
                if (runningTask >= this.maxParallel) {
                    return
                }

                // 遍历任务列表，开始执行还没有执行的任务
                this.tasks.forEach((task, index) => {
                    if (!taskHasRun[index] && runningTask < this.maxParallel) {
                        runningTask++
                        taskHasRun[index] = 1
                        task()
                            .then(res => {
                                results[index] = res
                            })
                            .catch(err => {
                                results[index] = err
                            })
                            .then(() => {
                                runningTask--
                                taskDone[index] = 1
                            })
                    }
                })
            }, this.checkInterval)
        })
    }
}
