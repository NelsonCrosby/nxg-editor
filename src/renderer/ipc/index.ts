import { send } from './manager'

export { send, setup } from './manager'

export function say(message: string): Promise<string> {
    return send('say', message)
}
