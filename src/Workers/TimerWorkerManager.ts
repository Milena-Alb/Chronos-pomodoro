let instance: TimerWorkerManager | null = null

export class TimerWorkerManager {
    private worker: Worker;
    private constructor (){
        this.worker = new Worker(new URL('./timerWorker.js', import.meta.url));
    }
    static getIntance (){
        if (!instance){
            instance = new TimerWorkerManager();
        }
        return instance;
    }
    postMessage(message: any){
        this.worker.postMessage(message);
    }

    onMessage(cb: (e: MessageEvent) => void){
        this.worker.onmessage = cb;
    }

    terminate(){
        this.worker.terminate();
        instance = null;
    }
}