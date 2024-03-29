import { UA } from 'jssip'
import { EventEmitter } from 'events'
import {
    CallListener,
    ConfirmedListener,
    ConnectingListener,
    DTMFListener,
    EndListener,
    HoldListener,
    IceCandidateListener,
    InfoListener,
    MuteListener,
    PeerConnectionListener,
    ReferListener,
    ReInviteListener,
    SDPListener,
    SendingListener,
    UpdateListener,
    SessionDirection,
    RTCPeerConnectionDeprecated,
    OnHoldResult,
    MediaConstraints,
    RTCSession,
    AnswerOptions
} from 'jssip/lib/RTCSession'
import { CallOptionsExtended } from '@/types/rtc'

type UAType = typeof UA
type Listener = (event: unknown) => void

export interface MSRPOptions extends AnswerOptions {
    eventHandlers?: Partial<MSRPSessionEventMap>
    anonymous?: boolean;
    fromUserName?: string;
    fromDisplayName?: string;
}

export interface MSRPSessionEventMap {
    'peerconnection': PeerConnectionListener;
    'connecting': ConnectingListener;
    'sending': SendingListener;
    'progress': CallListener;
    'accepted': CallListener;
    'confirmed': ConfirmedListener;
    'ended': EndListener;
    'failed': EndListener;
    'newDTMF': DTMFListener;
    'newInfo': InfoListener;
    'hold': HoldListener;
    'unhold': HoldListener;
    'muted': MuteListener;
    'unmuted': MuteListener;
    'reinvite': ReInviteListener;
    'update': UpdateListener;
    'refer': ReferListener;
    'replaces': ReferListener;
    'sdp': SDPListener;
    'icecandidate': IceCandidateListener;
    'getusermediafailed': Listener;
    'active' : Listener;
    'msgHistoryUpdate' : Listener;
    'newMessage' : Listener;
    'peerconnection:createofferfailed': Listener;
    'peerconnection:createanswerfailed': Listener;
    'peerconnection:setlocaldescriptionfailed': Listener;
    'peerconnection:setremotedescriptionfailed': Listener;
}

declare enum SessionStatus {
    STATUS_NULL = 0,
    STATUS_INVITE_SENT = 1,
    STATUS_1XX_RECEIVED = 2,
    STATUS_INVITE_RECEIVED = 3,
    STATUS_WAITING_FOR_ANSWER = 4,
    STATUS_ANSWERED = 5,
    STATUS_WAITING_FOR_ACK = 6,
    STATUS_CANCELED = 7,
    STATUS_TERMINATED = 8,
    STATUS_CONFIRMED = 9
}

export interface UAExtendedInterface extends UA {
    //_msrp_sessions: MSRPSession[]
    _transactions: {
        nist: object,
        nict: object,
        ist: object,
        ict: object
    }

    call (target: string, options?: CallOptionsExtended): RTCSession
    newMSRPSession (session: MSRPSession, data: object): void
    destroyMSRPSession (session: MSRPSession): void
    receiveRequest (request: any): void
    startMSRP (target: string, options: MSRPOptions): MSRPSession
    terminateMSRPSessions (options: object): void
    stop (): void
}

export class MSRPSession extends EventEmitter {
    _ua: UAExtendedInterface
    id: any
    credentials: any
    status: string
    target: string
    message: string

    constructor(ua: UAExtendedInterface)

    get direction(): SessionDirection;

    get connection(): RTCPeerConnectionDeprecated;

    get start_time(): Date;

    isOnHold(): OnHoldResult;

    mute(options?: MediaConstraints): void;

    unmute(options?: MediaConstraints): void;

    init_incoming(request: any): void;

    isEnded(): boolean;

    connect(target?:string): void

    sendMSRP(message: string): void

    _sendOk(message: string): void

    _sendReport(message: string): void

    terminate(options?: any): void

    receiveRequest(request: unknown): void

    on<T extends keyof MSRPSessionEventMap>(type: T, listener: MSRPSessionEventMap[T]): this;
}

export interface DialogType {
    owner: MSRPSession
    receiveRequest(request: any): void
}
