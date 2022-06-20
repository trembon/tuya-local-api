export default class Logger {
    static Info(text: string): void {
        this.Output('INFO', text);
    }

    static Debug(text: string, data?: any): void {
        this.Output('DEBUG', text, data);
    }

    static Error(text: string, data?: any): void {
        this.Output('ERROR', text, data);
    }

    private static Output(type: string, text: string, data?: any){
        const outputText = `${new Date().toUTCString()} - ${type} - ${text}`;
        if(data){
            console.log(outputText, data);
        }else{
            console.log(outputText);
        }
    }
}