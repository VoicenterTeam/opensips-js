import { ICall, StreamMediaType, MediaEvent } from '@/types/rtc'

type ICallKey = keyof ICall
const CALL_KEYS_TO_INCLUDE: Array<ICallKey> = [
    'roomId',
    '_audioMuted',
    '_cancel_reason',
    '_contact',
    'direction',
    '_end_time',
    '_eventsCount',
    '_from_tag',
    '_id',
    '_is_canceled',
    '_is_confirmed',
    '_late_sdp',
    '_localHold',
    '_videoMuted',
    'status',
    'start_time',
    '_remote_identity',
    'audioTag',
    //'audioQuality',
    'isOnHold',
    //'originalStream',
    'localMuted'
]

export function simplifyCallObject (call: ICall): { [key: string]: any } {
    //const simplified: { [key: string]: ICall[ICallKey] } = {}
    const simplified: { [key: string]: any } = {} as ICall

    CALL_KEYS_TO_INCLUDE.forEach(key => {
        if (call[key] !== undefined) {
            simplified[key] = call[key]
        }
    })

    simplified.localHold = call._localHold

    return simplified
}

export function processAudioVolume (stream: MediaStream, volume: number) {
    const audioContext = new AudioContext()
    const audioSource = audioContext.createMediaStreamSource(stream)
    const audioDestination = audioContext.createMediaStreamDestination()
    const gainNode = audioContext.createGain()
    audioSource.connect(gainNode)
    gainNode.connect(audioDestination)
    gainNode.gain.value = volume

    return audioDestination.stream
}

export function syncStream (event: MediaEvent, call: ICall, outputDevice: string, volume: number) {
    const audio = document.createElement('audio') as StreamMediaType

    audio.id = call._id
    audio.class = 'audioTag'
    audio.srcObject = event.stream
    audio.setSinkId(outputDevice)
    audio.volume = volume
    audio.play()
    call.audioTag = audio
}