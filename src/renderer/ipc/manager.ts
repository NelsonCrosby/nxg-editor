import { ipcRenderer as ipc, Event } from 'electron'
import { IPCRequest, IPCResponse, IPCRequestID, IPCResolution, IPCRejection, isResolution, isRejection } from '../../common/ipc-api'

interface ResponseHandlerInfo {
    resolve?: (value: IPCResolution<any>) => void
    reject?: (reason: IPCRejection<any>) => void
    promise?: Promise<IPCResolution<any>>
}

const pendingRequests: Map<IPCRequestID, ResponseHandlerInfo> = new Map()
let nextId: number = 0

function registerRequest<A, R>(request: IPCRequest<A>): Promise<R> {
    let info: ResponseHandlerInfo = {}
    info.promise = new Promise((resolve, reject) => {
        info.resolve = resolve
        info.reject = reject
    })
    pendingRequests.set(request.id, info)
    return info.promise.then(
        (response: IPCResolution<any>) => response.value,
        (rejection: IPCRejection<any>) => Promise.reject(rejection.error)
    )
}

function handleResponse(response: IPCResponse): void {
    let info = pendingRequests.get(response.id)
    if (info == null) { return }

    if (isResolution(response)) {
        if (info.resolve != null) {
            info.resolve(response)
        }
    } else if (isRejection(response)) {
        if (info.reject != null) {
            info.reject(response)
        }
    }
}

export function send<A, R>(channel: string, argument: A): Promise<R> {
    let request: IPCRequest<A> = { id: nextId++, argument }
    let promise = registerRequest<A, R>(request)
    ipc.send(channel, request)
    return promise
}

export function setup() {
    ipc.on('response', (_: Event, response: IPCResponse) => {
        handleResponse(response)
    })
}
