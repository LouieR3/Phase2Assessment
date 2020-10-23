export class Config {
    allowBack: boolean;

    constructor(data: any) {
        data = data || {};
        this.allowBack = data.allowBack;
    }
}
