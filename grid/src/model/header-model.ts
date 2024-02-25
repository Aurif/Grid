import { enableCommandLogging, type Command, command } from "@/common/command";
import { blankContext, type ContextCall } from "@/common/context";
import type { DisplayStateReader } from "./display-state";

export default class HeaderModel {
    private renderCommand: Command<[x: number, y: number, char: string]>;
    private state: DisplayStateReader;
    private content: string = '';

    constructor(renderCommand: Command<[x: number, y: number, char: string]>, state: DisplayStateReader) {
        this.renderCommand = renderCommand;
        this.state = state;
        state.watchResize(() => {
            let call = blankContext()
            call(this.setContent, this.content)
        })
        enableCommandLogging(this);
    }

    setContent = command((call: ContextCall, content: string) => {
        this.content = content
        let startX = Math.floor((this.state.columns-content.length)/2)
        for(let [i, char] of content.split('').entries()) 
            call(this.renderCommand, startX+i, 0, char);
    })
}