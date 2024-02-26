import { enableCommandLogging, type Command, command } from "@/common/command";
import { blankContext, type ContextCall } from "@/common/context";
import type { StateDisplayReader } from "./state-display";

export default class ModelHeader {
    private renderCommand: Command<[x: number, y: number, char: string]>;
    private state: StateDisplayReader;
    private content: string = '';

    constructor(renderCommand: Command<[x: number, y: number, char: string]>, state: StateDisplayReader) {
        this.renderCommand = renderCommand;
        this.state = state;
        state.watchResize(() => {
            const call = blankContext()
            call(this.setContent, this.content)
        })
        enableCommandLogging(this);
    }

    setContent = command((call: ContextCall, content: string) => {
        this.content = content
        const startX = Math.floor((this.state.columns-content.length)/2)
        for(const [i, char] of content.split('').entries()) 
            call(this.renderCommand, startX+i, 0, char);
    })
}