
export type IPCRequestID = number

export interface IPCRequest<T> {
    id: IPCRequestID
    argument: T
}

export interface IPCResponse {
    id: IPCRequestID
    status: 'resolved' | 'rejected' | 'data'
}

export interface IPCResolution<T> extends IPCResponse {
    status: 'resolved'
    value: T
}

export interface IPCRejection<T> extends IPCResponse {
    status: 'rejected'
    error: T
}

export interface IPCData<T> extends IPCResponse {
    status: 'data'
    data: T
}

export function isResolution(response: IPCResponse): response is IPCResolution<any> {
    return response.status === 'resolved'
}

export function isRejection(response: IPCResponse): response is IPCRejection<any> {
    return response.status === 'rejected'
}

export function isData(response: IPCResponse): response is IPCData<any> {
    return response.status === 'data'
}
