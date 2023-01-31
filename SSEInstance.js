class SSEInstance {
    constructor(url, callbacks) {
        this.source = new EventSource(url);
        this.source.onmessage = function(e){
            if(e.data == '[DONE]'){
                this.close()
                callbacks.onmessage("")
            }else {
                const msgInfo = JSON.parse(e.data)
                callbacks.onmessage(msgInfo.choices[0].text);
            }
        }
        this.source.onerror = function (e) {
            this.close()
            callbacks.onerror('[SSE] An error occurred while attempting to connect.');
        };
        this.source.onopen = function (e) {
            callbacks.onopen(e);
        }
    }

    _getState(s) {
        switch(s){
            case 0:
                return "STATE_CONNECTING";
            case 1:
                return "STATE_OPEN";
            default: 
                return "STATE_CLOSED";
        }
    }

    close() {
        this.source.close()
    }

    info() {
        return ({
            events: "message",
            state: this._getState(this.source.readyState),
        })
    }
}