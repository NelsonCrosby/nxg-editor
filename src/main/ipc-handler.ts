import { ipcMain as ipc, Event, WebContents } from 'electron'
import { IPCRequest, IPCResolution, IPCRejection } from '../common/ipc-api'

export type IPCBasicHandler<A, R> = (event: Event, argument: A) => R
export type IPCCallbackHandler<A> = IPCBasicHandler<IPCRequest<A>, void>
export type IPCAsyncHandler<A, R> = IPCBasicHandler<A, Promise<R>>

export function createPromise<T>(sender: WebContents, req: IPCRequest<any>, p: Promise<T>): Promise<T> {
    return p.then(
        value => {
            let arg: IPCResolution<T> = { id: req.id, status: 'resolved', value }
            sender.send('response', arg)
            return value
        },
        reason => {
            let arg: IPCRejection<any> = { id: req.id, status: 'rejected', error: reason }
            sender.send('response', arg)
            return Promise.reject(reason)
        }
    )
}

export function createHandler<A, R>(
    start: IPCAsyncHandler<A, R>
): IPCCallbackHandler<A> {
    return (event, request) => {
        createPromise(event.sender, request, start(event, request.argument))
    }
}

export function handle<A, R>(
    channel: string,
    start: IPCAsyncHandler<A, R>
): void {
    ipc.on(channel, createHandler(start))
}

export default function setup() {
    handle('say', (_, msg: string) => Promise.resolve(msg))
}
