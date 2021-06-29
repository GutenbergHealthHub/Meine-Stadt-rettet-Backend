import { BaseModel, Parse } from './base';

export class IncomingSMS extends BaseModel {
    public static PARSE_CLASSNAME = 'IncomingSMS';

    private _apiProvider: string;
    private _apiProviderTime: Date;
    private _senderAddress: string;
    private _receiverAddress: string;
    private _content: string;
    private _processingList: Array<IncomingSMSProcessingListEntry>;

    constructor() {
        super(IncomingSMS.PARSE_CLASSNAME);
        this.processingList = this.initArray(this.processingList);
    }

    public get apiProvider(): string {
        return this._apiProvider;
    }

    public get apiProviderTime(): Date {
        return this._apiProviderTime;
    }

    public get senderAddress(): string {
        return this._senderAddress;
    }

    public get receiverAddress(): string {
        return this._receiverAddress;
    }

    public get content(): string {
        return this._content;
    }

    public get processingList(): Array<IncomingSMSProcessingListEntry> {
        return this._processingList;
    }

    public set apiProvider(value: string) {
        this._apiProvider = value;
    }

    public set apiProviderTime(value: Date) {
        this._apiProviderTime = value;
    }

    public set senderAddress(value: string) {
        this._senderAddress = value;
    }

    public set receiverAddress(value: string) {
        this._receiverAddress = value;
    }

    public set content(value: string) {
        this._content = value;
    }

    public set processingList(value: Array<IncomingSMSProcessingListEntry>) {
        this._processingList = value;
    }
}

export class IncomingSMSProcessingListEntry {
    private methodIdentifier: string;
    private processingStart: Date;
    private result: IncomingSMSProcessingListEntryResult;
    private processingEnd: Date;

    constructor(methodIdentifier: string) {
        this.methodIdentifier = methodIdentifier;
        this.processingStart = new Date();
    }

    public setResult(result: IncomingSMSProcessingListEntryResult): void {
        this.result = result;
        this.processingEnd = new Date();
    }

    public getResult(): IncomingSMSProcessingListEntryResult {
        return this.result;
    }
}

export class IncomingSMSProcessingListEntryResult {
    public status: number;
    public message: string | null;

    public static ok(): IncomingSMSProcessingListEntryResult  {
        return new IncomingSMSProcessingListEntryResult(0);
    }

    public static error(message: string): IncomingSMSProcessingListEntryResult  {
        return new IncomingSMSProcessingListEntryResult(-1, message);
    }

    public static errorWithStatus(status: number, message: string): IncomingSMSProcessingListEntryResult  {
        return new IncomingSMSProcessingListEntryResult(status, message);
    }

    private constructor(status: number, message: string = null) {
        this.status = status;
        this.message = message;
    }
}

BaseModel.registerClass(IncomingSMS, IncomingSMS.PARSE_CLASSNAME);
